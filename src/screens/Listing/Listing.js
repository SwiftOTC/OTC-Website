import React, { useState, useEffect } from "react";
import "./listing.css";
import Web3 from "web3";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import { shortAddress } from "../../hooks/shortAddress";
import Modal from "../../components/Modal/Modal";
import OutsideClickHandler from "react-outside-click-handler";
import getFormattedNumber from "../../hooks/get-formatted-number";
import indicator from "../../assets/svg/indicator.svg";
import RiseLoader from "react-spinners/RiseLoader";
import { NavLink, useLocation } from "react-router-dom";

const Listing = ({
  isAdmin,
  isConnected,
  coinbase,
  onConnect,
  chainId,
  openOrdersArray,
  completedOrdersArray,
  activityArray,
  onAcceptOrderComplete,
  loading,
  onSwitchNetwork,
  totalOrders,
  collectedPage,
  openPage,
  completedPage,
  handleCollectedPage,
  handleOpenPage,
  handleCompletedPage,
  onActivityClick,
  onOpenClick,
  onCompletedClick,
}) => {
  const [selectedItem, setSelectedItem] = useState("");
  const [acceptStatus, setAcceptStatus] = useState("initial");
  const [finalizeStatus, setFinalizeStatus] = useState("initial");
  const [selectedOrder, setSelectedOrder] = useState();
  const [selectedOrderObject, setSelectedOrderObject] = useState();

  const [showModal, setShowModal] = useState(false);
  const { BigNumber } = window;
  const location = useLocation();

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "#7e3455",
  };

  const handleAcceptOrder = async (orderId, obj, chain) => {
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
      .acceptOrder(orderId)
      .send({ from: coinbase })
      .then(() => {
        console.log("success");
        setAcceptStatus("success");
        setTimeout(() => {
          setAcceptStatus("initial");
          setShowModal(false);
          setSelectedOrderObject();
        }, 2000);

        onAcceptOrderComplete();
      })
      .catch((e) => {
        console.error(e);
        setAcceptStatus("error");
        setTimeout(() => {
          checkApproval(obj, chain);
        }, 3000);
      });
  };

  const handleApproveOrder = async (obj, chain) => {
    const web3 = new Web3(window.ethereum);
    setAcceptStatus("loading-approve");
    const tokenToBuyContract = new web3.eth.Contract(
      window.TOKEN_ABI,
      obj.tokenToBuy
    );
    const amountToBuy = obj.amountToBuy;
    const otc_sc =
      chain === 1
        ? window.config.otc_address
        : chain === 56
        ? window.config.otc_bnb_address
        : "";

    await tokenToBuyContract.methods
      .approve(otc_sc, amountToBuy)
      .send({ from: coinbase })
      .then(() => {
        console.log("success-approve");
        setAcceptStatus("success-approve");
        setTimeout(() => {
          setAcceptStatus("buy");
        }, 2000);

        // onAcceptOrderComplete();
      })
      .catch((e) => {
        console.error(e);
        setAcceptStatus("error");
        setTimeout(() => {
          setAcceptStatus("initial");
        }, 3000);
      });
  };

  const checkApproval = async (obj, chain) => {
    const web3 = new Web3(window.ethereum);
    const tokenToBuyContract = new web3.eth.Contract(
      window.TOKEN_ABI,
      obj.tokenToBuy
    );
    const amountToBuy = obj.amountToBuy;
    const otc_sc =
      chain === 1
        ? window.config.otc_address
        : chain === 56
        ? window.config.otc_bnb_address
        : "";

    const result = await tokenToBuyContract.methods
      .allowance(coinbase, otc_sc)
      .call()
      .then((data) => {
        return data;
      })
      .catch((e) => {
        console.log(e);
      });

    let result_formatted = new BigNumber(result).toFixed(6);

    if (
      Number(result_formatted) >= Number(amountToBuy) &&
      Number(result_formatted) !== 0
    ) {
      setAcceptStatus("buy");
    } else {
      setAcceptStatus("initial");
    }
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
        console.log("success");
        setAcceptStatus("success");
        setTimeout(() => {
          setAcceptStatus("initial");
        }, 2000);

        onAcceptOrderComplete();
      })
      .catch((e) => {
        console.error(e);
        setAcceptStatus("error");
        setTimeout(() => {
          setAcceptStatus("initial");
        }, 3000);
      });
  };
  const handleFinalizeOrder = async (orderId, tokenDecimalsToBuy, chain) => {
    const web3 = new Web3(window.ethereum);
    setFinalizeStatus("loading");
    const otc_sc =
      chain === 1
        ? window.config.otc_address
        : chain === 56
        ? window.config.otc_bnb_address
        : "";

    const otc_contract = new web3.eth.Contract(window.OTC_ABI, otc_sc);

    await otc_contract.methods
      .finalizeOrder(orderId, tokenDecimalsToBuy)
      .send({ from: coinbase })
      .then(() => {
        console.log("success");
        setFinalizeStatus("success");
        setTimeout(() => {
          setFinalizeStatus("initial");
        }, 2000);
        onAcceptOrderComplete();
      })
      .catch((e) => {
        console.error(e);
        setFinalizeStatus("error");
        setTimeout(() => {
          setFinalizeStatus("initial");
        }, 3000);
      });
  };

  useEffect(() => {
    setSelectedItem("open");
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (location.pathname === "/activity") {
      setSelectedItem("activity");
      onActivityClick(20);
    }
    if (location.pathname === "/open-positions") {
      setSelectedItem("open");
      onOpenClick(20);
    }
  }, []);

  return (
    <>
      <div className="listing-wrapper mt-5">
        <div className="d-flex flex-column gap-3 align-items-center">
          <h4 className="listing-title text-white">Open Positions</h4>
          <div className="listing-items-wrapper p-3">
            <div className="d-flex flex-column gap-2 align-items-center">
              <div className="items-wrapper">
                <div className="d-flex gap-2 align-items-center items-inner-wrapper">
                  <div
                    className={`listing-single-item d-flex align-items-center gap-1  ${
                      selectedItem === "open" && "active-item"
                    } `}
                    onClick={() => {
                      setSelectedItem("open");
                      onOpenClick(20);
                    }}
                  >
                    <span>Open orders</span>
                    <div
                      class="dropdown position relative"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <button
                        class={`btn launchpad-dropdown p-1 d-flex gap-1 justify-content-between align-items-center dropdown-toggle2 w-100`}
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <div
                          className="d-flex align-items-center gap-2"
                          style={{ color: "#fff" }}
                        >
                          {chainId === 1 ? (
                            <img
                              src={require(`../../assets/svg/eth.svg`).default}
                              alt=""
                            />
                          ) : (
                            <img
                              src={require(`../../assets/svg/bnb.svg`).default}
                              alt=""
                            />
                          )}
                        </div>
                        <img src={indicator} alt="" />
                      </button>
                      <ul class="dropdown-menu w-100">
                        <li
                          className="dropdown-item launchpad-item d-flex align-items-center gap-2"
                          onClick={() => {
                            onSwitchNetwork("0x1");
                          }}
                        >
                          {" "}
                          <img
                            src={require(`../../assets/svg/eth.svg`).default}
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
                            src={require(`../../assets/svg/bnb.svg`).default}
                            alt=""
                          />
                          BNB Chain
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* {isAdmin && (
                    <div
                      className={`listing-single-item d-flex align-items-center gap-1 ${
                        selectedItem === "pending" && "active-item"
                      } `}
                      onClick={() => {
                        setSelectedItem("pending");
                        onPendingClick(20);
                      }}
                    >
                      <span>Awaiting Completion</span>
                      <div class="dropdown position relative"onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}>
                        <button
                          class={`btn launchpad-dropdown p-1 d-flex gap-1 justify-content-between align-items-center dropdown-toggle2 w-100`}
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <div
                            className="d-flex align-items-center gap-2"
                            style={{ color: "#fff" }}
                          >
                            {chainId === 1 ? (
                              <img
                                src={
                                  require(`../../assets/svg/eth.svg`).default
                                }
                                alt=""
                              />
                            ) : (
                              <img
                                src={
                                  require(`../../assets/svg/bnb.svg`).default
                                }
                                alt=""
                              />
                            )}
                          </div>
                          <img src={indicator} alt="" />
                        </button>
                        <ul class="dropdown-menu w-100">
                          <li
                            className="dropdown-item launchpad-item d-flex align-items-center gap-2"
                            onClick={() => {
                              onSwitchNetwork("0x1");
                            }}
                          >
                            {" "}
                            <img
                              src={require(`../../assets/svg/eth.svg`).default}
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
                              src={require(`../../assets/svg/bnb.svg`).default}
                              alt=""
                            />
                            BNB Chain
                          </li>
                        </ul>
                      </div>
                    </div>
                  )} */}
                  <div
                    className={`listing-single-item d-flex align-items-center gap-1 ${
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
                    className={`listing-single-item ${
                      selectedItem === "activity" && "active-item"
                    } `}
                    onClick={() => {
                      setSelectedItem("activity");
                      onActivityClick(20);
                    }}
                  >
                    <NavLink
                      to="/activity"
                      className={"text-decoration-none"}
                      style={{ color: "inherit" }}
                    >
                      <span>Activity</span>
                    </NavLink>
                  </div>
                </div>
              </div>
              <div className="table-wrapper">
                <TableContainer component={Paper}>
                  <Table
                    sx={{ minWidth: 650 }}
                    size="medium"
                    aria-label="a dense table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Seller</TableCell>

                        {selectedItem !== "open" && (
                          <TableCell align="center">Buyer</TableCell>
                        )}
                        <TableCell align="center">Token to Sell</TableCell>
                        <TableCell align="center">Amount to Sell</TableCell>
                        <TableCell align="center">Token to Buy</TableCell>
                        <TableCell align="center">Amount to Buy</TableCell>
                        {selectedItem !== "completed" &&
                          selectedItem !== "activity" && (
                            <TableCell align="center">Buy</TableCell>
                          )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* {selectedItem === "pending" &&
                        isAdmin &&
                        pendingOrdersArray &&
                        loading === false &&
                        pendingOrdersArray.length > 0 &&
                        pendingOrdersArray.map((item, index) => {
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
                                <div
                                  className={
                                    item.chain === 1
                                      ? "label-wrapper-eth position-absolute p-0 bg-transparent"
                                      : "label-wrapper-bnb position-absolute p-0 bg-transparent"
                                  }
                                >
                                  {item.chain === 1 ? (
                                    <img
                                      src={
                                        require("./assets/tageth.svg").default
                                      }
                                      alt=""
                                    />
                                  ) : (
                                    <img
                                      src={
                                        require("./assets/tagbnb.svg").default
                                      }
                                      alt=""
                                    />
                                  )}
                                </div>
                                <a
                                  href={
                                    item.chain === 1
                                      ? `https://etherscan.io/address/${item.seller}`
                                      : `https://bscscan.com/address/${item.seller}`
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{ color: "#7e3455" }}
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
                                  rel="noreferrer"
                                  style={{ color: "#7e3455" }}
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
                                  style={{ color: "#7e3455" }}
                                >
                                  {shortAddress(item.tokenToSell)} (
                                  {item.tokenToSellSymbol})
                                </a>
                              </TableCell>
                              <TableCell align="center">
                                {getFormattedNumber(
                                  item.amountToSell /
                                    10 ** item.tokenToSellDecimals
                                )}
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
                                  style={{ color: "#7e3455" }}
                                >
                                  {shortAddress(item.tokenToBuy)} (
                                  {item.tokenToBuySymbol})
                                </a>
                              </TableCell>
                              <TableCell align="center">
                                {getFormattedNumber(
                                  item.amountToBuy /
                                    10 ** item.tokenToBuyDecimals
                                )}
                                <div
                                  className={
                                    item.status === "0"
                                      ? "label-wrapper position-absolute"
                                      : item.status === "1"
                                      ? "label-wrapper-bought position-absolute"
                                      : "label-wrapper-completed position-absolute"
                                  }
                                >
                                  <span className={"label-text"}>
                                    {item.status === "0"
                                      ? "Placed"
                                      : item.status === "1"
                                      ? "Bought"
                                      : "Completed"}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell align="center">
                                <button
                                  className="connect-btn smallfont btn col-lg-12"
                                  onClick={() => {
                                    handleFinalizeOrder(
                                      item.orderId,
                                      item.tokenToBuyDecimals,
                                      item.chain
                                    );
                                    setSelectedOrder(item.orderId);
                                  }}
                                >
                                  {acceptStatus === "initial" ||
                                  selectedOrder !== item.orderId ? (
                                    "Complete Order"
                                  ) : acceptStatus === "success" &&
                                    selectedOrder === item.orderId ? (
                                    "Success"
                                  ) : acceptStatus === "error" &&
                                    selectedOrder === item.orderId ? (
                                    "Failed!"
                                  ) : (
                                    <>
                                      Completeing{" "}
                                      <div
                                        class="mx-0 spinner-border spinner-border-sm text-light"
                                        role="status"
                                      ></div>
                                    </>
                                  )}
                                </button>
                              </TableCell>
                            </TableRow>
                          );
                        })} */}
                      {/* {selectedItem === "pending" &&
                        isAdmin &&
                        loading === false &&
                        pendingOrdersArray &&
                        pendingOrdersArray.length === 0 && (
                          <div className="empty-div-wrapper py-5">
                            <span className="text-white">
                              No pending orders, check back later
                            </span>
                          </div>
                        )} */}

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
                              {/* <TableCell component="th" scope="row">
                                {item.tokenToSellSymbol}
                              </TableCell> */}

                              <TableCell align="center">
                                <div
                                  className={
                                    item.chain === 1
                                      ? "label-wrapper-eth position-absolute p-0 bg-transparent"
                                      : "label-wrapper-bnb position-absolute p-0 bg-transparent"
                                  }
                                >
                                  {item.chain === 1 ? (
                                    <img
                                      src={
                                        require("./assets/tageth.svg").default
                                      }
                                      alt=""
                                    />
                                  ) : (
                                    <img
                                      src={
                                        require("./assets/tagbnb.svg").default
                                      }
                                      alt=""
                                    />
                                  )}
                                </div>
                                <a
                                  href={
                                    item.chain === 1
                                      ? `https://etherscan.io/address/${item.seller}`
                                      : `https://bscscan.com/address/${item.seller}`
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{ color: "#7e3455" }}
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
                                  rel="noreferrer"
                                  style={{ color: "#7e3455" }}
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
                                  style={{ color: "#7e3455" }}
                                >
                                  {shortAddress(item.tokenToSell)} (
                                  {item.tokenToSellSymbol})
                                </a>
                              </TableCell>
                              <TableCell align="center">
                                {getFormattedNumber(
                                  item.amountToSell /
                                    10 ** item.tokenToSellDecimals
                                )}
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
                                  style={{ color: "#7e3455" }}
                                >
                                  {shortAddress(item.tokenToBuy)} (
                                  {item.tokenToBuySymbol})
                                </a>
                              </TableCell>
                              <TableCell align="center">
                                {getFormattedNumber(
                                  item.amountToBuy /
                                    10 ** item.tokenToBuyDecimals
                                )}
                                <div
                                  className={
                                    item.status === "0"
                                      ? "label-wrapper position-absolute"
                                      : item.status === "1"
                                      ? "label-wrapper-bought position-absolute"
                                      : "label-wrapper-completed position-absolute"
                                  }
                                >
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
                        openOrdersArray.map((item, index) => {
                          return (
                            <TableRow
                              key={index}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              {/* <TableCell component="th" scope="row">
                                {item.tokenToSellSymbol}
                              </TableCell> */}
                              {/* <TableCell align="center">
                              <a
                                href={`https://etherscan.io/address/${item.buyer}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: "#7e3455" }}
                              >
                                {shortAddress(item.buyer)}
                              </a>
                            </TableCell> */}
                              <TableCell align="center">
                                <div
                                  className={
                                    item.chain === 1
                                      ? "label-wrapper-eth position-absolute p-0 bg-transparent"
                                      : "label-wrapper-bnb position-absolute p-0 bg-transparent"
                                  }
                                >
                                  {item.chain === 1 ? (
                                    <img
                                      src={
                                        require("./assets/tageth.svg").default
                                      }
                                      alt=""
                                    />
                                  ) : (
                                    <img
                                      src={
                                        require("./assets/tagbnb.svg").default
                                      }
                                      alt=""
                                    />
                                  )}
                                </div>
                                <a
                                  href={
                                    item.chain === 1
                                      ? `https://etherscan.io/address/${item.seller}`
                                      : `https://bscscan.com/address/${item.seller}`
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{ color: "#7e3455" }}
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
                                  style={{ color: "#7e3455" }}
                                >
                                  {shortAddress(item.tokenToSell)} (
                                  {item.tokenToSellSymbol})
                                </a>
                              </TableCell>
                              <TableCell align="center">
                                {getFormattedNumber(
                                  item.amountToSell /
                                    10 ** item.tokenToSellDecimals
                                )}
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
                                  style={{ color: "#7e3455" }}
                                >
                                  {shortAddress(item.tokenToBuy)} (
                                  {item.tokenToBuySymbol})
                                </a>
                              </TableCell>
                              <TableCell align="center">
                                {getFormattedNumber(
                                  item.amountToBuy /
                                    10 ** item.tokenToBuyDecimals
                                )}
                                <div
                                  className={
                                    item.status === "0"
                                      ? "label-wrapper position-absolute"
                                      : item.status === "1"
                                      ? "label-wrapper-bought position-absolute"
                                      : "label-wrapper-completed position-absolute"
                                  }
                                >
                                  <span className={"label-text"}>
                                    {item.status === "0"
                                      ? "Placed"
                                      : item.status === "1"
                                      ? "Bought"
                                      : "Completed"}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell align="center">
                                {coinbase &&
                                coinbase.toLowerCase() !==
                                  item.seller.toLowerCase() ? (
                                  <button
                                    className="connect-btn smallfont btn col-lg-12"
                                    onClick={() => {
                                      // handleAcceptOrder(item.orderId);
                                      setSelectedOrder(item.orderId);
                                      setSelectedOrderObject(item);
                                      checkApproval(item, item.chain);
                                      setShowModal(true);
                                    }}
                                  >
                                    {/* {acceptStatus === "initial" ||
                                    selectedOrder !== item.orderId ? (
                                      "Buy"
                                    ) : acceptStatus === "success" &&
                                      selectedOrder === item.orderId ? (
                                      "Success"
                                    ) : acceptStatus === "error" &&
                                      selectedOrder === item.orderId ? (
                                      "Failed!"
                                    ) : (
                                      <>
                                        Buying{" "}
                                        <div
                                          class="mx-0 spinner-border spinner-border-sm text-light"
                                          role="status"
                                        ></div>
                                      </>
                                    )} */}
                                    Buy
                                  </button>
                                ) : coinbase &&
                                  coinbase.toLowerCase() ===
                                    item.seller.toLowerCase() ? (
                                  <button
                                    className="connect-btn smallfont btn col-lg-12"
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
                                    className="connect-btn smallfont btn col-lg-12"
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
                        openOrdersArray.length === 0 && (
                          <div className="empty-div-wrapper py-5">
                            <span className="text-white">
                              No open orders, check back later
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
                              {/* <TableCell component="th" scope="row">
                                {item.tokenToSellSymbol}
                              </TableCell> */}

                              <TableCell align="center">
                                <div
                                  className={
                                    item.chain === 1
                                      ? "label-wrapper-eth position-absolute p-0 bg-transparent"
                                      : "label-wrapper-bnb position-absolute p-0 bg-transparent"
                                  }
                                >
                                  {item.chain === 1 ? (
                                    <img
                                      src={
                                        require("./assets/tageth.svg").default
                                      }
                                      alt=""
                                    />
                                  ) : (
                                    <img
                                      src={
                                        require("./assets/tagbnb.svg").default
                                      }
                                      alt=""
                                    />
                                  )}
                                </div>
                                <a
                                  href={
                                    item.chain === 1
                                      ? `https://etherscan.io/address/${item.seller}`
                                      : `https://bscscan.com/address/${item.seller}`
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{ color: "#7e3455" }}
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
                                  style={{ color: "#7e3455" }}
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
                                  style={{ color: "#7e3455" }}
                                >
                                  {shortAddress(item.tokenToSell)} (
                                  {item.tokenToSellSymbol})
                                </a>
                              </TableCell>
                              <TableCell align="center">
                                {getFormattedNumber(
                                  item.amountToSell /
                                    10 ** item.tokenToSellDecimals
                                )}
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
                                  style={{ color: "#7e3455" }}
                                >
                                  {shortAddress(item.tokenToBuy)} (
                                  {item.tokenToBuySymbol})
                                </a>
                              </TableCell>
                              <TableCell align="center">
                                {getFormattedNumber(
                                  item.amountToBuy /
                                    10 ** item.tokenToBuyDecimals
                                )}
                                <div
                                  className={
                                    item.status === "0"
                                      ? "label-wrapper position-absolute"
                                      : item.status === "1"
                                      ? "label-wrapper-bought position-absolute"
                                      : "label-wrapper-completed position-absolute"
                                  }
                                >
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
                        activityArray &&
                        loading === false &&
                        activityArray.length === 0 && (
                          <div className="empty-div-wrapper py-5">
                            <span className="text-white">
                              No activity, check back later
                            </span>
                          </div>
                        )}
                    </TableBody>
                  </Table>{" "}
                  {loading === true && (
                    <div className="d-flex w-100 justify-content-center mt-5">
                      <RiseLoader
                        color={"#7e3455"}
                        loading={loading}
                        cssOverride={override}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                      />
                    </div>
                  )}
                </TableContainer>
              </div>
              {selectedItem === "activity" && (
                <div className="col-12 d-flex bg-white py-1 justify-content-center align-items-end">
                  <Pagination
                    color="secondary"
                    variant="outlined"
                    count={Math.ceil(totalOrders / 20)}
                    page={collectedPage}
                    onChange={(e, value) => {
                      handleCollectedPage(e, value);
                    }}
                  />
                </div>
              )}

              {selectedItem === "open" && (
                <div className="col-12 d-flex bg-white py-1 justify-content-center align-items-end">
                  <Pagination
                    color="secondary"
                    variant="outlined"
                    count={Math.ceil(totalOrders / 20)}
                    page={openPage}
                    onChange={(e, value) => {
                      handleOpenPage(e, value);
                    }}
                  />
                </div>
              )}

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

              {selectedItem === "completed" && (
                <div className="col-12 d-flex bg-white py-1 justify-content-center align-items-end">
                  <Pagination
                    color="secondary"
                    variant="outlined"
                    count={Math.ceil(totalOrders / 20)}
                    page={completedPage}
                    onChange={(e, value) => {
                      handleCompletedPage(e, value);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <Modal
          visible={showModal}
          onModalClose={() => {
            setShowModal(false);
          }}
          maxWidth={500}
        >
          <OutsideClickHandler
            onOutsideClick={() => {
              setShowModal(false);
            }}
          >
            <div className="walletmodal-wrapper gap-3">
              <div className="sc-jwKygS bFQpTL">
                <h3
                  style={{ fontSize: 20, color: "#fff" }}
                  className="text-center mb-4"
                >
                  Confirm Transaction
                </h3>
                <span className="text-white">
                  Please review the summary before confirming.
                </span>
              </div>
              <div className="summaryseparator"></div>

              <div className="d-flex flex-column gap-4">
                <div className="d-flex justify-content-between gap-2 align-items-center">
                  <span className="leftText">Token Address:</span>
                  <span className="rightText">
                    {shortAddress(selectedOrderObject.tokenToSell)}(
                    {selectedOrderObject.tokenToSellSymbol})
                  </span>
                </div>
                <div className="d-flex justify-content-between gap-2 align-items-center">
                  <span className="leftText">
                    Amount of Tokens you are buying:
                  </span>
                  <span className="rightText">
                    {getFormattedNumber(
                      selectedOrderObject.amountToSell /
                        10 ** selectedOrderObject.tokenToSellDecimals
                    )}{" "}
                    ({selectedOrderObject.tokenToSellSymbol})
                  </span>
                </div>
                <div className="d-flex justify-content-between gap-2 align-items-center">
                  <span className="leftText">
                    Amount of Tokens you are spending:
                  </span>
                  <span className="rightText">
                    {selectedOrderObject.amountToBuy /
                      10 ** selectedOrderObject.tokenToBuyDecimals}{" "}
                    ({selectedOrderObject.tokenToBuySymbol})
                  </span>
                </div>
                <div className="summaryseparator"></div>

                <div className="d-flex align-items-center gap-4 justify-content-between">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setSelectedOrderObject();
                    }}
                    className="cancel-btn w-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      acceptStatus === "buy"
                        ? handleAcceptOrder(
                            selectedOrderObject.orderId,
                            selectedOrderObject,
                            selectedOrderObject.chain
                          )
                        : handleApproveOrder(
                            selectedOrderObject,
                            selectedOrderObject.chain
                          );
                    }}
                    className="confirm-btn w-50"
                  >
                    {acceptStatus === "initial"
                      ? "Approve"
                      : acceptStatus === "loading-approve"
                      ? "Approving..."
                      : acceptStatus === "success-approve"
                      ? "Success"
                      : acceptStatus === "error"
                      ? "Failed!"
                      : acceptStatus === "buy"
                      ? "Buy"
                      : acceptStatus === "loading"
                      ? "Buying..."
                      : acceptStatus === "success"
                      ? "Success"
                      : "Approve"}
                  </button>
                </div>
              </div>
            </div>
          </OutsideClickHandler>
        </Modal>
      )}
    </>
  );
};

export default Listing;
