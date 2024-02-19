import React, { useEffect } from "react";
import telegramIcon from "../../assets/svg/telegram.svg";
import emailIcon from "../../assets/svg/email.svg";
import "./support.css";

const Support = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="container-fluid faq-wrapper support-wrapper mb-5" >
      <div className="container-lg mt-5 mt-lg-0">
        <h1 className="text-white text-center"> Support</h1>

        <div className="d-flex flex-column gap-2">
          <span className="text-white text-center mb-4">
            We are happy to support about any issues you might be facing.
          </span>
          <div className="support-cards-grid">
            <div className="support-card support1 p-3 w-100">
              <div className="d-flex flex-column gap-2 h-100 justify-content-center">
                <img src={emailIcon} style={{ width: 30, height: 30 }} alt=''/>
                <span className="social-title">Email us</span>
                <span className="card-desc">
                  Estimated time to reply: 24 hours
                </span>
                <a className={"go-to-btn"} href="mailto:support@swiftotc.io">
                  Send email
                </a>
              </div>
            </div>
            <div className="support-card support2 p-3 w-100">
              <div className="d-flex flex-column gap-2 h-100 justify-content-center">
                <img src={telegramIcon} style={{ width: 30, height: 30 }} alt=''/>
                <span className="social-title">Telegram</span>
                <span className="card-desc">
                  Estimated time to reply: 24 hours
                </span>
                <a
                  className="go-to-btn"
                  href="https://t.me/swiftotc_official"
                  target="_blank"
                  rel="noreferrer"
                >
                  Go to Telegram
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
