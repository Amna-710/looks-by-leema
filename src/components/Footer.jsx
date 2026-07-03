import './Footer.css';

/** Site footer with tagline and copyright */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__brand">LooksByLeema</div>
        <p className="footer__tagline">
          Every client becomes part of the LooksByLeema family.
        </p>
        <div className="footer__divider" />
        <p className="footer__copy">
          &copy; {year} LooksByLeema Beauty Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
