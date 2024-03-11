import React, { useState } from "react";
import "./walletmodal.scss";
import OutsideClickHandler from "react-outside-click-handler";
import Modal from "../Modal/Modal";
import arrow from "./assets/rightWhiteArrow.svg";
import arrowActive from "./assets/rightBlueArrow.svg";

const WalletModal = ({ handleClose, show, handleConnection }) => {
  const [btnState, setBtnState] = useState("");
  return (
    <Modal visible={show} onModalClose={handleClose} maxWidth={500}>
      <OutsideClickHandler onOutsideClick={handleClose}>
        <div className="walletmodal-wrapper2">
          <div className="sc-jwKygS bFQpTL">
            <h3 style={{ fontSize: 20, color: "#fff" }}>Connect wallet</h3>
          </div>
          <div>
            <div className="row flex-column" style={{ gap: 20 }}>
              <button
                onClick={handleConnection}
                id="connect-METAMASK"
                className="walletbutton"
                onMouseEnter={() => {
                  setBtnState("metamask");
                }}
                onMouseLeave={() => {
                  setBtnState("");
                }}
              >
                <div
                  color="#E8831D"
                  className="justify-content-between d-flex w-100 align-items-center"
                >
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={require("./wallets/metamask.svg").default}
                      alt="Icon"
                    />
                    <span style={{ color: "#fff" }}>MetaMask</span>
                  </div>
                  <img
                    src={btnState === "metamask" ? arrowActive : arrow}
                    alt="Icon"
                  />
                </div>
              </button>

              <button
                onClick={handleConnection}
                id="connect-COIN98"
                className="walletbutton"
                onMouseEnter={() => {
                  setBtnState("trust");
                }}
                onMouseLeave={() => {
                  setBtnState("");
                }}
              >
                <div
                  color="#E8831D"
                  className="justify-content-between d-flex w-100 align-items-center"
                >
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={require("./wallets/trustwallet.svg").default}
                      alt="Icon"
                    />
                    <span style={{ color: "#fff" }}>Trust Wallet</span>
                  </div>
                  <img
                    src={btnState === "trust" ? arrowActive : arrow}
                    alt="Icon"
                  />
                </div>
              </button>

             
              <button
                onClick={handleConnection}
                id="connect-METAMASK"
                className="walletbutton"
                onMouseEnter={() => {
                  setBtnState("coinbase");
                }}
                onMouseLeave={() => {
                  setBtnState("");
                }}
              >
                <div
                  color="#E8831D"
                  className="justify-content-between d-flex w-100 align-items-center"
                >
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={require("./wallets/coinbase.svg").default}
                      alt="Icon"
                    />{" "}
                    <span style={{ color: "#fff" }}>Coinbase</span>
                  </div>
                  <img
                    src={btnState === "coinbase" ? arrowActive : arrow}
                    alt="Icon"
                  />
                </div>
              </button>

              <button
                onClick={handleConnection}
                id="connect-COIN98"
                className="walletbutton"
                onMouseEnter={() => {
                  setBtnState("safepal");
                }}
                onMouseLeave={() => {
                  setBtnState("");
                }}
              >
                <div
                  color="#E8831D"
                  className="justify-content-between d-flex w-100 align-items-center"
                >
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={require("./wallets/safepal.svg").default}
                      alt="Icon"
                    />
                    <span style={{ color: "#fff" }}>SafePal</span>
                  </div>
                  <img
                    src={btnState === "safepal" ? arrowActive : arrow}
                    alt="Icon"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </OutsideClickHandler>
    </Modal>
  );
};

export default WalletModal;
