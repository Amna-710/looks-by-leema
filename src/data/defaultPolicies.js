/** Default studio policies — used for seeding Firestore */
export const defaultPolicies = [
  {
    title: 'Booking Policy',
    icon: '📅',
    items: [
      'Online appointments only',
      '$10 non-refundable deposit required',
      'Remaining payment after service',
    ],
  },
  {
    title: 'Cancellation',
    icon: '🔄',
    items: [
      'Reschedule up to 24 hours before appointment',
      'Late cancellation loses deposit',
      'No-show clients pay 50% before rebooking',
    ],
  },
  {
    title: 'Late Policy',
    icon: '⏰',
    items: [
      '10-minute grace period',
      'After 15 minutes appointment may be cancelled',
    ],
  },
  {
    title: 'Guests',
    icon: '👤',
    items: [
      'No extra guests',
      'Children only if being serviced',
    ],
  },
  {
    title: 'Payments',
    icon: '💳',
    items: [
      'Cash',
      'Zelle',
      'Credit/Debit Card',
    ],
  },
  {
    title: 'Photography',
    icon: '📸',
    items: [
      'Before and after photos may be taken with client consent',
      'Images may be used for portfolio and social media',
      'Clients may decline photography at any time',
    ],
  },
];
