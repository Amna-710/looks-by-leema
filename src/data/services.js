/**
 * Service catalog for LooksByLeema Beauty Studio.
 * Each category contains an array of { name, price } items.
 */
export const serviceCategories = [
  {
    id: 'hair',
    title: 'Hair Services',
    icon: '✦',
    services: [
      { name: 'Blowout', price: '$35' },
      { name: "Women's Haircut", price: '$40' },
      { name: 'Root Touch-Up', price: '$45' },
      { name: 'Full Color', price: '$70' },
      { name: 'Keratin Treatment', price: '$150+' },
      { name: 'Hair Styling', price: '$35' },
      { name: 'Updo / Party Hairstyle', price: '$60' },
    ],
  },
  {
    id: 'makeup',
    title: 'Makeup Services',
    icon: '✦',
    services: [
      { name: 'Soft Glam', price: '$90' },
      { name: 'Full Glam', price: '$110' },
      { name: 'Party Makeup', price: '$120' },
      { name: 'Bridal Makeup', price: '$180' },
      { name: 'Bridal Trial', price: '$120' },
      { name: 'Add-On Lashes', price: '$10' },
    ],
  },
  {
    id: 'facials',
    title: 'Facials',
    icon: '✦',
    services: [
      { name: 'Basic Cleanup Facial', price: '$45' },
      { name: 'Hydrating Facial', price: '$60' },
      { name: 'Brightening Facial', price: '$70' },
      { name: 'Acne Treatment Facial', price: '$75' },
      { name: 'Anti-Aging Facial', price: '$85' },
      { name: 'Bridal Glow Facial', price: '$100' },
    ],
  },
  {
    id: 'waxing',
    title: 'Body Waxing',
    icon: '✦',
    services: [
      { name: 'Full Body Wax', price: '$150' },
      { name: 'Full Legs', price: '$45' },
      { name: 'Half Legs', price: '$25' },
      { name: 'Full Arms', price: '$30' },
      { name: 'Half Arms', price: '$20' },
      { name: 'Underarms', price: '$12' },
      { name: 'Brazilian', price: '$45' },
      { name: 'Bikini Line', price: '$20' },
      { name: 'Stomach', price: '$20' },
      { name: 'Back', price: '$40' },
      { name: 'Full Face', price: '$35' },
      { name: 'Eyebrows', price: '$12' },
      { name: 'Upper Lip', price: '$6' },
    ],
  },
  {
    id: 'nails',
    title: 'Manicure & Pedicure',
    icon: '✦',
    services: [
      { name: 'Basic Manicure', price: '$12' },
      { name: 'Basic Pedicure', price: '$20' },
      { name: 'Mani + Pedi Combo', price: '$30' },
      { name: 'Gel Manicure', price: '$25' },
      { name: 'Gel Pedicure', price: '$35' },
      { name: 'Nail Art', price: '$3–$5' },
      { name: 'French Add-On', price: '$5' },
    ],
  },
  {
    id: 'lashes',
    title: 'Lash Services',
    icon: '✦',
    services: [
      { name: 'Classic Full Set', price: '$90' },
      { name: 'Hybrid Full Set', price: '$110' },
      { name: 'Volume Full Set', price: '$130' },
      { name: 'Mega Volume', price: '$150' },
      { name: 'Classic Fill', price: '$50' },
      { name: 'Hybrid Fill', price: '$60' },
      { name: 'Volume Fill', price: '$70' },
      { name: 'Lash Lift', price: '$60' },
      { name: 'Lash Tint', price: '$20' },
      { name: 'Lift + Tint Combo', price: '$70' },
    ],
  },
];

/** Flat list for booking dropdown: "Category — Service Name" */
export const allServicesFlat = serviceCategories.flatMap((cat) =>
  cat.services.map((s) => ({
    value: `${cat.id}:${s.name}`,
    label: `${cat.title} — ${s.name}`,
    category: cat.title,
    name: s.name,
    price: s.price,
  }))
);
