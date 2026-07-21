function parseValue(field) {
  if (!field || typeof field !== 'object') return null;
  if ('stringValue' in field) return field.stringValue;
  if ('integerValue' in field) return Number(field.integerValue);
  if ('doubleValue' in field) return field.doubleValue;
  if ('booleanValue' in field) return field.booleanValue;
  if ('timestampValue' in field) return field.timestampValue;
  if ('nullValue' in field) return null;
  if ('arrayValue' in field) {
    return (field.arrayValue.values || []).map(parseValue);
  }
  if ('mapValue' in field) return parseFields(field.mapValue.fields || {});
  return null;
}

function parseFields(fields = {}) {
  const result = {};
  for (const [key, value] of Object.entries(fields)) {
    result[key] = parseValue(value);
  }
  return result;
}

export function getProjectId() {
  return process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
}

export async function getBooking(projectId, bookingId) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/bookings/${bookingId}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Booking not found (${res.status})`);
  }
  const doc = await res.json();
  return parseFields(doc.fields);
}

export async function patchBooking(projectId, bookingId, fields) {
  const firestoreFields = {};
  for (const [key, value] of Object.entries(fields)) {
    if (value === null || value === undefined) continue;
    if (typeof value === 'string') {
      firestoreFields[key] = { stringValue: value };
    } else if (value instanceof Date || (typeof value === 'string' && key.endsWith('At'))) {
      const iso = value instanceof Date ? value.toISOString() : value;
      firestoreFields[key] = { timestampValue: iso };
    }
  }

  const mask = Object.keys(firestoreFields)
    .map((key) => `updateMask.fieldPaths=${encodeURIComponent(key)}`)
    .join('&');

  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/bookings/${bookingId}?${mask}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: firestoreFields }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to update booking email status (${res.status}): ${body.slice(0, 200)}`);
  }
}
