import React, { useState, useEffect } from "react";
import "./header.css";
import logo from "../../assets/svg/logo-no-background.svg";
import { NavLink } from "react-router-dom";
import { shortAddress } from "../../hooks/shortAddress";
import getFormattedNumber from "../../hooks/get-formatted-number";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import eth from "./assets/eth.svg";
import bnb from "./assets/bnb.svg";
import error from "./assets/error.svg";
import whiteWallet from "./assets/whiteWallet.svg";
import OutsideClickHandler from "react-outside-click-handler";
import copy from "./assets/copy.svg";
import check from "./assets/check.svg";
import logout from "./assets/logout.svg";
import ordersIcon from "../../assets/svg/ordersIcon.svg";

const Header = ({
  isConnected,
  coinbase,
  onConnect,
  chainId,
  onSwitchNetwork,
  manageDisconnect,
}) => {
  const [balance, setUserBalance] = useState(0);
  const [ethState, setEthState] = useState(false);
  const [bnbState, setBnbState] = useState(false);
  const [showmenu, setShowMenu] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  const getUserBalance = async () => {
    if (isConnected && coinbase) {
      if (chainId === 1) {
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [coinbase, "latest"],
        });

        if (balance) {
          const web3cfx = window.infuraWeb3;
          const stringBalance = web3cfx.utils.hexToNumberString(balance);
          const amount = web3cfx.utils.fromWei(stringBalance, "ether");
          setUserBalance(amount);
        }
      } else if (chainId === 56) {
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [coinbase, "latest"],
        });

        if (balance) {
          const web3cfx = window.infuraWeb3;
          const stringBalance = web3cfx.utils.hexToNumberString(balance);
          const amount = web3cfx.utils.fromWei(stringBalance, "ether");
          setUserBalance(amount);
        }
      }
    }
  };

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
    getUserBalance();
  }, [isConnected, coinbase, chainId]);

  useEffect(() => {
    setActiveChain();
  }, [chainId, ethState]);

  return (
    <div className="header-wrapper p-3 w-100 d-none d-lg-block">
      <div className="container-lg d-flex align-items-center justify-content-between gap-3">
        <div className="">
          <NavLink
            to={"/"}
            onClick={() => {
              window.scrollTo(0, 0);
            }}
          >
            <img src={logo} alt="" className="headerlogo" />
          </NavLink>
        </div>
        <div className="">
          <div className="d-flex align-items-center gap-4">
            <NavLink
              to="/buy"
              className={({ isActive }) =>
                isActive ? " activenavlink" : "inactive-navlink"
              }
            >
              Buy
            </NavLink>
            <NavLink
              to="/sell"
              className={({ isActive }) =>
                isActive ? " activenavlink" : "inactive-navlink"
              }
            >
              Sell
            </NavLink>
            <NavLink
              to="/open-positions"
              className={({ isActive }) =>
                isActive ? " activenavlink" : "inactive-navlink"
              }
            >
              Open Positions
            </NavLink>
          </div>
        </div>
        <div className="">
          <div className="d-flex align-items-center gap-2">
            {isConnected && (
              <DropdownButton
                id={
                  chainId !== 1 && chainId !== 56
                    ? "dropdown-basic-button-error"
                    : "dropdown-basic-button"
                }
                style={{ width: "124px" }}
                className="d-flex align-items-center justify-content-center"
                title={
                  <span className={"dropdown-title"}>
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
                      <span
                        className={
                          chainId !== 1 && chainId !== 56
                            ? "dropdown-title-error d-none d-lg-flex"
                            : "dropdown-title d-none d-lg-flex"
                        }
                      >
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
            {isConnected ? (
              <div className="d-flex align-items-center gap-2">
                {(chainId === 1 || chainId === 56) && (
                  <div className="balance-wrapper2">
                    {getFormattedNumber(balance, 2)}{" "}
                    {chainId === 1 ? "ETH" : "BNB"}
                  </div>
                )}
                <button
                  className="balance-wrapper2"
                  onClick={() => {
                    setShowMenu(true);
                  }}
                >
                  {shortAddress(coinbase)}
                </button>
              </div>
            ) : (
              <button
                className="connect-btn btn d-flex align-items-center gap-1"
                onClick={onConnect}
              >
                <img src={whiteWallet} alt="" /> Connect wallet
              </button>
            )}
            {showmenu === true && (
              <div className="position-absolute" style={{ width: "210px" }}>
                <OutsideClickHandler
                  onOutsideClick={() => {
                    setShowMenu(false);
                  }}
                >
                  <div className="menuwrapper">
                    <div className="d-flex flex-column gap-2">
                      <NavLink
                        className="menuitem2 text-decoration-none"
                        to={"/account"}
                        onClick={() => {
                          setShowMenu(false);
                        }}
                      >
                        
                        My Orders<img src={ordersIcon} alt="" />
                      </NavLink>
                      <span
                        className="menuitem2"
                        onClick={() => {
                          navigator.clipboard.writeText(coinbase);
                          setTooltip(true);
                          setTimeout(() => setTooltip(false), 2000);
                        }}
                      >
                        {shortAddress(coinbase)}{" "}
                        <img src={tooltip ? check : copy} alt="" />
                      </span>

                      <span
                        className="menuitem2"
                        onClick={() => {
                          setShowMenu(false);
                          manageDisconnect();
                        }}
                      >
                         Disconnect{" "}<img src={logout} alt="" />
                      </span>
                    </div>
                  </div>
                </OutsideClickHandler>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
