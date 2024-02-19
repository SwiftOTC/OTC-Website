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
import RiseLoader from "react-spinners/RiseLoader";
import Pagination from "@mui/material/Pagination";

const Activity = ({ activityArray, loading, totalOrders2, collectedPage2, handleCollectedPage2 }) => {
  const [selectedItem, setSelectedItem] = useState("activity");

  useEffect(() => {
    setSelectedItem("activity");
  }, []);

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "#7e3455",
  };

  return (
    <div className="container-fluid faq-wrapper mb-5">
      <div className="container-lg">
        <div className="listing-wrapper mt-5">
          <div className="d-flex flex-column gap-3 align-items-center animationText">
            <h1 className="text-white text-center">
              <mark className="bg-transparent quicktitle">RECENT</mark>
              TRANSACTIONS
            </h1>
            <div className="listing-items-wrapper w-100 p-3">
              <div className="d-flex flex-column gap-2 align-items-center">
                <div className="items-wrapper"></div>
                <div className="table-wrapper w-100 ">
                  <TableContainer component={Paper}>
                    <Table
                      sx={{ minWidth: 650 }}
                      size="medium"
                      aria-label="a dense table"
                    >
                      <TableHead>
                        <TableRow>
                          {/* <TableCell>Token</TableCell> */}
                          <TableCell align="center">Seller</TableCell>{" "}
                          <TableCell align="center">Buyer</TableCell>
                          <TableCell align="center">Token to Sell</TableCell>
                          <TableCell align="center">Amount to Sell</TableCell>
                          <TableCell align="center">Token to Buy</TableCell>
                          <TableCell align="center">Amount to Buy</TableCell>
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
  );
};

export default Activity;
