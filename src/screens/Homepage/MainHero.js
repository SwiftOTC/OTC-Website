import React from "react";
import "./homepage.css";
import mainHeroImg from "./assets/mainHeroImg.webp";
import { NavLink } from "react-router-dom";

const MainHero = () => {
  return (
    <div className="container-fluid mainhero-wrapper pt-5">
      <div className="container-lg">
        <div className="d-flex flex-row align-items-center justify-content-center animationText">
          <div className="d-flex flex-column gap-3   col-lg-8">
            <div className="d-flex flex-column">
              <h1 className="text-white font-organetto mainhero-title m-0">
                Discover The Newest
              </h1>
              <h1 className="text-white font-organetto mainhero-title m-0">
                <mark className="bg-transparent quicktitle font-organetto">
                  Over-the-Counter
                </mark>{" "}
                Platform
              </h1>
            </div>
            <h6 className="text-white main-hero-desc">
              A user-friendly, powerful and secure trading platform designed to
              simplify and streamline the trading experience for cryptocurrency
              enthusiasts.
            </h6>
            <NavLink className="mainHero-buybtn col-lg-2 col-5" to="/buying">
              Buy
            </NavLink>
          </div>
          <div className="col-lg-4">
            <img src={mainHeroImg} alt="" className="mainheroImg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHero;
