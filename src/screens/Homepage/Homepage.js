import React, { useEffect } from "react";
import Activity from "./Activity";
import Faq from "./Faq";
import TrustedContainer from "./Trusted";
import MainHero from "./MainHero";
import { useLocation } from "react-router-dom";

const Homepage = ({
  loading,
  activityArray,
  totalOrders2,
  collectedPage2,
  handleCollectedPage2,
}) => {
  useEffect(() => {
    scrollToElement();
  }, []);

  const location = useLocation();

  const scrollToElement = () => {
    const element = document.getElementById("faq");
    if (element && location.hash.includes("faq")) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  return (
    <div className="d-flex flex-column gap-3 container-fluid px-lg-0">
      <MainHero />
      <TrustedContainer />
      <Activity
        activityArray={activityArray}
        loading={loading}
        handleCollectedPage2={handleCollectedPage2}
        totalOrders2={totalOrders2}
        collectedPage2={collectedPage2}
      />
      <Faq />
    </div>
  );
};

export default Homepage;
