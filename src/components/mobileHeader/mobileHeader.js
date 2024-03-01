import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { shortAddress } from "../../hooks/shortAddress";
import logo from "../../assets/svg/logo-no-background.svg";
import xMark from "../../assets/svg/xMark.svg";
import OutsideClickHandler from "react-outside-click-handler";
import mobileArrow from "../../assets/svg/mobileArrow.svg";
import "./mobileHeader.scss";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import eth from "./assets/eth.svg";
import bnb from "./assets/bnb.svg";
import error from "./assets/error.svg";

const MobileHeader = ({
  coinbase,
  isConnected,
  chainId,
  onConnect,
  onSwitchNetwork,
}) => {
  const [openNavbar, setOpenNavbar] = useState(false);
  const [ethState, setEthState] = useState(false);
  const [bnbState, setBnbState] = useState(false);

  const setActiveChain = () => {
    if (chainId) {
      if (chainId === 1) {
        setBnbState(false);
        setEthState(true);
      } else if (chainId === 56) {
        setBnbState(true);
        setEthState(false);
      } else {
        setBnbState(false);
        setEthState(false);
      }
    }
  };

  useEffect(() => {
    setActiveChain();
  }, [chainId, ethState]);

  return (
    <>
      <div
        className="mobile-navbar d-flex d-lg-none p-3 align-items-center justify-content-between"
        id="mobileNavbar"
      >
        <NavLink to="/">
          <img src={logo} alt="logo" width={126} />
        </NavLink>
        <div className="d-flex align-items-center gap-3 justify-content-between">
          {isConnected && (
            <DropdownButton
              id="dropdown-basic-button"
              className="d-flex align-items-center justify-content-center"
              title={
                <span className="dropdown-title">
                  <div className="d-flex align-items-center gap-1">
                    <img
                      src={
                        ethState === true
                          ? eth
                          : bnbState === true
                          ? bnb
                          : error
                      }
                      height={16}
                      width={16}
                      alt=""
                    />
                    <span className="change-chain-text d-none d-lg-flex">
                      {ethState === true
                        ? "Ethereum"
                        : bnbState === true
                        ? "BNB Chain"
                        : "Unsupported"}
                    </span>
                  </div>

                  {/* <img src={dropdown} alt="" /> */}
                </span>
              }
            >
              <Dropdown.Item onClick={() => onSwitchNetwork("0x1")}>
                <img
                  src={eth}
                  alt=""
                  className="me-1"
                  style={{ width: 15, height: 15 }}
                />
                Ethereum
              </Dropdown.Item>
              <Dropdown.Item onClick={() => onSwitchNetwork("0x38")}>
                <img
                  src={bnb}
                  alt=""
                  className="me-1"
                  style={{ width: 15, height: 15 }}
                />
                BNB Chain
              </Dropdown.Item>
            </DropdownButton>
          )}
          {openNavbar === false ? (
            <div
              className="linear-border position-relative p-1"
              onClick={() => setOpenNavbar(true)}
            >
              <button
                className="px-4 bg-transparent"
                style={{ clipPath: "none", border: "none" }}
                id="hamburgermenu"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          ) : (
            <img
              src={xMark}
              alt="x mark"
              style={{ position: "relative", right: "18px", marginLeft: 10 }}
              onClick={() => setOpenNavbar(false)}
            />
          )}
        </div>
      </div>
      <OutsideClickHandler onOutsideClick={() => setOpenNavbar(false)}>
        <div
          className={`mobile-menu ${
            openNavbar && "mobile-menu-open"
          } d-flex d-lg-none p-3 flex-column gap-3`}
          id="bgmenu"
        >
          <div className="mobile-nav-item d-flex align-items-center justify-content-between p-3">
            <NavLink
              to="/buying"
              className="nav-anchor font-poppins d-flex align-items-center justify-content-between w-100"
              style={{ textDecoration: "none" }}
              onClick={() => setOpenNavbar(false)}
            >
              <h6 className="mobile-nav-link font-poppins mb-0">Buy</h6>
              <img src={mobileArrow} alt="arrow" />{" "}
            </NavLink>
          </div>
          <div className="mobile-nav-item d-flex align-items-center justify-content-between p-3">
            <NavLink
              to="/selling"
              className="nav-anchor font-poppins d-flex align-items-center justify-content-between w-100"
              style={{ textDecoration: "none" }}
              onClick={() => setOpenNavbar(false)}
            >
              <h6 className="mobile-nav-link font-poppins mb-0">Sell</h6>
              <img src={mobileArrow} alt="arrow" />{" "}
            </NavLink>
          </div>

          <div className="mobile-nav-item d-flex align-items-center justify-content-between p-3">
            <NavLink
              to="/open-positions"
              className="nav-anchor font-poppins d-flex align-items-center justify-content-between w-100"
              style={{ textDecoration: "none" }}
              onClick={() => setOpenNavbar(false)}
            >
              <h6 className="mobile-nav-link font-poppins mb-0">
                Open Positions
              </h6>
              <img src={mobileArrow} alt="arrow" />{" "}
            </NavLink>
          </div>

          <div className="w-100 d-flex align-items-center justify-content-center gap-3">
            {isConnected ? (
              <button className="btn-connected btn">
                {shortAddress(coinbase)}
              </button>
            ) : (
              <button className="connect-btn btn" onClick={onConnect}>
                Connect wallet
              </button>
            )}
          </div>
        </div>
      </OutsideClickHandler>
    </>
  );
};

export default MobileHeader;
