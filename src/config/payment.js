/** Required advance/deposit amount for online bookings (USD) */
export const ADVANCE_PAYMENT_AMOUNT = 50;

export const ADVANCE_PAYMENT_LABEL = '$50';

/**
 * Zelle recipient — update with your Zelle email or US mobile number.
 * Do not commit real payment credentials until you are ready to go live.
 */
export const ZELLE_RECIPIENT = '3478883225';

export const PAYMENT_METHODS = {
  CARD: 'card',
  ZELLE: 'zelle',
};

export const PAYMENT_STATUS = {
  NOT_REQUIRED: 'not_required',
  AWAITING_VERIFICATION: 'awaiting_verification',
  VERIFIED: 'verified',
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.CARD]: 'Credit/Debit Card',
  [PAYMENT_METHODS.ZELLE]: 'Zelle',
};

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.NOT_REQUIRED]: '—',
  [PAYMENT_STATUS.AWAITING_VERIFICATION]: 'Payment Pending',
  [PAYMENT_STATUS.VERIFIED]: 'Paid',
};

export const ZELLE_SUBMIT_INSTRUCTION =
  'Please send the advance payment through Zelle and submit your booking request.';
