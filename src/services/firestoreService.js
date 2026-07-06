import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, auth, isFirebaseConfigured } from '../firebase/config';
import { isAdminUser } from '../config/admin';
import { assertFirestoreReady, logFirestoreError, formatFirestoreError } from '../firebase/firestoreReady';
import { serviceCategories as defaultServices } from '../data/services';
import { defaultPolicies } from '../data/defaultPolicies';
import { defaultSiteSettings, defaultTestimonials } from '../data/defaultSiteSettings';
import { syncToRealtimeDB, seedRtdbIfEmpty } from './rtdbService';

const COLLECTIONS = {
  services: 'serviceCategories',
  policies: 'policies',
  bookings: 'bookings',
  gallery: 'gallery',
  testimonials: 'testimonials',
  settings: 'settings',
  meta: 'meta',
};

const CATEGORY_ORDER = ['hair', 'makeup', 'facials', 'waxing', 'nails', 'lashes'];

function requireFirebase() {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase is not configured. Add your credentials to .env');
  }
}

/** Admin writes require a verified admin account (Firestore rules) */
function requireAuth() {
  requireFirebase();
  if (!auth?.currentUser) {
    throw new Error('You must be logged in to perform this action. Please sign in again.');
  }
  if (!isAdminUser(auth.currentUser)) {
    throw new Error('Your account is not authorized for admin actions.');
  }
}

/** Validate category object before write */
function validateCategory(category) {
  if (!category || typeof category.id !== 'string' || !category.id.trim()) {
    throw new Error('Invalid category: missing or empty id');
  }
  if (!Array.isArray(category.services)) {
    throw new Error('Invalid category: services must be an array');
  }
}

function sortCategories(categories) {
  return [...categories].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a.id);
    const bi = CATEGORY_ORDER.indexOf(b.id);
    if (ai === -1 && bi === -1) return a.title.localeCompare(b.title);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

/** Seed all collections and sync to Realtime Database */
export async function seedDatabaseIfEmpty() {
  requireFirebase();

  const metaRef = doc(db, COLLECTIONS.meta, 'app');
  const metaSnap = await getDoc(metaRef);

  if (metaSnap.exists() && metaSnap.data().seeded) {
    const settingsSnap = await getDoc(doc(db, COLLECTIONS.settings, 'site'));
    const testimonialsSnap = await getDocs(collection(db, COLLECTIONS.testimonials));
    await syncToRealtimeDB({
      settings: settingsSnap.data() || defaultSiteSettings,
      testimonials: testimonialsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    });
    await seedRtdbIfEmpty();
    return;
  }

  const servicesSnap = await getDocs(collection(db, COLLECTIONS.services));
  const batch = writeBatch(db);

  if (servicesSnap.empty) {
    defaultServices.forEach((cat, index) => {
      const catRef = doc(db, COLLECTIONS.services, cat.id);
      batch.set(catRef, {
        id: cat.id,
        title: cat.title,
        icon: cat.icon,
        order: index,
        services: cat.services.map((s, i) => ({
          id: `${cat.id}-svc-${i}`,
          name: s.name,
          price: s.price,
        })),
      });
    });
  }

  const policiesRef = doc(db, COLLECTIONS.policies, 'main');
  const policiesSnap = await getDoc(policiesRef);
  if (!policiesSnap.exists()) {
    batch.set(policiesRef, { policies: defaultPolicies });
  }

  const settingsRef = doc(db, COLLECTIONS.settings, 'site');
  const settingsSnap = await getDoc(settingsRef);
  if (!settingsSnap.exists()) {
    batch.set(settingsRef, { ...defaultSiteSettings, updatedAt: serverTimestamp() });
  }

  batch.set(metaRef, { seeded: true, seededAt: serverTimestamp() });
  await batch.commit();

  const testimonialsSnap = await getDocs(collection(db, COLLECTIONS.testimonials));
  if (testimonialsSnap.empty) {
    await Promise.all(
      defaultTestimonials.map((t) =>
        setDoc(doc(db, COLLECTIONS.testimonials, t.id), { ...t })
      )
    );
  }

  const settings = (await getDoc(settingsRef)).data() || defaultSiteSettings;
  const testimonialDocs = await getDocs(collection(db, COLLECTIONS.testimonials));
  const testimonials = testimonialDocs.docs.map((d) => ({ id: d.id, ...d.data() }));

  await syncToRealtimeDB({ settings, testimonials });
  await seedRtdbIfEmpty();
}

/** Subscribe to service categories in real time */
export function subscribeServices(callback) {
  if (!isFirebaseConfigured() || !db) {
    callback(defaultServices, { isLive: false });
    return () => {};
  }

  return onSnapshot(
    collection(db, COLLECTIONS.services),
    (snapshot) => {
      if (snapshot.empty) {
        callback(defaultServices, { isLive: false, isEmpty: true });
        return;
      }
      const categories = sortCategories(
        snapshot.docs.map((d) => ({ ...d.data(), id: d.id }))
      );
      callback(categories, { isLive: true });
    },
    (error) => {
      console.error('Firestore services error:', error);
      callback(defaultServices, { isLive: false, error: error.message });
    }
  );
}

/** Subscribe to site settings */
export function subscribeSiteSettings(callback) {
  if (!isFirebaseConfigured() || !db) {
    callback(defaultSiteSettings);
    return () => {};
  }

  const settingsRef = doc(db, COLLECTIONS.settings, 'site');
  return onSnapshot(
    settingsRef,
    (snapshot) => {
      callback(snapshot.exists() ? snapshot.data() : defaultSiteSettings);
    },
    () => callback(defaultSiteSettings)
  );
}

/** Save site settings */
export async function saveSiteSettings(settings) {
  requireFirebase();
  const settingsRef = doc(db, COLLECTIONS.settings, 'site');
  await setDoc(settingsRef, { ...settings, updatedAt: serverTimestamp() }, { merge: true });

  const testimonialSnap = await getDocs(collection(db, COLLECTIONS.testimonials));
  const testimonials = testimonialSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  await syncToRealtimeDB({ settings, testimonials });
}

/** Subscribe to testimonials */
export function subscribeTestimonials(callback) {
  if (!isFirebaseConfigured() || !db) {
    callback(defaultTestimonials);
    return () => {};
  }

  return onSnapshot(
    collection(db, COLLECTIONS.testimonials),
    (snapshot) => {
      if (snapshot.empty) {
        callback(defaultTestimonials);
        return;
      }
      const list = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      callback(list);
    },
    () => callback(defaultTestimonials)
  );
}

/** Sync testimonials to Realtime Database after changes */
async function syncTestimonialsToRtdb() {
  const settingsSnap = await getDoc(doc(db, COLLECTIONS.settings, 'site'));
  const testimonialsSnap = await getDocs(collection(db, COLLECTIONS.testimonials));
  await syncToRealtimeDB({
    settings: settingsSnap.data() || defaultSiteSettings,
    testimonials: testimonialsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
  });
}

/** Add testimonial */
export async function addTestimonial(data) {
  requireFirebase();
  const id = `t-${Date.now()}`;
  await setDoc(doc(db, COLLECTIONS.testimonials, id), { ...data, id });
  await syncTestimonialsToRtdb();
  return id;
}

/** Update testimonial */
export async function updateTestimonial(id, data) {
  requireFirebase();
  await updateDoc(doc(db, COLLECTIONS.testimonials, id), data);
  await syncTestimonialsToRtdb();
}

/** Delete testimonial */
export async function deleteTestimonial(id) {
  requireFirebase();
  await deleteDoc(doc(db, COLLECTIONS.testimonials, id));
  await syncTestimonialsToRtdb();
}

/** Ensure service categories exist in Firestore (creates them if missing) */
export async function ensureServicesInFirestore() {
  requireAuth();
  assertFirestoreReady();

  try {
    const servicesSnap = await getDocs(collection(db, COLLECTIONS.services));
    if (!servicesSnap.empty) {
      console.info('[Firestore] Services collection already populated');
      return false;
    }
  } catch (err) {
    logFirestoreError('ensureServicesInFirestore/read', err);
    throw new Error(formatFirestoreError(err), { cause: err });
  }

  try {
    const batch = writeBatch(db);
    defaultServices.forEach((cat, index) => {
      batch.set(doc(db, COLLECTIONS.services, cat.id), {
        id: cat.id,
        title: cat.title,
        icon: cat.icon,
        order: index,
        services: cat.services.map((s, i) => ({
          id: `${cat.id}-svc-${i}`,
          name: s.name,
          price: s.price,
        })),
      });
    });
    await batch.commit();
    console.info('[Firestore] Services seeded successfully');
    return true;
  } catch (err) {
    logFirestoreError('ensureServicesInFirestore/write', err);
    throw new Error(formatFirestoreError(err), { cause: err });
  }
}

/** Write a full category document directly — never calls getDoc */
async function saveCategory(category) {
  requireAuth();
  validateCategory(category);
  assertFirestoreReady();

  const catRef = doc(db, COLLECTIONS.services, category.id);
  const payload = {
    id: category.id,
    title: category.title,
    icon: category.icon,
    order: category.order ?? CATEGORY_ORDER.indexOf(category.id),
    services: category.services,
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(catRef, payload, { merge: true });
    console.info('[Firestore] Category saved:', category.id);
  } catch (err) {
    logFirestoreError('saveCategory', err, { categoryId: category.id });
    throw new Error(formatFirestoreError(err), { cause: err });
  }
}

/** Add a new service to a category */
export async function addService(category, name, price) {
  if (!name?.trim() || !price?.trim()) {
    throw new Error('Service name and price are required');
  }
  const newService = { id: `svc-${Date.now()}`, name: name.trim(), price: price.trim() };
  await saveCategory({
    ...category,
    services: [...(category.services || []), newService],
  });
  return newService;
}

/** Update a service name or price */
export async function updateService(category, serviceId, updates) {
  if (!serviceId) throw new Error('Invalid service: missing id');

  const services = (category.services || []).map((s) =>
    s.id === serviceId ? { ...s, ...updates } : s
  );

  if (!services.some((s) => s.id === serviceId)) {
    throw new Error(`Service "${serviceId}" not found in category "${category.id}"`);
  }

  await saveCategory({ ...category, services });
}

/** Delete a service from a category */
export async function deleteService(category, serviceId) {
  if (!serviceId) throw new Error('Invalid service: missing id');

  const services = (category.services || []).filter((s) => s.id !== serviceId);

  if (services.length === (category.services || []).length) {
    throw new Error(`Service "${serviceId}" not found in category "${category.id}"`);
  }

  await saveCategory({ ...category, services });
}

/** Subscribe to policies document */
export function subscribePolicies(callback) {
  if (!isFirebaseConfigured() || !db) {
    callback(defaultPolicies);
    return () => {};
  }

  const policiesRef = doc(db, COLLECTIONS.policies, 'main');
  return onSnapshot(
    policiesRef,
    (snapshot) => {
      callback(snapshot.exists() ? snapshot.data().policies || defaultPolicies : defaultPolicies);
    },
    () => callback(defaultPolicies)
  );
}

/** Save updated policies array */
export async function savePolicies(policies) {
  requireFirebase();
  const policiesRef = doc(db, COLLECTIONS.policies, 'main');
  await setDoc(policiesRef, { policies, updatedAt: serverTimestamp() }, { merge: true });
}

/** Create a customer booking */
export async function createBooking(bookingData) {
  requireFirebase();
  return addDoc(collection(db, COLLECTIONS.bookings), {
    ...bookingData,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}

/** Subscribe to all bookings (newest first) */
export function subscribeBookings(callback) {
  if (!isFirebaseConfigured() || !db) {
    callback([]);
    return () => {};
  }

  return onSnapshot(
    collection(db, COLLECTIONS.bookings),
    (snapshot) => {
      const bookings = snapshot.docs
        .map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate?.() || null,
        }))
        .sort((a, b) => {
          const ta = a.createdAt?.getTime?.() || 0;
          const tb = b.createdAt?.getTime?.() || 0;
          return tb - ta;
        });
      callback(bookings);
    },
    () => callback([])
  );
}

/** Update booking status */
export async function updateBookingStatus(bookingId, status) {
  requireFirebase();
  await updateDoc(doc(db, COLLECTIONS.bookings, bookingId), { status });
}

/** Upload salon image to Storage and save metadata to Firestore */
export async function uploadSalonImage(file) {
  requireFirebase();
  if (!storage) throw new Error('Firebase Storage is not configured');

  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storageRef = ref(storage, `salon/${Date.now()}-${safeName}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  const docRef = await addDoc(collection(db, COLLECTIONS.gallery), {
    url,
    fileName: file.name,
    storagePath: storageRef.fullPath,
    createdAt: serverTimestamp(),
  });

  return { id: docRef.id, url, fileName: file.name };
}

/** Subscribe to gallery images */
export function subscribeGallery(callback) {
  if (!isFirebaseConfigured() || !db) {
    callback([]);
    return () => {};
  }

  return onSnapshot(
    collection(db, COLLECTIONS.gallery),
    (snapshot) => {
      const images = snapshot.docs
        .map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate?.() || null,
        }))
        .sort((a, b) => {
          const ta = a.createdAt?.getTime?.() || 0;
          const tb = b.createdAt?.getTime?.() || 0;
          return tb - ta;
        });
      callback(images);
    },
    () => callback([])
  );
}

/** Delete gallery image from Storage and Firestore */
export async function deleteSalonImage(imageId, storagePath) {
  requireFirebase();
  if (storagePath && storage) {
    try {
      await deleteObject(ref(storage, storagePath));
    } catch {
      // File may already be deleted
    }
  }
  await deleteDoc(doc(db, COLLECTIONS.gallery, imageId));
}

/** Set a gallery image as hero or about image in settings */
export async function setFeaturedImage(field, imageUrl) {
  requireFirebase();
  const settingsRef = doc(db, COLLECTIONS.settings, 'site');
  const snap = await getDoc(settingsRef);
  const current = snap.exists() ? snap.data() : defaultSiteSettings;

  const updated = { ...current };
  if (field === 'hero') {
    updated.hero = { ...updated.hero, imageUrl };
  } else if (field === 'about') {
    updated.about = { ...updated.about, imageUrl };
  } else if (field === 'founder') {
    updated.about = { ...updated.about, founderImageUrl: imageUrl };
  }

  await saveSiteSettings(updated);
}

/** Flatten services for booking dropdown */
export function flattenServices(categories) {
  return categories.flatMap((cat) =>
    (cat.services || []).map((s) => ({
      value: `${cat.id}:${s.name}`,
      label: `${cat.title} — ${s.name}`,
      category: cat.title,
      name: s.name,
      price: s.price,
    }))
  );
}
