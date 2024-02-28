import React from "react";
import "./homepage.css";

import one from "./assets/one.svg";
import two from "./assets/two.svg";
import three from "./assets/three.svg";

const TrustedContainer = () => {
  const otcBenefits = [
    {
      title: "Automated Request-for-Quote",
      desc: "Instantly obtain an optimal price quote from multiple dealers for every order.",
    },
    {
      title: "A range of order sizes",
      desc: "Place buy/sell orders between $100k-$1M* per transaction.",
    },
    {
      title: "Available assets",
      desc: "Choose from a variety of assets for placing buy/sell orders.",
    },
    {
      title: "Guaranteed privacy",
      desc: "SwiftOTC acts as an intermediary to keep your transactions anonymous towards OTC dealers.",
    },
  ];

  return (
    <div className="container-fluid faq-wrapper my-5">
      <div className="container-lg">
        <div className="d-flex flex-column gap-5 animationText">
          <div className="d-flex flex-column gap-5">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <h1 className="text-white font-organetto mainhero-title m-0">
                <mark className="bg-transparent quicktitle font-organetto">
                  Build your order
                </mark>{" "}
                from a range of options
              </h1>
              <span className="bottom-text-dexc">
                We take care of everything else
              </span>
            </div>
            <div className="cards-upper-container-wrapper">
              {otcBenefits.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="cards-upper-container-item px-3 py-5"
                  >
                    <div className="d-flex flex-column h-100 justify-content-center align-items-center gap-3">
                      <span className="otcbenefit-title font-organetto">
                        {item.title}
                      </span>
                      <span className="otcbenefit-desc">{item.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-5 otc-bottom-blue-wrapper">
            <div className="d-flex flex-column gap-3 align-items-center justify-content-center">
              <h1 className="text-white font-organetto mainhero-title m-0">
                WHY
                <mark className="bg-transparent quicktitle font-organetto">
                  SWIFTOTC
                </mark>
              </h1>

              <div className="cards-wrapper align-items-center">
                <div className="trust-card-wrapper p-3">
                  <div className="d-flex flex-column gap-2 align-items-center">
                    <img src={one} alt="" />
                    <h3 className="card-title font-organetto">Be Protected</h3>
                    <span className="card-desc text-white text-center">
                      SwiftOTC shields DeFi traders from unpredictable market
                      turbulence, ensuring a user-friendly peer-to-peer trading
                      experience.
                    </span>
                  </div>
                </div>
                <div className="trust-card-wrapper p-3">
                  <div className="d-flex flex-column gap-2 align-items-center">
                    <img src={two} alt="" />

                    <h3 className="card-title font-organetto">Quiet Exit</h3>
                    <span className="card-desc text-white text-center">
                      Effortlessly exit your position by conducting a quiet
                      token sale to a trusted partner while also maximizing
                      returns.
                    </span>
                  </div>
                </div>
                <div className="trust-card-wrapper p-3">
                  <div className="d-flex flex-column gap-2 align-items-center">
                    <img src={three} alt="" />

                    <h3 className="card-title font-organetto">Cut Costs</h3>
                    <span className="card-desc text-white text-center">
                      Trade Directly with Users, Bypass Charts and Liquidity
                      Pools.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustedContainer;
