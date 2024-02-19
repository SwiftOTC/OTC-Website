import React from "react";
import "./homepage.css";
import lock from "../../assets/png/lock.png";
import exit from "../../assets/png/exit.png";
import trade from "../../assets/png/trade.webp";


const TrustedContainer = () => {
  return (
    <div className="container-fluid faq-wrapper my-5">
      <div className="container-lg">
        <div className="d-flex flex-column gap-3 animationText">
          <h1 className="text-white text-center">
            WHY<mark className="bg-transparent quicktitle">SWIFT</mark>OTC
          </h1>
          <span className="text-white text-center mb-4">
            It offers a secure and efficient way for users to buy and sell
            tokens directly with other individuals, eliminating the need for
            complex charts and navigating liquidity pools. With SwiftOTC,
            traders can save time and effort while ensuring a seamless and
            private trading experience.
          </span>
          <div className="cards-wrapper align-items-center">
            <div className="trust-card-wrapper p-3">
              <div className="d-flex flex-column gap-2 align-items-center">
                <img src={lock} alt=""  className='card-image lockimg'/>
                <h3 className="card-title text-white">Be Protected</h3>
                <span className="card-desc text-white text-center">
                SwiftOTC shields DeFi traders from unpredictable market
                  turbulence, ensuring a user-friendly peer-to-peer trading
                  experience.
                </span>
              </div>
            </div>
            <div className="trust-card-wrapper p-3">
              <div className="d-flex flex-column gap-2 align-items-center">
                <img src={exit} alt=""  className='card-image exitimg'/>

                <h3 className="card-title text-white">Quiet Exit</h3>
                <span className="card-desc text-white text-center">
                  Effortlessly exit your position by conducting a quiet token
                  sale to a trusted partner while also maximizing returns.
                </span>
              </div>
            </div>
            <div className="trust-card-wrapper p-3">
              <div className="d-flex flex-column gap-2 align-items-center">
              <img src={trade} alt="" className='card-image tradeimg'/>

                <h3 className="card-title text-white">Cut Costs</h3>
                <span className="card-desc text-white text-center">
                  Trade Directly with Users, Bypass Charts and Liquidity Pools.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustedContainer;
