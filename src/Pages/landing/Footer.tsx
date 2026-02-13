import { nikitaAddress, helpLine, nikitaEmail } from "../../constants/info";
import { useRef } from "react";

const LandingFooter: React.FC = () => {
  const clickCount = useRef(0);

  return (
    <footer className="landing-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h4 className="footer-heading">Contact Us</h4>
            <div className="footer-links">
              <p
                onClick={() => {
                  clickCount.current++;
                  if (clickCount.current % 3 === 0) localStorage.clear();
                }}
              >
                Phone: +91-{helpLine}
              </p>
              <p>Email: {nikitaEmail}</p>
              <p className="footer-address">{nikitaAddress}</p>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Legal</h4>
            <div className="footer-links">
              <a
                href={require("../../docs/Privacy-Policy.pdf")}
                download="ZenfitX-Privacy-Policy"
              >
                Privacy Policy
              </a>
              <a
                href={require("../../docs/TNC.pdf")}
                download="ZenfitX-TNC"
              >
                Terms & Conditions
              </a>
              <a
                href={require("../../docs/Refund-Cancellation-Policy.pdf")}
                download="ZenfitX-Refund&Cancellation"
              >
                Refund & Cancellation
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ZenfitX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
