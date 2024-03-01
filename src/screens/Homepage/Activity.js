import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { shortAddress } from "../../hooks/shortAddress";
import getFormattedNumber from "../../hooks/get-formatted-number";
import FadeLoader from "react-spinners/FadeLoader";
import Pagination from "@mui/material/Pagination";
import linkIcon from "./assets/linkIcon.svg";

const Activity = ({
  activityArray,
  loading,
  totalOrders2,
  collectedPage2,
  handleCollectedPage2,
}) => {
  const [selectedItem, setSelectedItem] = useState("activity");

  useEffect(() => {
    setSelectedItem("activity");
  }, []);

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "#41D8E7",
  };

  return (
    <div className="container-fluid faq-wrapper mb-5 px-0">
      <div className="mt-5">
        <div className="d-flex flex-column gap-3 animationText">
          <div className="container-lg">
            <h1 className="text-white font-organetto mainhero-title m-0">
              Recent{" "}
              <mark className="bg-transparent quicktitle font-organetto">
                Transactions
              </mark>
            </h1>
          </div>
          <div className="listing-wrapper-homepage py-5 w-100">
            <div className="container-lg">
              <div className="listing-items-wrapper w-100">
                <div className="d-flex flex-column gap-2 align-items-center">
                  <div className="items-wrapper"></div>
                  <div className="table-wrapper w-100 ">
                    <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                      <Table
                        sx={{ minWidth: 650 }}
                        size="medium"
                        // aria-label="a dense table"
                        // stickyHeader
                        stickyHeader aria-label="sticky table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell scope="row">Chain</TableCell>
                            <TableCell align="center" scope="row">Seller</TableCell>{" "}
                            <TableCell align="center" scope="row">Buyer</TableCell>
                            <TableCell align="center" scope="row">Selling</TableCell>
                            <TableCell align="center" scope="row">Buying</TableCell>
                            <TableCell align="center" scope="row">Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedItem === "activity" &&
                            activityArray &&
                            activityArray.length > 0 &&
                            loading === false &&
                            activityArray.map((item, index) => {
                              return (
                                <TableRow
                                  key={index}
                                 
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
                                </TableRow>
                              );
                            })}

                          {selectedItem === "activity" &&
                            activityArray.length === 0 &&
                            loading === false && (
                              <div className="empty-div-wrapper py-5">
                                <span className="text-white">
                                  No activity, check back later
                                </span>
                              </div>
                            )}
                        </TableBody>
                      </Table>
                      {loading === true && (
                        <div className="d-flex w-100 justify-content-center mt-5">
                          <FadeLoader
                            color={"#41D8E7"}
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
                    <div className="col-12 d-flex bg-transparent py-1 justify-content-center align-items-end">
                      <Pagination
                        color="primary"
                        // variant="outlined"
                        count={Math.ceil(totalOrders2 / 20)}
                        page={collectedPage2}
                        onChange={(e, value) => {
                          handleCollectedPage2(e, value);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activity;
