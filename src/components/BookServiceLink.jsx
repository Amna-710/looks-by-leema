import { Link } from 'react-router-dom';
import { getBookingLinkProps } from '../utils/bookingNavigation';

/** Link to /booking with an optional pre-selected service — same pattern as ServiceCard. */
export default function BookServiceLink({ serviceValue, className, children, ...rest }) {
  return (
    <Link {...getBookingLinkProps(serviceValue)} className={className} {...rest}>
      {children}
    </Link>
  );
}
