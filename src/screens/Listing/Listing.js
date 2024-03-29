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
import linkIcon from "./assets/linkIcon.svg";
import FadeLoader from "react-spinners/FadeLoader";
import { NavLink, useLocation } from "react-router-dom";
import OTCRibbon from "../../components/otcRibbon/otcRibbon";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import indicator from "../../assets/svg/indicator.svg";

const Listing = ({
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
  isWhiteListed,
}) => {
  const [selectedItem, setSelectedItem] = useState("");
  const [acceptStatus, setAcceptStatus] = useState("initial");
  const [finalizeStatus, setFinalizeStatus] = useState("initial");
  const [selectedOrder, setSelectedOrder] = useState();
  const [selectedOrderObject, setSelectedOrderObject] = useState();
  const [selectedOrderObjectArray, setSelectedOrderObjectArray] = useState([]);
  const [selectedOrderObjectArrayFinal, setselectedOrderObjectArrayFinal] =
    useState([]);

  const [showModal, setShowModal] = useState(false);
  const [multiSelect, setmultiSelect] = useState(false);

  const { BigNumber } = window;
  const location = useLocation();

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "#32B7EA",
  };

  const handleAcceptOrder = async (obj, chain) => {
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

    let orderIds = [];

    obj.forEach((item) => {
      orderIds.push(item.orderId);
    });

    const gasPrice = await web3.eth.getGasPrice();
    console.log("gasPrice", gasPrice);
    const currentGwei = web3.utils.fromWei(gasPrice, "gwei");
    const increasedGwei = parseInt(currentGwei) + 2;
    console.log("increasedGwei", increasedGwei);

    const transactionParameters = {
      gasPrice: web3.utils.toWei(increasedGwei.toString(), "gwei"),
    };

    await otc_contract.methods
      .bulkBuyOrders(orderIds)
      .estimateGas({ from: coinbase })
      .then((gas) => {
        transactionParameters.gas = web3.utils.toHex(gas);
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log(transactionParameters);
    await otc_contract.methods
      .bulkBuyOrders(orderIds)
      .send({ from: coinbase, ...transactionParameters })
      .then(() => {
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
      obj[0].tokenToBuy
    );
    let amountToBuy = 0;
    obj.forEach((item) => {
      const price = new BigNumber(
        item.amountToBuy / 10 ** item.tokenToBuyDecimals
      ).toFixed();
      amountToBuy += Number(price);
    });

    const amountToBuy_formatted = new BigNumber(amountToBuy * 1e18).toFixed();

    const otc_sc =
      chain === 1
        ? window.config.otc_address
        : chain === 56
        ? window.config.otc_bnb_address
        : "";

    await tokenToBuyContract.methods
      .approve(otc_sc, amountToBuy_formatted)
      .send({ from: coinbase })
      .then(() => {
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
      obj[0].tokenToBuy
    );
    let amountToBuy = 0;
    obj.forEach((item) => {
      const price = new BigNumber(
        item.amountToBuy / 10 ** item.tokenToBuyDecimals
      ).toFixed();
      amountToBuy += Number(price);
    });

    const amountToBuy_formatted = new BigNumber(amountToBuy * 1e18).toFixed();
    if (chain) {
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
        Number(result_formatted) >= Number(amountToBuy_formatted) &&
        Number(result_formatted) !== 0
      ) {
        setAcceptStatus("buy");
      } else {
        setAcceptStatus("initial");
      }
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

    const gasPrice = await web3.eth.getGasPrice();
    console.log("gasPrice", gasPrice);
    const currentGwei = web3.utils.fromWei(gasPrice, "gwei");
    const increasedGwei = parseInt(currentGwei) + 2;
    console.log("increasedGwei", increasedGwei);

    const transactionParameters = {
      gasPrice: web3.utils.toWei(increasedGwei.toString(), "gwei"),
    };

    await otc_contract.methods
      .cancelOrder(orderId)
      .estimateGas({ from: coinbase })
      .then((gas) => {
        transactionParameters.gas = web3.utils.toHex(gas);
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log(transactionParameters);

    await otc_contract.methods
      .cancelOrder(orderId)
      .send({ from: coinbase, ...transactionParameters })
      .then(() => {
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

  const handleSetArrayFinal = (data) => {
    setselectedOrderObjectArrayFinal(data);
  };

  const addTags = (tag) => {
    let tagArray = selectedOrderObjectArray;
    if (tagArray.includes(tag)) {
      const index = tagArray.indexOf(tag);
      tagArray.splice(index, 1);
    } else {
      tagArray.push(tag);
    }
    const uniqueArray = openOrdersArray.filter(({ orderId: id1 }) =>
      tagArray.some((item) => id1 === item)
    );

    handleSetArrayFinal(uniqueArray);
    setSelectedOrderObjectArray(tagArray);

    if (uniqueArray && uniqueArray.length > 0) {
      checkApproval(uniqueArray, uniqueArray[0].chain);
    }
  };

  const addTags2 = (tag) => {
    const uniqueArray = openOrdersArray.filter((item) => {
      return tag === item.orderId;
    });

    handleSetArrayFinal(uniqueArray);
    setSelectedOrderObjectArray(uniqueArray);
    checkApproval(uniqueArray, uniqueArray.chain);
  };

  const handleManageSelectOrder = (order) => {
    if (multiSelect) {
      setSelectedOrder(order.orderId);
      addTags(order.orderId);
      // setselectedOrderObjectArrayFinal(order);
    } else {
      setSelectedOrder(order.orderId);
      addTags2(order.orderId);
      setselectedOrderObjectArrayFinal([order]);
      checkApproval([order], order.chain);
      setShowModal(true);
    }
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
      <div className="container-fluid px-0">
        <div className="listing-wrapper mt-5">
          <div className="d-flex flex-column gap-3 align-items-center">
            <h1 className="text-white font-organetto mainhero-title m-0">
              <mark className="bg-transparent quicktitle font-organetto">
                Open
              </mark>{" "}
              positions
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
                                  {/* <TableCell component="th" scope="row">
                                {item.tokenToSellSymbol}
                              </TableCell> */}

                                  <TableCell align="center">
                                    <div>
                                      {item.chain === 1 ? (
                                        <span className="text-white d-flex align-items-center gap-2">
                                          <img
                                            src={
                                              require("./assets/tageth.svg")
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
                                              require("./assets/tagbnb.svg")
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
                                    {/* <a
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
                                    </a> */}
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
                                    {/* <a
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
                                    </a> */}
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
                                  obj.allowedBuyer ===
                                  window.config.zero_address
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
                                                require("./assets/tageth.svg")
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
                                                require("./assets/tagbnb.svg")
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
                                      coinbase.toLowerCase() !==
                                        item.seller.toLowerCase() ? (
                                        <button
                                          disabled={
                                            selectedOrderObjectArrayFinal.length >
                                              0 &&
                                            selectedOrderObjectArrayFinal[0]
                                              .tokenToBuySymbol !==
                                              item.tokenToBuySymbol
                                          }
                                          className={`${
                                            ((multiSelect &&
                                              selectedOrderObjectArray.length ===
                                                0) ||
                                              (multiSelect &&
                                                selectedOrderObjectArray.length >
                                                  0 &&
                                                !selectedOrderObjectArray.includes(
                                                  item.orderId
                                                ))) &&
                                            "select-btn"
                                          } ${
                                            multiSelect &&
                                            selectedOrderObjectArray.length >
                                              0 &&
                                            selectedOrderObjectArray.includes(
                                              item.orderId
                                            ) &&
                                            "select-btn-active"
                                          } ${
                                            !multiSelect && "connect-btn"
                                          }   py-1 smallfont col-lg-9`}
                                          onClick={() => {
                                            // handleAcceptOrder(item.orderId);
                                            handleManageSelectOrder(item);
                                          }}
                                        >
                                          {multiSelect
                                            ? selectedOrderObjectArray.length ===
                                              0
                                              ? "Select"
                                              : selectedOrderObjectArray.length >
                                                  0 &&
                                                selectedOrderObjectArray.includes(
                                                  item.orderId
                                                )
                                              ? "Selected"
                                              : "Select"
                                            : "Accept"}
                                        </button>
                                      ) : coinbase &&
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
                                  obj.allowedBuyer ===
                                  window.config.zero_address
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
                                  obj.allowedBuyer !==
                                    window.config.zero_address &&
                                  (obj.allowedBuyer.toLowerCase() ===
                                    coinbase?.toLowerCase() ||
                                    obj.seller.toLowerCase() ===
                                      coinbase?.toLowerCase())
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
                                                require("./assets/tageth.svg")
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
                                                require("./assets/tagbnb.svg")
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
                                      coinbase.toLowerCase() !==
                                        item.seller.toLowerCase() ? (
                                        <button
                                          disabled={
                                            selectedOrderObjectArrayFinal.length >
                                              0 &&
                                            selectedOrderObjectArrayFinal[0]
                                              .tokenToBuySymbol !==
                                              item.tokenToBuySymbol
                                          }
                                          className={`${
                                            ((multiSelect &&
                                              selectedOrderObjectArray.length ===
                                                0) ||
                                              (multiSelect &&
                                                selectedOrderObjectArray.length >
                                                  0 &&
                                                !selectedOrderObjectArray.includes(
                                                  item.orderId
                                                ))) &&
                                            "select-btn"
                                          } ${
                                            multiSelect &&
                                            selectedOrderObjectArray.length >
                                              0 &&
                                            selectedOrderObjectArray.includes(
                                              item.orderId
                                            ) &&
                                            "select-btn-active"
                                          } ${
                                            !multiSelect && "connect-btn"
                                          }   py-1 smallfont col-lg-9`}
                                          onClick={() => {
                                            // handleAcceptOrder(item.orderId);
                                            handleManageSelectOrder(item);
                                          }}
                                        >
                                          {multiSelect
                                            ? selectedOrderObjectArray.length ===
                                              0
                                              ? "Select"
                                              : selectedOrderObjectArray.length >
                                                  0 &&
                                                selectedOrderObjectArray.includes(
                                                  item.orderId
                                                )
                                              ? "Selected"
                                              : "Select"
                                            : "Accept"}
                                        </button>
                                      ) : coinbase &&
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
                                  obj.allowedBuyer !==
                                    window.config.zero_address &&
                                  (obj.allowedBuyer.toLowerCase() ===
                                    coinbase?.toLowerCase() ||
                                    obj.seller.toLowerCase() ===
                                      coinbase?.toLowerCase())
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
                                              require("./assets/tageth.svg")
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
                                              require("./assets/tagbnb.svg")
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
                  {selectedItem === "activity" && (
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
                  )}

                  {(selectedItem === "open" || selectedItem === "private") && (
                    <div className="col-12 d-flex bg-transparent py-1 justify-content-between align-items-center">
                      <div
                        className="d-flex gap-1 align-items-center"
                        onClick={() => {
                          isWhiteListed && setmultiSelect(!multiSelect);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <FormGroup>
                          <FormControlLabel
                            onChange={() => {
                              isWhiteListed && setmultiSelect(!multiSelect);
                            }}
                            classes={"text-danger"}
                            // disabled={!isWhiteListed}
                            control={
                              <Checkbox
                                size="small"
                                checked={multiSelect}
                                sx={{
                                  color: "#828FBB",
                                  "&.Mui-checked": {
                                    color: "#3DBDA7",
                                  },
                                }}
                              />
                            }
                          />
                        </FormGroup>
                        <span
                          className={
                            multiSelect ? "checkboxtxt-active" : "checkboxtxt"
                          }
                        >
                          MultiSelect
                        </span>
                      </div>
                      {selectedOrderObjectArrayFinal.length > 0 &&
                        multiSelect && (
                          <button
                            className={
                              "connect-btn py-1 px-4 smallfont custom-width-btn"
                            }
                            onClick={() => {
                              setShowModal(true);
                            }}
                          >
                            Accept
                          </button>
                        )}
                      <Pagination
                        color="primary"
                        // variant="outlined"
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
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <OTCRibbon />
      </div>
      {showModal && (
        <Modal
          visible={showModal}
          onModalClose={() => {
            setShowModal(false);
            setselectedOrderObjectArrayFinal([]);
          }}
          maxWidth={500}
        >
          <OutsideClickHandler
            onOutsideClick={() => {
              setShowModal(false);
              setselectedOrderObjectArrayFinal([]);
            }}
          >
            {isWhiteListed ? (
              <div className="walletmodal-wrapper gap-3">
                <div className="sc-jwKygS bFQpTL">
                  <h3 style={{ fontSize: 20, color: "#fff" }} className="mb-2">
                    Confirm Transaction
                  </h3>
                  <span className="text-white">
                    Please review the summary before confirming.
                  </span>
                </div>

                <div className="d-flex flex-column gap-4">
                  {selectedOrderObjectArrayFinal &&
                    selectedOrderObjectArrayFinal.length > 0 &&
                    selectedOrderObjectArrayFinal.map((item, index) => {
                      return (
                        <div
                          className="confirm-summary-wrapper p-3"
                          key={index}
                        >
                          <div className="d-flex flex-column gap-2">
                            <div className="d-flex justify-content-between gap-2 align-items-center">
                              <span className="leftText">Token</span>
                              <span className="rightText d-flex align-items-center gap-2">
                                {item.tokenToSellSymbol}
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
                                  <img src={linkIcon} alt="" />{" "}
                                </a>
                              </span>
                            </div>
                            <div className="d-flex justify-content-between gap-2 align-items-center">
                              <span className="leftText">Buying</span>
                              <span className="rightText">
                                {getFormattedNumber(
                                  item.amountToSell /
                                    10 ** item.tokenToSellDecimals
                                )}{" "}
                                ({item.tokenToSellSymbol})
                              </span>
                            </div>
                            <div className="d-flex justify-content-between gap-2 align-items-center">
                              <span className="leftText">Spending</span>
                              <span className="rightText">
                                {getFormattedNumber(
                                  item.amountToBuy /
                                    10 ** item.tokenToBuyDecimals
                                )}{" "}
                                ({item.tokenToBuySymbol})
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  <div className="d-flex align-items-center gap-4 justify-content-between">
                    <button
                      onClick={() => {
                        acceptStatus === "buy"
                          ? handleAcceptOrder(
                              selectedOrderObjectArrayFinal,
                              selectedOrderObjectArrayFinal[0].chain
                            )
                          : handleApproveOrder(
                              selectedOrderObjectArrayFinal,
                              selectedOrderObjectArrayFinal[0].chain
                            );
                      }}
                      className="connect-btn py-1 m-auto w-50"
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
            ) : (
              <div className="walletmodal-wrapper gap-3">
                <div className="d-flex flex-column gap-4">
                  <h3 style={{ fontSize: 20, color: "#fff" }} className="mb-2">
                    You are not whitelisted
                  </h3>
                  <span className="text-white">
                    Click the button below in order to get whitelisted and
                    paritcipate in the token airdrop.
                  </span>
                </div>

                <div className="d-flex flex-column mt-4">
                  <div className="d-flex align-items-center gap-4 justify-content-between">
                    <button className="connect-btn py-1 m-auto w-50">
                      Join Airdrop
                    </button>
                  </div>
                </div>
              </div>
            )}
          </OutsideClickHandler>
        </Modal>
      )}
    </>
  );
};

export default Listing;
