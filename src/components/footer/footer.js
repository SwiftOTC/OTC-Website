import React, { useState, useEffect } from "react";
import "./footer.css";
import ethIcon from "../../assets/svg/ethIcon.svg";
import bnbIcon from "../../assets/svg/bnbIcon.svg";
import telegramIcon from "../../assets/svg/telegram.svg";
import twitterIcon from "../../assets/svg/twitter.svg";
import mediumIcon from "../../assets/svg/medium.svg";
import ordersIcon from "../../assets/svg/ordersIcon.svg";
import certik from "../../assets/svg/certik.svg";

import logo2 from "../../assets/svg/logowhite.svg";

import axios from "axios";
import getFormattedNumber from "../../hooks/get-formatted-number";
import { NavLink } from "react-router-dom";

const Footer = ({ orders }) => {
  const [ethPrice, setEthPrice] = useState("");
  const [bnbPrice, setBnbPrice] = useState("");

  const fetchEthPrice = async () => {
    const result = await axios
      .get(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      )
      .catch((e) => {
        console.error(e);
      });

    if (result && result.status === 200) {
      localStorage.setItem("ethprice", result.data.ethereum.usd);
      setEthPrice(result.data.ethereum.usd);
    }
  };

  const fetchBnbPrice = async () => {
    const result = await axios
      .get(
        "https://api.coingecko.com/api/v3/simple/price?ids=wbnb&vs_currencies=usd"
      )
      .catch((e) => {
        console.error(e);
      });

    if (result && result.status === 200) {
      localStorage.setItem("bnbprice", result.data.wbnb.usd);
      setBnbPrice(result.data.wbnb.usd);
    }
  };

  const updateEthPrice = () => {
    const price = localStorage.getItem("ethprice");
    setEthPrice(price);

    const bnbprice = localStorage.getItem("bnbprice");
    setBnbPrice(bnbprice);
  };

  useEffect(() => {
    fetchEthPrice();
    fetchBnbPrice();
  }, []);

  useEffect(() => {
    updateEthPrice();
  }, [ethPrice, bnbPrice]);

  const year = new Date().getFullYear();

  return (
    <div className="footer-wrapper w-100 px-2 py-3">
      <footer>
        <div className="container-lg d-flex flex-column gap-4">
          <div className="footer-separator"></div>
          <div className="container-lg px-0 d-flex flex-column flex-lg-row gap-4 align-items-center justify-content-between w-100">
            <div className="d-flex flex-column gap-3 col-lg-3">
              <NavLink
                to={"/"}
                onClick={() => {
                  window.scrollTo(0, 0);
                }}
              >
                <img src={logo2} alt="" style={{ height: 45 }} />
              </NavLink>
              <span className="text-white footer-desc">
                A user-friendly, powerful and secure trading platform designed
                to simplify and streamline the trading experience for
                cryptocurrency enthusiasts.
              </span>
              <div className="d-flex gap-2 align-items-center w-100 justify-content-start">
                <a
                  href="https://twitter.com/swiftotc"
                  target={"_blank"}
                  rel="noreferrer"
                  className="footer-link"
                >
                  <img
                    src={twitterIcon}
                    alt=""
                    // style={{ width: 20, height: 20 }}
                  />{" "}
                </a>
                <a
                  href="https://t.me/swiftotc_announcements"
                  target={"_blank"}
                  rel="noreferrer"
                  className="footer-link"
                >
                  <img
                    src={telegramIcon}
                    alt=""
                    // style={{ width: 20, height: 20 }}
                  />
                </a>
                <a
                  href="https://medium.com/@swiftotc"
                  target={"_blank"}
                  rel="noreferrer"
                  className="footer-link"
                >
                  <img
                    src={mediumIcon}
                    alt=""
                    // style={{ width: 20, height: 20 }}
                  />
                </a>
              </div>
            </div>
            <div className="d-flex align-items-start gap-3 justify-content-between custom-width">
              <div className="d-flex flex-column gap-2">
                <h3 className="footer-title">Solutions</h3>
                <NavLink to={"/buy"} className="footer-link">
                  Buy
                </NavLink>
                <NavLink to={"/sell"} className="footer-link">
                  Sell
                </NavLink>
                <NavLink to={"/open-positions"} className="footer-link">
                  Open positions
                </NavLink>
              </div>
              <div className="d-flex flex-column gap-2">
                <h3 className="footer-title">Support</h3>
                <a
                  href="mailto:support@swiftotc.io"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-link"
                >
                  Support
                </a>

                <NavLink to={"/#faq"} className="footer-link">
                  FAQ
                </NavLink>
              </div>
              <div className="d-flex flex-column gap-2">
                <h3 className="footer-title">
                  Live Data<div className="pulsatingDot"></div>
                </h3>
                <div className="d-flex align-items-center gap-1">
                  <img src={ethIcon} alt="" width={20} />{" "}
                  <span className="footer-link text-white">
                    $ {getFormattedNumber(ethPrice)}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <img src={bnbIcon} alt="" width={20} />{" "}
                  <span className="footer-link text-white">
                    $ {getFormattedNumber(bnbPrice)}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <span className="footer-link text-white">
                    <img src={ordersIcon} alt="" />
                    Total Orders: {getFormattedNumber(orders, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <span className="copyrightTxt d-flex align-items-center gap-2">
              Audited By:
              <img src={certik} alt="" height={30} />
            </span>
          </div>
          <span className="w-100 d-flex align-items-center justify-content-center copyrightTxt">
            Copyright © {year} SwiftOTC. All Rights Reserved.{" "}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
