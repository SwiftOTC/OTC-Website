import React, { useState, useEffect } from "react";
import "./buying.css";
import Web3 from "web3";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import getFormattedNumber from "../../hooks/get-formatted-number";

const Buying = ({
  isConnected,
  coinbase,
  onConnect,
  chainId,
  openOrdersArray,
  pendingOrdersArray,
  completedOrdersArray,
  activityArray,
  onCreateOrderSuccess,
  onSwitchNetwork,
}) => {
  const [tokenAddress, setTokenAddress] = useState();
  const [tokenName, setTokenName] = useState();
  const [tokenSymbol, setTokenSymbol] = useState();
  const [tokenAmount, setTokenAmount] = useState();
  const [tokenDecimals, setTokenDecimals] = useState();
  const [tokenToSellDecimals, setTokenToSellDecimals] = useState();

  const [approveLoading, setApproveLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [isApprove, setisApprove] = useState(false);
  const [holderBalance, setHolderBalance] = useState(0);
  const [sellingStatus, setSellingStatus] = useState("initial");
  const [pricetoSell, setPrice] = useState();
  const [selectedToken, setselectedToken] = useState();

  const { BigNumber } = window;

  const handleSetTokenData = async (tokenInfo) => {
    const web3 = new Web3(window.ethereum);
    if (web3.utils.isAddress(tokenInfo)) {
      if (coinbase) {
        const token_contract = new web3.eth.Contract(
          window.TOKEN_ABI,
          tokenInfo
        );

        const token_symbol = await token_contract.methods
          .symbol()
          .call()
          .catch((e) => {
            console.error(e);
          });
        if (token_symbol) {
          setTokenSymbol(token_symbol);
        }

        const token_decimals = await token_contract.methods
          .decimals()
          .call()
          .catch((e) => {
            console.error(e);
          });

        setTokenToSellDecimals(token_decimals);

        const token_name = await token_contract.methods
          .name()
          .call()
          .catch((e) => {
            console.error(e);
          });
        if (token_name) {
          setTokenName(token_name);
        }
      }
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
    const price = pricetoSell * 10 ** tokenDecimals;
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

    await otc_contract.methods
      .createOrder(selectedToken, price2, tokenAddress, tokenAmount2)
      .send({ from: coinbase })
      .then(() => {
        setListLoading(false);
        setSellingStatus("successSelling");
        onCreateOrderSuccess();
        setTimeout(() => {
          setSellingStatus("initial");
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
          setTokenAmount(0);
        } else {
          const balance_formatted = holder_balance / 10 ** token_decimals;
          setTokenAmount(balance_formatted);
        }
      }
    }
  };

  const handleSetHolderBalance = async (tokenaddr) => {
    const web3 = new Web3(window.ethereum);
    let token_decimals;
    const token_contract = new web3.eth.Contract(window.TOKEN_ABI, tokenaddr);

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
        console.log(holder_balance);
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
    <div className="want-to-sell-wrapper col-lg-4 mt-5">
      <div className="d-flex flex-column gap-2 align-items-center">
        <h4 className="text-white">Want to buy</h4>

        <div className="d-flex flex-column gap-3 w-100 input-wrappers">
          <div className="d-flex position-relative w-100 align-items-start align-items-lg-center">
            <div className="d-flex position-relative w-100 align-items-center gap-2 justify-content-between">
              <div className="d-flex flex-column w-100">
                <input
                  className="sell-input w-100"
                  type="text"
                  placeholder="Price (Price for all Tokens)"
                  value={pricetoSell}
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                />
                <span className="balance-text d-flex d-lg-none d-md-none align-items-center gap-1 justify-content-end">
                  Balance:
                  <span className="balance-amount">
                    <b>{getFormattedNumber(holderBalance, 2)}</b>
                  </span>
                </span>
              </div>
              <div className="d-flex balance-wrapper position-absolute align-items-center gap-2 justify-content-between">
                <span className="balance-text d-none d-lg-flex d-md-flex flex-column">
                  Balance:{" "}
                  <span className="balance-amount">
                    <b>{getFormattedNumber(holderBalance, 2)}</b>
                  </span>
                </span>
                <button
                  className="max-btn btn"
                  onClick={handleMaxDeposit}
                  disabled={!holderBalance}
                >
                  Max
                </button>
              </div>
            </div>
            <FormControl sx={{ m: 1, minWidth: 140 }} size="small">
              <InputLabel id="demo-select-small-label">Select</InputLabel>
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
                  Object.keys(window.config.trading_tokens).map((t, i) => {
                    return (
                      <MenuItem value={t} key={i}>
                        <img
                          src={require(`../../assets/tradingtokens/${window.config.trading_tokens[
                            t
                          ]?.symbol.toLowerCase()}Icon.svg`)}
                          className="mx-1 tokenlogo"
                          alt=''
                        />
                        {window.config.trading_tokens[t]?.symbol}
                      </MenuItem>
                    );
                  })
                ) : chainId === 56 ? (
                  Object.keys(window.config.trading_tokens_bnb).map((t, i) => {
                    return (
                      <MenuItem value={t} key={i}>
                        <img
                          src={require(`../../assets/tradingtokens/${window.config.trading_tokens_bnb[
                            t
                          ]?.symbol.toLowerCase()}Icon.svg`)}
                          className="mx-1 tokenlogo"
                          alt=''
                        />
                        {window.config.trading_tokens_bnb[t]?.symbol}
                      </MenuItem>
                    );
                  })
                ) : (
                  <></>
                )}

                {/* <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem> */}
              </Select>
            </FormControl>
          </div>
          <input
            className="sell-input"
            type="text"
            placeholder="Token Address to Buy"
            value={tokenAddress}
            onChange={(e) => {
              setTokenAddress(e.target.value);
              handleSetTokenData(e.target.value);
            }}
          />
          <input
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
          />
          <input
            className="sell-input w-100"
            type="text"
            placeholder="Amount of Tokens to Buy"
            value={tokenAmount}
            onChange={(e) => {
              setTokenAmount(e.target.value);
            }}
          />

          <span className="text-secondary">Platform Fee: 1%</span>

          {!isConnected && (
            <button className="connect-btn btn" onClick={onConnect}>
              Connect Wallet
            </button>
          )}
          {isConnected && (
            <button
              className="connect-btn btn"
              onClick={() => {
                !isApprove ? handleApproveOrder() : handleCreateOrder();
              }}
              disabled={
                tokenAddress !== undefined &&
                tokenAmount !== undefined &&
                pricetoSell !== undefined &&
                selectedToken !== undefined
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
        {chainId === 1 ? (
          <span
            className="text-white w-100 justify-content-end text-decoration-underline d-flex"
            style={{ cursor: "pointer" }}
            onClick={() => {
              onSwitchNetwork("0x38");
            }}
          >
            Buy on BNB Chain
          </span>
        ) : chainId === 56 ? (
          <span
            className="text-white w-100 justify-content-end text-decoration-underline d-flex"
            style={{ cursor: "pointer" }}
            onClick={() => {
              onSwitchNetwork("0x1");
            }}
          >
            Buy on Ethereum
          </span>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Buying;
