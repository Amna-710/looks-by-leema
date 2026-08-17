/** Build booking route with optional pre-selected service (survives refresh via query param). */
export function buildBookingPath(serviceValue) {
  if (!serviceValue) return '/booking';
  return `/booking?service=${encodeURIComponent(serviceValue)}`;
}

/** Props for React Router `<Link>` — query param + state, matching ServiceCard behavior. */
export function getBookingLinkProps(serviceValue) {
  if (!serviceValue) return { to: '/booking' };
  return {
    to: buildBookingPath(serviceValue),
    state: { service: serviceValue },
  };
}

/** `{categoryId}:{serviceName}` value used by the booking form dropdown. */
export function serviceValue(categoryId, serviceName) {
  return `${categoryId}:${serviceName}`;
}
