import React, { useState, useEffect } from "react";
import "./buying.css";
import Web3 from "web3";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import getFormattedNumber from "../../hooks/get-formatted-number";
import OTCRibbon from "../../components/otcRibbon/otcRibbon";
import chart from "../../assets/svg/chart.svg";
import bnbIcon from "../../assets/svg/bnbIcon.svg";
import ethIcon from "../../assets/svg/ethIcon.svg";
import info from "../../assets/svg/info.svg";
import infoRed from "../../assets/svg/infoRed.svg";
import checkActive from "../../assets/svg/checkActive.svg";
import checkInactive from "../../assets/svg/checkInactive.svg";
import OutsideClickHandler from "react-outside-click-handler";
import Modal from "../../components/Modal/Modal";

const Buying = ({
  isConnected,
  coinbase,
  onConnect,
  chainId,
  onCreateOrderSuccess,
  onSwitchNetwork,
  isWhiteListed,
}) => {
  const [tokenAddress, setTokenAddress] = useState();
  const [tokenSymbol, setTokenSymbol] = useState();
  const [tokenAmount, setTokenAmount] = useState();
  const [destinationWallet, setdestinationWallet] = useState("");

  const [tokenDecimals, setTokenDecimals] = useState();
  const [tokenToSellDecimals, setTokenToSellDecimals] = useState();

  const [approveLoading, setApproveLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [isApprove, setisApprove] = useState(false);
  const [holderBalance, setHolderBalance] = useState(0);
  const [sellingStatus, setSellingStatus] = useState("initial");
  const [pricetoSell, setPrice] = useState();
  const [selectedToken, setselectedToken] = useState();
  const [disabled, setdisabled] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedStatus, setselectedStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { BigNumber } = window;

  const handleSetTokenData = async (tokenInfo) => {
    const web3 = new Web3(window.ethereum);
    if (web3.utils.isAddress(tokenInfo)) {
      if (coinbase) {
        setdisabled(true);
        const token_contract = new web3.eth.Contract(
          window.TOKEN_ABI,
          tokenInfo
        );

        const token_decimals = await token_contract.methods
          .decimals()
          .call()
          .catch((e) => {
            console.error(e);
          });

        setTokenToSellDecimals(token_decimals);

        // const token_name = await token_contract.methods
        //   .name()
        //   .call()
        //   .catch((e) => {
        //     console.error(e);
        //   });
        // if (token_name) {
        //   setTokenName(token_name);
        // }
      }
    } else {
      setdisabled(false);
      setTokenAddress("");
      setHolderBalance(0);
    }
  };

  const handleApproveOrder = async () => {
    setApproveLoading(true);
    setSellingStatus("loadingApprove");
    const web3 = new Web3(window.ethereum);
    const token_contract = new web3.eth.Contract(
      window.TOKEN_ABI,
      selectedToken
    );
    const price = new BigNumber(pricetoSell)
      .times(10 ** tokenDecimals)
      .toFixed(0);

    let tokenprice = new BigNumber(price).toFixed(0);
    const tokeToApprove =
      chainId === 1 ? window.config.otc_address : window.config.otc_bnb_address;

    await token_contract.methods
      .approve(tokeToApprove, tokenprice)
      .send({ from: coinbase })
      .then(() => {
        setApproveLoading(false);
        setSellingStatus("successApprove");
        setisApprove(true);
        setTimeout(() => {
          setSellingStatus("deposit");
        }, 2000);
      })
      .catch((e) => {
        console.error(e);
        setApproveLoading(false);
        setSellingStatus("errorApprove");

        setTimeout(() => {
          setSellingStatus("initial");
        }, 3000);
      });
  };

  const handleCreateOrder = async () => {
    setListLoading(true);
    const web3 = new Web3(window.ethereum);
    let selectedTokenDecimals;
    const tokeToCreateOrder =
      chainId === 1 ? window.config.otc_address : window.config.otc_bnb_address;
    setSellingStatus("loadingSelling");

    const otc_contract = new web3.eth.Contract(
      window.OTC_ABI,
      tokeToCreateOrder
    );

    const selectedToken_contract = new web3.eth.Contract(
      window.TOKEN_ABI,
      selectedToken
    );

    if (
      selectedToken.toLowerCase() ===
      "0xdac17f958d2ee523a2206206994597c13d831ec7"
    ) {
      selectedTokenDecimals = 6;
    } else {
      selectedTokenDecimals = await selectedToken_contract.methods
        .decimals()
        .call()
        .catch((e) => {
          console.error(e);
        });
    }

    const price2 = new BigNumber(
      pricetoSell * 10 ** selectedTokenDecimals
    ).toFixed(0);
    const tokenAmount2 = new BigNumber(
      tokenAmount * 10 ** tokenToSellDecimals
    ).toFixed(0);

    const allowedBuyer =
      selectedStatus === "public"
        ? window.config.zero_address
        : destinationWallet;

    console.log(
      selectedToken,
      price2,
      tokenAddress,
      tokenAmount2,
      allowedBuyer
    );

    const gasPrice = await web3.eth.getGasPrice();
    console.log("gasPrice", gasPrice);
    const currentGwei = web3.utils.fromWei(gasPrice, "gwei");
    const increasedGwei = parseInt(currentGwei) + 2;
    console.log("increasedGwei", increasedGwei);

    const transactionParameters = {
      gasPrice: web3.utils.toWei(increasedGwei.toString(), "gwei"),
    };

    await otc_contract.methods
      .createOrder(
        selectedToken,
        price2,
        tokenAddress,
        tokenAmount2,
        allowedBuyer
      )
      .estimateGas({ from: coinbase })
      .then((gas) => {
        transactionParameters.gas = web3.utils.toHex(gas);
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log(transactionParameters);



    await otc_contract.methods
      .createOrder(
        selectedToken,
        price2,
        tokenAddress,
        tokenAmount2,
        allowedBuyer
      )
      .send({ from: coinbase, ...transactionParameters })
      .then(() => {
        setListLoading(false);
        setSellingStatus("successSelling");
        onCreateOrderSuccess();
        setTimeout(() => {
          setSellingStatus("initial");
          setisApprove(false);
        }, 3000);
      })
      .catch((e) => {
        console.error(e);
        setListLoading(false);
        setSellingStatus("errorSelling");
        setTimeout(() => {
          setSellingStatus("initial");
        }, 3000);
      });
  };

  const handleMaxDeposit = async () => {
    const web3 = new Web3(window.ethereum);

    const token_contract = new web3.eth.Contract(
      window.TOKEN_ABI,
      selectedToken
    );
    if (coinbase) {
      const token_decimals = await token_contract.methods
        .decimals()
        .call()
        .catch((e) => {
          console.error(e);
        });

      const holder_balance = await token_contract.methods
        .balanceOf(coinbase)
        .call()
        .catch((e) => {
          console.error(e);
        });

      if (holder_balance) {
        if (holder_balance === 0) {
          // setTokenAmount(0);
          setPrice(0);
        } else {
          const balance_formatted = holder_balance / 10 ** token_decimals;
          // setTokenAmount(balance_formatted);
          setPrice(balance_formatted);
        }
      }
    }
  };

  const handleSetHolderBalance = async (tokenaddr) => {
    const web3 = new Web3(window.ethereum);
    let token_decimals;
    const token_contract = new web3.eth.Contract(window.TOKEN_ABI, tokenaddr);
    const token_symbol = await token_contract.methods
      .symbol()
      .call()
      .catch((e) => {
        console.error(e);
      });
    if (token_symbol) {
      setTokenSymbol(token_symbol);
    }
    if (coinbase) {
      if (
        tokenaddr.toLowerCase() === "0xdac17f958d2ee523a2206206994597c13d831ec7"
      ) {
        token_decimals = 6;
      } else {
        token_decimals = await token_contract.methods
          .decimals()
          .call()
          .catch((e) => {
            console.error(e);
          });
      }
      setTokenDecimals(token_decimals);
      const holder_balance = await token_contract.methods
        .balanceOf(coinbase)
        .call()
        .catch((e) => {
          console.error(e);
        });

      if (holder_balance) {
        if (holder_balance === 0) {
          setHolderBalance(holder_balance);
        } else {
          const balance_formatted = holder_balance / 10 ** token_decimals;
          setHolderBalance(balance_formatted);
        }
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="container-fluid px-0 otherpages-wrapper">
        <div className="d-flex flex-column gap-5 align-items-center">
          <div className="d-flex flex-column justify-content-center align-items-center mt-5">
            <h1 className="text-white font-organetto mainhero-title m-0">
              Place your buy{" "}
              <mark className="bg-transparent quicktitle font-organetto">
                order
              </mark>
            </h1>
            <span className="bottom-text-dexc">
              We take care of everything else
            </span>
          </div>
          <div className="listing-wrapper-homepage container-fluid mb-5 d-flex justify-content-center">
            <div className="want-to-sell-wrapper col-lg-4 mt-5 mb-5">
              <div className="d-flex flex-column gap-3 input-wrappers">
                <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between gap-2 w-100">
                  <div className="d-flex align-items-center gap-2">
                    <img src={chart} alt="" />
                    <span className="placeorder-title">SwiftOTC Buy</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      onClick={() => {
                        onSwitchNetwork("0x1");
                      }}
                      className={`${
                        chainId === 1 ? "chainbtn-active" : "chainbtn-inactive"
                      }  d-flex align-items-center gap-2`}
                    >
                      <img src={ethIcon} alt="" width={18} height={18} />
                      Ethereum
                    </button>
                    <button
                      onClick={() => {
                        onSwitchNetwork("0x38");
                      }}
                      className={`${
                        chainId === 56 ? "chainbtn-active" : "chainbtn-inactive"
                      }  d-flex align-items-center gap-2`}
                    >
                      <img src={bnbIcon} alt="" width={18} height={18} />
                      BNB Chain
                    </button>
                  </div>
                </div>
                <div className="d-flex flex-column gap-2">
                  <span className="text-white">Deposit</span>
                  <div className="d-flex align-items-center gap-2">
                    <div className="d-flex position-relative w-100">
                      <input
                        className="sell-input w-100"
                        type="text"
                        placeholder="0.00"
                        value={pricetoSell}
                        onChange={(e) => {
                          setPrice(e.target.value);
                        }}
                      />
                      <button
                        className={` ${
                          !holderBalance ? "max-btn-disabled" : "max-btn"
                        }   btn position-absolute`}
                        onClick={handleMaxDeposit}
                        disabled={!holderBalance}
                      >
                        Max
                      </button>
                    </div>
                    <FormControl sx={{ m: 1, minWidth: 140 }} size="small">
                      <InputLabel id="demo-select-small-label">
                        Select
                      </InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={selectedToken}
                        label="Age"
                        onChange={(e) => {
                          setselectedToken(e.target.value);
                          handleSetHolderBalance(e.target.value);
                        }}
                      >
                        {chainId === 1 ? (
                          Object.keys(window.config.trading_tokens).map(
                            (t, i) => {
                              return (
                                <MenuItem value={t} key={i}>
                                  <img
                                    src={require(`../../assets/tradingtokens/${window.config.trading_tokens[
                                      t
                                    ]?.symbol.toLowerCase()}Icon.svg`)}
                                    className="mx-1 tokenlogo"
                                    alt=""
                                  />
                                  {window.config.trading_tokens[t]?.symbol}
                                </MenuItem>
                              );
                            }
                          )
                        ) : chainId === 56 ? (
                          Object.keys(window.config.trading_tokens_bnb).map(
                            (t, i) => {
                              return (
                                <MenuItem value={t} key={i}>
                                  <img
                                    src={require(`../../assets/tradingtokens/${window.config.trading_tokens_bnb[
                                      t
                                    ]?.symbol.toLowerCase()}Icon.svg`)}
                                    className="mx-1 tokenlogo"
                                    alt=""
                                  />
                                  {window.config.trading_tokens_bnb[t]?.symbol}
                                </MenuItem>
                              );
                            }
                          )
                        ) : (
                          <span></span>
                        )}
                      </Select>
                    </FormControl>
                  </div>
                  <span className="balance-text d-flex align-items-center gap-1">
                    My Balance: {getFormattedNumber(holderBalance, 3)}{" "}
                    {tokenSymbol}
                  </span>
                </div>
                <div className="d-flex flex-column gap-2">
                  <span className="text-white">Receive</span>
                  <div className="receive-wrapper p-3">
                    <div className="d-flex flex-column gap-3">
                      <div className="d-flex gap-2 align-items-center justify-content-between">
                        <div className="d-flex flex-column gap-2">
                          <span className="receive-texts">Asset to buy</span>
                          <FormControl sx={{ m: 0 }} size="small">
                            <InputLabel id="demo-select-small-label">
                              Select
                            </InputLabel>
                            <Select
                              labelId="demo-select-small-label"
                              id="demo-select-small"
                              value={selectedToken}
                              label="Age"
                              onChange={(e) => {
                                setTokenAddress(e.target.value);
                                handleSetTokenData(e.target.value);
                              }}
                            >
                              {chainId === 1 ? (
                                Object.keys(window.config.trading_tokens)
                                  .filter((obj) => {
                                    return obj !== selectedToken;
                                  })
                                  .map((t, i) => {
                                    return (
                                      <MenuItem value={t} key={i}>
                                        <img
                                          src={require(`../../assets/tradingtokens/${window.config.trading_tokens[
                                            t
                                          ]?.symbol.toLowerCase()}Icon.svg`)}
                                          className="mx-1 tokenlogo"
                                          alt=""
                                        />
                                        {
                                          window.config.trading_tokens[t]
                                            ?.symbol
                                        }
                                      </MenuItem>
                                    );
                                  })
                              ) : chainId === 56 ? (
                                Object.keys(window.config.trading_tokens_bnb)
                                  .filter((obj) => {
                                    return obj !== selectedToken;
                                  })
                                  .map((t, i) => {
                                    return (
                                      <MenuItem value={t} key={i}>
                                        <img
                                          src={require(`../../assets/tradingtokens/${window.config.trading_tokens_bnb[
                                            t
                                          ]?.symbol.toLowerCase()}Icon.svg`)}
                                          className="mx-1 tokenlogo"
                                          alt=""
                                        />
                                        {
                                          window.config.trading_tokens_bnb[t]
                                            ?.symbol
                                        }
                                      </MenuItem>
                                    );
                                  })
                              ) : (
                                <span></span>
                              )}
                              <MenuItem value={"other"}>
                                <img
                                  src={
                                    require(`../../assets/tradingtokens/otherIcon.svg`)
                                      .default
                                  }
                                  className="mx-1 tokenlogo"
                                  alt=""
                                />
                                Other
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                        <div className="d-flex flex-column w-100 gap-2">
                          <span className="receive-texts">Token address</span>
                          <div className="position-relative w-100">
                            <input
                              className="sell-input w-100"
                              type="text"
                              placeholder="Token Address to Buy"
                              value={tokenAddress}
                              disabled={disabled}
                              onChange={(e) => {
                                setTokenAddress(e.target.value);
                                handleSetTokenData(e.target.value);
                              }}
                              onBlur={() => {
                                setShowTooltip(false);
                              }}
                            />
                            <img
                              src={infoRed}
                              alt=""
                              className="position-absolute infoRed"
                              onClick={() => {
                                setShowTooltip(true);
                              }}
                            />
                            <OutsideClickHandler
                              onOutsideClick={() => {
                                setShowTooltip(false);
                              }}
                            >
                              <div
                                className={`tooltip-wrapper p-2 ${
                                  showTooltip && "tooltip-active"
                                }`}
                                style={{ top: "-20px", right: 0 }}
                              >
                                <p className="tooltip-content m-0">
                                  *Tokens with transfer fees cannot be traded!
                                </p>
                              </div>
                            </OutsideClickHandler>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex flex-column w-100 gap-2">
                        <span className="receive-texts">
                          Amount of tokens to buy
                        </span>
                        <input
                          className="sell-input w-100"
                          type="text"
                          placeholder="Amount of Tokens to Buy"
                          value={tokenAmount}
                          onChange={(e) => {
                            setTokenAmount(e.target.value);
                          }}
                        />
                      </div>
                      <span className="fee-txt">
                        <img src={info} alt="" /> Platform Fee: 1%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="receive-wrapper p-3">
                  <div className="d-flex align-items-center gap-2 justify-content-between w-100">
                    <span className="receive-texts">Order Status</span>
                    <div className="d-flex gap-3 align-items-center">
                      <div
                        className="position-relative"
                        onClick={() => {
                          setselectedStatus("public");
                        }}
                      >
                        <div
                          className={`${
                            selectedStatus === "public"
                              ? "status-item-active"
                              : "status-item"
                          } py-1 px-2`}
                        >
                          <span
                            className={`${
                              selectedStatus === "public"
                                ? "status-txt-active"
                                : "status-txt"
                            }`}
                          >
                            Public
                          </span>
                        </div>
                        <img
                          src={
                            selectedStatus === "public"
                              ? checkActive
                              : checkInactive
                          }
                          alt=""
                          className="checkicon"
                        />
                      </div>
                      <div
                        className="position-relative"
                        onClick={() => {
                          setselectedStatus("private");
                        }}
                      >
                        <div
                          className={`${
                            selectedStatus === "private"
                              ? "status-item-active"
                              : "status-item"
                          } py-1 px-2`}
                        >
                          <span
                            className={`${
                              selectedStatus === "private"
                                ? "status-txt-active"
                                : "status-txt"
                            }`}
                          >
                            Private
                          </span>
                        </div>

                        <img
                          src={
                            selectedStatus === "private"
                              ? checkActive
                              : checkInactive
                          }
                          alt=""
                          className="checkicon"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {selectedStatus === "private" && (
                  <div className="receive-wrapper p-3">
                    <div className="d-flex flex-column gap-2 w-100">
                      <span className="receive-texts">
                        Specify the accessing wallet address
                      </span>
                      <div className="d-flex gap-3 align-items-center">
                        <input
                          className="sell-input w-100"
                          type="text"
                          placeholder="0x000..."
                          value={destinationWallet}
                          onChange={(e) => {
                            setdestinationWallet(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* <input
                className="sell-input"
                type="text"
                placeholder="Token Address to Buy"
                value={tokenAddress}
                onChange={(e) => {
                  setTokenAddress(e.target.value);
                  handleSetTokenData(e.target.value);
                }}
              /> */}
                {/* <input
                className="sell-input"
                type="text"
                placeholder="Token Name"
                disabled
                value={tokenName}
              />
              <input
                className="sell-input"
                type="text"
                placeholder="Token Symbol"
                disabled
                value={tokenSymbol}
              /> */}

                {!isConnected && (
                  <button
                    className="connect-btn btn custom-width-btn m-auto"
                    onClick={onConnect}
                  >
                    Connect Wallet
                  </button>
                )}
                {isConnected && (
                  <button
                    className="connect-btn btn col-4 m-auto"
                    onClick={() => {
                      !isApprove && isWhiteListed
                        ? handleApproveOrder()
                        : isApprove && isWhiteListed
                        ? handleCreateOrder()
                        : setShowModal(true);
                    }}
                    disabled={
                      tokenAddress !== undefined &&
                      tokenAmount !== undefined &&
                      pricetoSell !== undefined &&
                      selectedToken !== undefined &&
                      (selectedStatus === "public" ||
                        (selectedStatus === "private" &&
                          destinationWallet !== ""))
                        ? false
                        : true
                    }
                  >
                    {approveLoading || listLoading ? (
                      <>
                        {sellingStatus === "loadingApprove"
                          ? "Approving"
                          : "Listing to buy"}
                        <div
                          class="mx-2 spinner-border spinner-border-sm text-light"
                          role="status"
                        ></div>
                      </>
                    ) : sellingStatus === "initial" ? (
                      <>Approve</>
                    ) : sellingStatus === "deposit" ? (
                      <>List to buy</>
                    ) : sellingStatus.includes("success") ? (
                      <>Success</>
                    ) : (
                      <>Failed</>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
          <OTCRibbon />
        </div>
      </div>
      {showModal && !isWhiteListed && (
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
          </OutsideClickHandler>
        </Modal>
      )}
    </>
  );
};

export default Buying;
