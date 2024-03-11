import React, { useState, useEffect } from "react";
import OTCRibbon from "../../components/otcRibbon/otcRibbon";
import Web3 from "web3";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { shortAddress } from "../../hooks/shortAddress";
import linkIcon from "../Listing/assets/linkIcon.svg";
import FadeLoader from "react-spinners/FadeLoader";
import getFormattedNumber from "../../hooks/get-formatted-number";
import indicator from "../../assets/svg/indicator.svg";

const Account = ({
  onConnect,
  coinbase,
  onActivityClick,
  onOpenClick,
  onCompletedClick,
  loading,
  onSwitchNetwork,
  onAcceptUserOrderComplete,
  completedOrdersArray,
  openOrdersArray,
  activityArray,
}) => {
  const [selectedItem, setSelectedItem] = useState("");
  const [acceptStatus, setAcceptStatus] = useState("initial");
  const [selectedOrder, setSelectedOrder] = useState();

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "#32B7EA",
  };

  const handleCancelOrder = async (orderId, chain) => {
    const web3 = new Web3(window.ethereum);
    setAcceptStatus("loading");
    const otc_sc =
      chain === 1
        ? window.config.otc_address
        : chain === 56
        ? window.config.otc_bnb_address
        : "";

    const otc_contract = new web3.eth.Contract(window.OTC_ABI, otc_sc, {
      from: undefined,
    });

    await otc_contract.methods
      .cancelOrder(orderId)
      .send({ from: coinbase })
      .then(() => {
        setAcceptStatus("success");
        setTimeout(() => {
          setAcceptStatus("initial");
        }, 2000);

        onAcceptUserOrderComplete();
      })
      .catch((e) => {
        console.error(e);
        setAcceptStatus("error");
        setTimeout(() => {
          setAcceptStatus("initial");
        }, 3000);
      });
  };

  useEffect(() => {
    setSelectedItem("open");
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container-fluid px-0">
      <div className="listing-wrapper mt-5">
        <div className="d-flex flex-column gap-3 align-items-center">
          <h1 className="text-white font-organetto mainhero-title m-0">
            <mark className="bg-transparent quicktitle font-organetto">My</mark>{" "}
            Orders
          </h1>{" "}
          <div className="items-wrapper col-lg-7 mb-3">
            <div className="d-flex gap-2 align-items-center justify-content-center items-inner-wrapper">
              <div
                className={`listing-single-item d-flex align-items-center gap-1 col-lg-2 py-2 px-3  ${
                  selectedItem === "open" && "active-item"
                } `}
                onClick={() => {
                  setSelectedItem("open");
                  onOpenClick(20);
                }}
              >
                <span>Open orders</span>
              </div>
              <div
                className={`listing-single-item d-flex align-items-center gap-1 col-lg-2 py-2 px-3  ${
                  selectedItem === "private" && "active-item"
                } `}
                onClick={() => {
                  setSelectedItem("private");
                  onOpenClick(20);
                }}
              >
                <span>Private orders</span>
              </div>

              <div
                className={`listing-single-item col-lg-2 py-2 px-3  d-flex align-items-center gap-1 ${
                  selectedItem === "completed" && "active-item"
                } `}
                onClick={() => {
                  setSelectedItem("completed");
                  onCompletedClick(20);
                }}
              >
                <span>Completed orders</span>
              </div>
              <div
                className={`listing-single-item col-lg-2 py-2 px-3  ${
                  selectedItem === "activity" && "active-item"
                } `}
                onClick={() => {
                  setSelectedItem("activity");
                  onActivityClick(20);
                }}
              >
                <span>Activity</span>
              </div>
            </div>
          </div>
          <div className="listing-wrapper-homepage container-fluid mb-5 d-flex justify-content-center">
            <div className="listing-items-wrapper p-3 container-lg">
              <div className="d-flex flex-column gap-2 align-items-center">
                <div className="table-wrapper">
                  <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                    <Table
                      // sx={{ minWidth: 650 }}
                      size="medium"
                      stickyHeader
                      aria-label="sticky table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell scope="row">
                            <span className="d-flex align-items-center">
                              Chain
                              {(selectedItem === "open" ||
                                selectedItem === "private") &&
                                loading === false && (
                                  <div
                                    class="dropdown position relative"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }}
                                  >
                                    <button
                                      class={`btn launchpad-dropdown p-1 d-flex gap-1 justify-content-between align-items-center dropdown-toggle2`}
                                      type="button"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      <img src={indicator} alt="" />
                                    </button>
                                    <ul class="dropdown-menu w-100">
                                      <li
                                        className="dropdown-item launchpad-item d-flex align-items-center gap-2"
                                        onClick={() => {
                                          onSwitchNetwork("0x1");
                                        }}
                                      >
                                        <img
                                          src={
                                            require(`../../assets/svg/eth.svg`)
                                              .default
                                          }
                                          alt=""
                                        />{" "}
                                        Ethereum
                                      </li>
                                      <li
                                        className="dropdown-item launchpad-item d-flex align-items-center gap-2"
                                        onClick={() => {
                                          onSwitchNetwork("0x38");
                                        }}
                                      >
                                        <img
                                          src={
                                            require(`../../assets/svg/bnb.svg`)
                                              .default
                                          }
                                          alt=""
                                        />
                                        BNB Chain
                                      </li>
                                    </ul>
                                  </div>
                                )}
                            </span>
                          </TableCell>
                          <TableCell align="center" scope="row">
                            Seller
                          </TableCell>
                          {selectedItem !== "open" && (
                            <TableCell align="center" scope="row">
                              Buyer
                            </TableCell>
                          )}
                          <TableCell align="center" scope="row">
                            Selling
                          </TableCell>
                          <TableCell align="center" scope="row">
                            Buying
                          </TableCell>
                          {selectedItem !== "completed" &&
                            selectedItem !== "activity" && (
                              <TableCell align="center" scope="row">
                                Action
                              </TableCell>
                            )}
                          {(selectedItem === "completed" ||
                            selectedItem === "activity") && (
                            <TableCell align="center" scope="row">
                              Status
                            </TableCell>
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedItem === "completed" &&
                          completedOrdersArray &&
                          loading === false &&
                          completedOrdersArray.length > 0 &&
                          completedOrdersArray.map((item, index) => {
                            return (
                              <TableRow
                                key={index}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell align="center">
                                  <div>
                                    {item.chain === 1 ? (
                                      <span className="text-white d-flex align-items-center gap-2">
                                        <img
                                          src={
                                            require("../Listing/assets/tageth.svg")
                                              .default
                                          }
                                          alt=""
                                        />
                                        Ethereum
                                      </span>
                                    ) : (
                                      <span className="text-white d-flex align-items-center gap-2">
                                        <img
                                          src={
                                            require("../Listing/assets/tagbnb.svg")
                                              .default
                                          }
                                          alt=""
                                        />
                                        BNB Chain
                                      </span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell align="center">
                                  <a
                                    href={
                                      item.chain === 1
                                        ? `https://etherscan.io/address/${item.seller}`
                                        : `https://bscscan.com/address/${item.seller}`
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ color: "#41D8E7" }}
                                  >
                                    {shortAddress(item.seller)}
                                  </a>
                                </TableCell>
                                <TableCell align="center">
                                  <a
                                    href={
                                      item.chain === 1
                                        ? `https://etherscan.io/address/${item.buyer}`
                                        : `https://bscscan.com/address/${item.buyer}`
                                    }
                                    target="_blank"
                                    style={{ color: "#41D8E7" }}
                                    rel="noreferrer"
                                  >
                                    {shortAddress(item.buyer)}
                                  </a>
                                </TableCell>
                                <TableCell align="center">
                                  {/* {getFormattedNumber(
                                  item.amountToSell /
                                    10 ** item.tokenToSellDecimals
                                )} */}
                                  <a
                                    href={
                                      item.chain === 1
                                        ? `https://etherscan.io/token/${item.tokenToSell}`
                                        : `https://bscscan.com/token/${item.tokenToSell}`
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ color: "#41D8E7" }}
                                    className="d-flex align-items-center gap-2 justify-content-center"
                                  >
                                    <img src={linkIcon} alt="" />
                                    {getFormattedNumber(
                                      item.amountToSell /
                                        10 ** item.tokenToSellDecimals
                                    )}{" "}
                                    {item.tokenToSellSymbol}
                                  </a>
                                </TableCell>
                                <TableCell align="center">
                                  {/* <a
                                  href={
                                    item.chain === 1
                                      ? `https://etherscan.io/token/${item.tokenToBuy}`
                                      : `https://bscscan.com/token/${item.tokenToBuy}`
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{ color: "#7e3455" }}
                                >
                                  {shortAddress(item.tokenToBuy)} (
                                  {item.tokenToBuySymbol})
                                </a> */}
                                  <a
                                    href={
                                      item.chain === 1
                                        ? `https://etherscan.io/token/${item.tokenToBuy}`
                                        : `https://bscscan.com/token/${item.tokenToBuy}`
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ color: "#41D8E7" }}
                                    className="d-flex align-items-center gap-2 justify-content-center"
                                  >
                                    <img src={linkIcon} alt="" />
                                    {getFormattedNumber(
                                      item.amountToBuy /
                                        10 ** item.tokenToBuyDecimals
                                    )}{" "}
                                    {item.tokenToBuySymbol}
                                  </a>
                                </TableCell>
                                <TableCell align="center">
                                  {/* {getFormattedNumber(
                                  item.amountToBuy /
                                    10 ** item.tokenToBuyDecimals
                                )} */}
                                  <div>
                                    <span className={"label-text"}>
                                      {item.status === "0"
                                        ? "Placed"
                                        : item.status === "1"
                                        ? "Bought"
                                        : "Completed"}
                                    </span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}

                        {selectedItem === "completed" &&
                          completedOrdersArray &&
                          loading === false &&
                          completedOrdersArray.length === 0 && (
                            <div className="empty-div-wrapper py-5">
                              <span className="text-white">
                                No completed orders, check back later
                              </span>
                            </div>
                          )}

                        {selectedItem === "open" &&
                          openOrdersArray &&
                          loading === false &&
                          openOrdersArray.length > 0 &&
                          openOrdersArray
                            .filter((obj) => {
                              return (
                                obj.allowedBuyer === window.config.zero_address
                              );
                            })
                            .map((item, index) => {
                              return (
                                <TableRow
                                  key={index}
                                  sx={{
                                    "&:last-child td, &:last-child th": {
                                      border: 0,
                                    },
                                  }}
                                >
                                  <TableCell align="center">
                                    <div>
                                      {item.chain === 1 ? (
                                        <span className="text-white d-flex align-items-center gap-2">
                                          <img
                                            src={
                                              require("../Listing/assets/tageth.svg")
                                                .default
                                            }
                                            alt=""
                                          />
                                          Ethereum
                                        </span>
                                      ) : (
                                        <span className="text-white d-flex align-items-center gap-2">
                                          <img
                                            src={
                                              require("../Listing/assets/tagbnb.svg")
                                                .default
                                            }
                                            alt=""
                                          />
                                          BNB Chain
                                        </span>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell align="center">
                                    <a
                                      href={
                                        item.chain === 1
                                          ? `https://etherscan.io/address/${item.seller}`
                                          : `https://bscscan.com/address/${item.seller}`
                                      }
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{ color: "#41D8E7" }}
                                    >
                                      {shortAddress(item.seller)}
                                    </a>
                                  </TableCell>
                                  <TableCell align="center">
                                    <a
                                      href={
                                        item.chain === 1
                                          ? `https://etherscan.io/token/${item.tokenToSell}`
                                          : `https://bscscan.com/token/${item.tokenToSell}`
                                      }
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{ color: "#41D8E7" }}
                                      className="d-flex align-items-center gap-2 justify-content-center"
                                    >
                                      <img src={linkIcon} alt="" />
                                      {getFormattedNumber(
                                        item.amountToSell /
                                          10 ** item.tokenToSellDecimals
                                      )}{" "}
                                      {item.tokenToSellSymbol}
                                    </a>
                                  </TableCell>
                                  <TableCell align="center">
                                    <a
                                      href={
                                        item.chain === 1
                                          ? `https://etherscan.io/token/${item.tokenToBuy}`
                                          : `https://bscscan.com/token/${item.tokenToBuy}`
                                      }
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{ color: "#41D8E7" }}
                                      className="d-flex align-items-center gap-2 justify-content-center"
                                    >
                                      <img src={linkIcon} alt="" />
                                      {getFormattedNumber(
                                        item.amountToBuy /
                                          10 ** item.tokenToBuyDecimals
                                      )}{" "}
                                      {item.tokenToBuySymbol}
                                    </a>
                                  </TableCell>

                                  <TableCell align="center">
                                    {coinbase &&
                                    coinbase.toLowerCase() ===
                                      item.seller.toLowerCase() ? (
                                      <button
                                        className="connect-btn smallfont btn col-lg-9 py-1"
                                        onClick={() => {
                                          handleCancelOrder(
                                            item.orderId,
                                            item.chain
                                          );
                                          setSelectedOrder(item.orderId);
                                        }}
                                      >
                                        {acceptStatus === "initial" ||
                                        selectedOrder !== item.orderId ? (
                                          "Cancel order"
                                        ) : acceptStatus === "success" &&
                                          selectedOrder === item.orderId ? (
                                          "Success"
                                        ) : acceptStatus === "error" &&
                                          selectedOrder === item.orderId ? (
                                          "Failed!"
                                        ) : (
                                          <>
                                            Canceling{" "}
                                            <div
                                              class="mx-0 spinner-border spinner-border-sm text-light"
                                              role="status"
                                            ></div>
                                          </>
                                        )}
                                      </button>
                                    ) : (
                                      <button
                                        className="connect-btn smallfont btn  col-lg-9 py-1"
                                        onClick={() => {
                                          onConnect();
                                        }}
                                      >
                                        Connect Wallet
                                      </button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}

                        {selectedItem === "open" &&
                          loading === false &&
                          openOrdersArray &&
                          (openOrdersArray.length === 0 ||
                            openOrdersArray.filter((obj) => {
                              return (
                                obj.allowedBuyer === window.config.zero_address
                              );
                            }).length === 0) && (
                            <div className="empty-div-wrapper py-5">
                              <span className="text-white">
                                No open orders, check back later
                              </span>
                            </div>
                          )}

                        {selectedItem === "private" &&
                          openOrdersArray &&
                          loading === false &&
                          openOrdersArray.length > 0 &&
                          openOrdersArray
                            .filter((obj) => {
                              return (
                                obj.allowedBuyer !== window.config.zero_address
                              );
                            })
                            .map((item, index) => {
                              return (
                                <TableRow
                                  key={index}
                                  sx={{
                                    "&:last-child td, &:last-child th": {
                                      border: 0,
                                    },
                                  }}
                                >
                                  <TableCell align="center">
                                    <div>
                                      {item.chain === 1 ? (
                                        <span className="text-white d-flex align-items-center gap-2">
                                          <img
                                            src={
                                              require("../Listing/assets/tageth.svg")
                                                .default
                                            }
                                            alt=""
                                          />
                                          Ethereum
                                        </span>
                                      ) : (
                                        <span className="text-white d-flex align-items-center gap-2">
                                          <img
                                            src={
                                              require("../Listing/assets/tagbnb.svg")
                                                .default
                                            }
                                            alt=""
                                          />
                                          BNB Chain
                                        </span>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell align="center">
                                    <a
                                      href={
                                        item.chain === 1
                                          ? `https://etherscan.io/address/${item.seller}`
                                          : `https://bscscan.com/address/${item.seller}`
                                      }
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{ color: "#41D8E7" }}
                                    >
                                      {shortAddress(item.seller)}
                                    </a>
                                  </TableCell>
                                  <TableCell align="center">
                                    <a
                                      href={
                                        item.chain === 1
                                          ? `https://etherscan.io/address/${item.allowedBuyer}`
                                          : `https://bscscan.com/address/${item.allowedBuyer}`
                                      }
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{ color: "#41D8E7" }}
                                    >
                                      {shortAddress(item.allowedBuyer)}
                                    </a>
                                  </TableCell>
                                  <TableCell align="center">
                                    <a
                                      href={
                                        item.chain === 1
                                          ? `https://etherscan.io/token/${item.tokenToSell}`
                                          : `https://bscscan.com/token/${item.tokenToSell}`
                                      }
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{ color: "#41D8E7" }}
                                      className="d-flex align-items-center gap-2 justify-content-center"
                                    >
                                      <img src={linkIcon} alt="" />
                                      {getFormattedNumber(
                                        item.amountToSell /
                                          10 ** item.tokenToSellDecimals
                                      )}{" "}
                                      {item.tokenToSellSymbol}
                                    </a>
                                  </TableCell>
                                  <TableCell align="center">
                                    <a
                                      href={
                                        item.chain === 1
                                          ? `https://etherscan.io/token/${item.tokenToBuy}`
                                          : `https://bscscan.com/token/${item.tokenToBuy}`
                                      }
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{ color: "#41D8E7" }}
                                      className="d-flex align-items-center gap-2 justify-content-center"
                                    >
                                      <img src={linkIcon} alt="" />
                                      {getFormattedNumber(
                                        item.amountToBuy /
                                          10 ** item.tokenToBuyDecimals
                                      )}{" "}
                                      {item.tokenToBuySymbol}
                                    </a>
                                  </TableCell>

                                  <TableCell align="center">
                                    {coinbase &&
                                    coinbase.toLowerCase() ===
                                      item.seller.toLowerCase() ? (
                                      <button
                                        className="connect-btn smallfont btn col-lg-9 py-1"
                                        onClick={() => {
                                          handleCancelOrder(
                                            item.orderId,
                                            item.chain
                                          );
                                          setSelectedOrder(item.orderId);
                                        }}
                                      >
                                        {acceptStatus === "initial" ||
                                        selectedOrder !== item.orderId ? (
                                          "Cancel order"
                                        ) : acceptStatus === "success" &&
                                          selectedOrder === item.orderId ? (
                                          "Success"
                                        ) : acceptStatus === "error" &&
                                          selectedOrder === item.orderId ? (
                                          "Failed!"
                                        ) : (
                                          <>
                                            Canceling{" "}
                                            <div
                                              class="mx-0 spinner-border spinner-border-sm text-light"
                                              role="status"
                                            ></div>
                                          </>
                                        )}
                                      </button>
                                    ) : (
                                      <button
                                        className="connect-btn smallfont btn  col-lg-9 py-1"
                                        onClick={() => {
                                          onConnect();
                                        }}
                                      >
                                        Connect Wallet
                                      </button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}

                        {selectedItem === "private" &&
                          loading === false &&
                          openOrdersArray &&
                          (openOrdersArray.length === 0 ||
                            openOrdersArray.filter((obj) => {
                              return (
                                obj.allowedBuyer !== window.config.zero_address
                              );
                            }).length === 0) && (
                            <div className="empty-div-wrapper py-5">
                              <span className="text-white">
                                No private orders, check back later
                              </span>
                            </div>
                          )}

                        {selectedItem === "activity" &&
                          activityArray &&
                          loading === false &&
                          activityArray.length > 0 &&
                          activityArray.map((item, index) => {
                            return (
                              <TableRow
                                key={index}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell align="center">
                                  <div>
                                    {item.chain === 1 ? (
                                      <span className="text-white d-flex align-items-center gap-2">
                                        <img
                                          src={
                                            require("../Listing/assets/tageth.svg")
                                              .default
                                          }
                                          alt=""
                                        />
                                        Ethereum
                                      </span>
                                    ) : (
                                      <span className="text-white d-flex align-items-center gap-2">
                                        <img
                                          src={
                                            require("../Listing/assets/tagbnb.svg")
                                              .default
                                          }
                                          alt=""
                                        />
                                        BNB Chain
                                      </span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell align="center">
                                  <a
                                    href={
                                      item.chain === 1
                                        ? `https://etherscan.io/address/${item.seller}`
                                        : `https://bscscan.com/address/${item.seller}`
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ color: "#41D8E7" }}
                                  >
                                    {shortAddress(item.seller)}
                                  </a>
                                </TableCell>
                                <TableCell align="center">
                                  <a
                                    href={
                                      item.chain === 1
                                        ? `https://etherscan.io/address/${item.buyer}`
                                        : `https://bscscan.com/address/${item.buyer}`
                                    }
                                    target="_blank"
                                    style={{ color: "#41D8E7" }}
                                    rel="noreferrer"
                                  >
                                    {shortAddress(item.buyer)}
                                  </a>
                                </TableCell>
                                <TableCell align="center">
                                  <a
                                    href={
                                      item.chain === 1
                                        ? `https://etherscan.io/token/${item.tokenToSell}`
                                        : `https://bscscan.com/token/${item.tokenToSell}`
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ color: "#41D8E7" }}
                                    className="d-flex align-items-center gap-2 justify-content-center"
                                  >
                                    <img src={linkIcon} alt="" />
                                    {getFormattedNumber(
                                      item.amountToSell /
                                        10 ** item.tokenToSellDecimals
                                    )}{" "}
                                    {item.tokenToSellSymbol}
                                  </a>
                                </TableCell>
                                <TableCell align="center">
                                  <a
                                    href={
                                      item.chain === 1
                                        ? `https://etherscan.io/token/${item.tokenToBuy}`
                                        : `https://bscscan.com/token/${item.tokenToBuy}`
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ color: "#41D8E7" }}
                                    className="d-flex align-items-center gap-2 justify-content-center"
                                  >
                                    <img src={linkIcon} alt="" />
                                    {getFormattedNumber(
                                      item.amountToBuy /
                                        10 ** item.tokenToBuyDecimals
                                    )}{" "}
                                    {item.tokenToBuySymbol}
                                  </a>
                                </TableCell>
                                <TableCell align="center">
                                  <div>
                                    <span className={"label-text"}>
                                      {item.status === "0"
                                        ? "Placed"
                                        : item.status === "1"
                                        ? "Bought"
                                        : "Completed"}
                                    </span>
                                  </div>
                                </TableCell>
                                {/* <TableCell align="center">
                          <button
                            className="connect-btn btn col-lg-12"
                            onClick={() => {
                              handleAcceptOrder(item.orderId);
                              setSelectedOrder(item.orderId)

                            }}
                          >
                            {acceptStatus === "initial" ||  selectedOrder !== item.orderId  ? (
                              "Accept Order"
                            ) : acceptStatus === "success" && selectedOrder === item.orderId? (
                              "Success"
                            ) : acceptStatus === "error"&& selectedOrder === item.orderId ? (
                              "Failed!"
                            ) : (
                              <>
                                Accepting{" "}
                                <div
                                  class="mx-0 spinner-border spinner-border-sm text-light"
                                  role="status"
                                ></div>
                              </>
                            )}
                          </button>
                        </TableCell> */}
                              </TableRow>
                            );
                          })}

                        {selectedItem === "activity" &&
                          loading === false &&
                          activityArray &&
                          activityArray.length === 0 && (
                            <div className="empty-div-wrapper py-5">
                              <span className="text-white">
                                No activity orders, check back later
                              </span>
                            </div>
                          )}
                      </TableBody>
                    </Table>{" "}
                    {loading === true && (
                      <div className="d-flex w-100 justify-content-center mt-5">
                        <FadeLoader
                          color={"#32B7EA"}
                          loading={loading}
                          cssOverride={override}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                      </div>
                    )}
                  </TableContainer>
                </div>
                {/* {selectedItem === "activity" && (
                <div className="col-12 d-flex bg-transparent py-1 justify-content-end align-items-end">
                  <Pagination
                    color="primary"
                    // variant="outlined"
                    count={Math.ceil(totalOrders / 20)}
                    page={collectedPage}
                    onChange={(e, value) => {
                      handleCollectedPage(e, value);
                    }}
                  />
                </div>
              )} */}

                {/* {selectedItem === "pending" && (
            <div className="col-12 d-flex bg-white py-1 justify-content-center align-items-end">
              <Pagination
                color="secondary"
                variant="outlined"
                count={Math.ceil(totalOrders / 20)}
                page={pendingPage}
                onChange={(e, value) => {
                  handlePendingPage(e, value);
                }}
              />
            </div>
          )} */}

                {/* {selectedItem === "completed" && (
                <div className="col-12 d-flex bg-transparent py-1 justify-content-end align-items-end">
                  <Pagination
                    color="primary"
                    // variant="outlined"
                    count={Math.ceil(totalOrders / 20)}
                    page={completedPage}
                    onChange={(e, value) => {
                      handleCompletedPage(e, value);
                    }}
                  />
                </div>
              )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <OTCRibbon />
    </div>
  );
};

export default Account;
