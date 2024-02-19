import React from "react";
import "./homepage.css";

const MainHero = () => {
  return (
    <div className="container-fluid mainhero-wrapper mb-5 pt-5">
      <div className="container-lg">
        <div className="d-flex flex-row align-items-center justify-content-center">
          <div className="d-flex flex-column gap-3 align-items-center animationText">
            <h1 className="text-white text-center ">
              Discover The Newest <br /> Over-the-Counter Platform
            </h1>
            <h1 className="text-white">
              <mark className="bg-transparent quicktitle">SWIFT</mark>OTC
            </h1>
            <h6 className="text-white col-lg-10 text-center">
              A user-friendly, powerful and secure trading platform designed to
              simplify and streamline the trading experience for cryptocurrency
              enthusiasts.
             
            </h6>
          </div>
          {/* <img src='https://cdn.dribbble.com/users/107759/screenshots/4718965/media/412aa9937ff2686cf34255849fd5c36d.png' alt='' /> */}
        </div>
      </div>
    </div>
  );
};

export default MainHero;
