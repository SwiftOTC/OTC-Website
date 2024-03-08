import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import Listing from "./screens/Listing/Listing";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import MobileHeader from "./components/mobileHeader/mobileHeader";
import Buying from "./screens/Buying/Buying";
import Homepage from "./screens/Homepage/Homepage";
import Selling from "./screens/Selling/Selling";
import { handleSwitchNetworkhook } from "./hooks/switchNetwork";
import "./fonts/Organetto.ttf";
import WalletModal from "./components/WalletModal/WalletModal";
import Account from "./screens/Account/Account";

function App() {
  const [coinbase, setCoinbase] = useState();
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState(0);

  const [activityArray, setactivityArray] = useState([]);
  const [activityArray2, setactivityArray2] = useState([]);

  const [completedOrdersArray, setcompletedOrdersArray] = useState([]);
  const [openOrdersArray, setopenOrdersArray] = useState([]);

  const [usercompletedOrdersArray, setUsercompletedOrdersArray] = useState([]);
  const [useropenOrdersArray, setUseropenOrdersArray] = useState([]);
  const [useractivityArray, setUseractivityArray] = useState([]);

  const [userloading, setUserLoading] = useState(false);

  const [count, setcount] = useState(0);
  const [usercount, setUsercount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [collectedPage, setCollectedPage] = useState(1);
  const [collectedPageSlice, setCollectedPageSlice] = useState(20);

  const [collectedPage2, setCollectedPage2] = useState(1);
  const [collectedPageSlice2, setCollectedPageSlice2] = useState(20);

  const [completedPage, setCompletedPage] = useState(1);
  const [completedSlice, setCompletedSlice] = useState(20);

  const [openPage, setOpenPage] = useState(1);
  const [openSlice, setOpenSlice] = useState(20);

  const [totalOrders, settotalOrders] = useState(0);
  const [walletModal, setWalletModal] = useState(false);

  const logout = localStorage.getItem("logout");
  const dataFetchedRef = useRef(false);
  const dataFetchedRef2 = useRef(false);

  const handleConnect = async () => {
    await window.connectWallet().then(() => {
      setIsConnected(true);
      setWalletModal(false);
    });
    await window.getCoinbase().then((data) => {
      localStorage.setItem("logout", "false");
      setCoinbase(data);
    });
  };

  const handleDisconnect = async () => {
    if (!window.gatewallet) {
      await window.disconnectWallet();
      localStorage.setItem("logout", "true");
      setUseractivityArray([]);
      setUserLoading(false);
      setUsercompletedOrdersArray([]);
      setUseropenOrdersArray([]);
      setCoinbase();
      setIsConnected(false);
    }
  };

  const handleCollectedPage = (e, value) => {
    setCollectedPage(value);
    setCollectedPageSlice(value * 20);
    getActivityOrders(value * 20);
  };

  const handleCollectedPage2 = (e, value) => {
    setCollectedPage2(value);
    setCollectedPageSlice2(value * 20);
    getActivityOrders2(value * 20);
  };

  const handleCompletedPage = (e, value) => {
    setCompletedPage(value);
    setCompletedSlice(value * 20);
    getAllCompletedOrders(value * 20);
  };

  const handleOpenPage = (e, value) => {
    setOpenPage(value);
    setOpenSlice(value * 20);
    getAllOpenOrders(value * 20);
  };

  const getAllOpenOrders = async (pageslice) => {
    const netID = await window.ethereum
      .request({ method: "net_version" })
      .then((data) => {
        return parseInt(data);
      })
      .catch(console.error);
    setLoading(true);
    const otc_contract = new window.infuraWeb3.eth.Contract(
      window.OTC_OLD_ABI,
      window.config.otc_address
    );

    const otc_bnb_contract = new window.bscWeb3.eth.Contract(
      window.OTC_ABI,
      window.config.otc_bnb_address
    );

    const openArray = [];

    const openArrayBnb = [];

    const orderCount = await otc_contract.methods
      .orderCount()
      .call()
      .catch((e) => {
        console.error(e);
      });

    const orderCount_bnb = await otc_bnb_contract.methods
      .orderCount()
      .call()
      .catch((e) => {
        console.error(e);
      });

    if (orderCount && Number(orderCount) > 0) {
      await Promise.all(
        window.range(0, Number(orderCount) - 1).map(async (i) => {
          let tokenToSell_decimals;
          let tokenToBuy_decimals;
          let tokenToSell_symbol;
          let tokenToBuy_symbol;

          const orderDetail = await otc_contract.methods
            .orders(i)
            .call()
            .catch((e) => {
              console.error(e);
            });

          if (orderDetail) {
            const filteredInfo = Object.fromEntries(
              Object.entries(orderDetail)
            );

            const tokenToSell_contract = new window.infuraWeb3.eth.Contract(
              window.TOKEN_ABI,
              filteredInfo.tokenToSell
            );

            const tokenToBuy_contract = new window.infuraWeb3.eth.Contract(
              window.TOKEN_ABI,
              filteredInfo.tokenToBuy
            );

            if (
              filteredInfo.tokenToSell.toLowerCase() ===
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ) {
              tokenToSell_symbol = "USDC";
            } else {
              tokenToSell_symbol = await tokenToSell_contract.methods
                .symbol()
                .call()
                .catch((e) => {
                  console.error(e);
                });
            }

            if (
              filteredInfo.tokenToSell.toLowerCase() ===
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ) {
              tokenToSell_decimals = 6;
            } else {
              tokenToSell_decimals = await tokenToSell_contract.methods
                .decimals()
                .call()
                .catch((e) => {
                  console.error(e);
                });
            }

            if (
              filteredInfo.tokenToBuy.toLowerCase() ===
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ) {
              tokenToBuy_decimals = 6;
            } else {
              tokenToBuy_decimals = await tokenToBuy_contract.methods
                .decimals()
                .call()
                .catch((e) => {
                  console.error(e);
                });
            }
            if (
              filteredInfo.tokenToBuy.toLowerCase() ===
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ) {
              tokenToBuy_symbol = "USDC";
            } else {
              tokenToBuy_symbol = await tokenToBuy_contract.methods
                .symbol()
                .call()
                .catch((e) => {
                  console.error(e);
                });
            }
            if (filteredInfo && filteredInfo.status === "0") {
              openArray.push({
                ...filteredInfo,
                tokenToSellSymbol: tokenToSell_symbol,
                tokenToBuySymbol: tokenToBuy_symbol,
                tokenToSellDecimals: tokenToSell_decimals,
                tokenToBuyDecimals: tokenToBuy_decimals,
                chain: 1,
              });
            }
          }
        })
      );

      // const finalPendingArray = Object.values((pendingOrdersArray))
    }

    if (orderCount_bnb && Number(orderCount_bnb) > 0) {
      const limit = pageslice > orderCount_bnb ? orderCount_bnb : pageslice;

      await Promise.all(
        window.range(pageslice - 20, limit - 1).map(async (i) => {
          let tokenToSell_decimals;
          let tokenToBuy_decimals;
          let tokenToSell_symbol;
          let tokenToBuy_symbol;

          const orderDetail = await otc_bnb_contract.methods
            .orders(i)
            .call()
            .catch((e) => {
              console.error(e);
            });

          const filteredInfo = Object.fromEntries(Object.entries(orderDetail));

          const tokenToSell_contract = new window.bscWeb3.eth.Contract(
            window.TOKEN_ABI,
            filteredInfo.tokenToSell
          );

          const tokenToBuy_contract = new window.bscWeb3.eth.Contract(
            window.TOKEN_ABI,
            filteredInfo.tokenToBuy
          );

          if (
            filteredInfo.tokenToSell.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToSell_symbol = "USDC";
          } else {
            tokenToSell_symbol = await tokenToSell_contract.methods
              .symbol()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }

          if (
            filteredInfo.tokenToSell.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToSell_decimals = 6;
          } else {
            tokenToSell_decimals = await tokenToSell_contract.methods
              .decimals()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }

          if (
            filteredInfo.tokenToBuy.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToBuy_decimals = 6;
          } else {
            tokenToBuy_decimals = await tokenToBuy_contract.methods
              .decimals()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }
          if (
            filteredInfo.tokenToBuy.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToBuy_symbol = "USDC";
          } else {
            tokenToBuy_symbol = await tokenToBuy_contract.methods
              .symbol()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }
          if (filteredInfo && filteredInfo.status === "0") {
            openArrayBnb.push({
              ...filteredInfo,
              tokenToSellSymbol: tokenToSell_symbol,
              tokenToBuySymbol: tokenToBuy_symbol,
              tokenToSellDecimals: tokenToSell_decimals,
              tokenToBuyDecimals: tokenToBuy_decimals,
              chain: 56,
            });
          }
        })
      );
    }

    if (netID === 1) {
      setopenOrdersArray(openArray.reverse());
    } else {
      setopenOrdersArray(openArrayBnb.reverse());
    }
    setLoading(false);
  };

  const getAllCompletedOrders = async (pageslice) => {
    setLoading(true);
    const otc_contract = new window.infuraWeb3.eth.Contract(
      window.OTC_OLD_ABI,
      window.config.otc_address
    );

    const otc_bnb_contract = new window.bscWeb3.eth.Contract(
      window.OTC_ABI,
      window.config.otc_bnb_address
    );

    const otc_old_contract = new window.infuraWeb3.eth.Contract(
      window.OTC_OLD_ABI,
      window.config.otc_old_address
    );

    const otc_old_bnb_contract = new window.bscWeb3.eth.Contract(
      window.OTC_OLD_ABI,
      window.config.otc_old_bnb_address
    );

    const completedArray = [];

    const orderCount = await otc_contract.methods
      .orderCount()
      .call()
      .catch((e) => {
        console.error(e);
      });

    const orderCount_bnb = await otc_bnb_contract.methods
      .orderCount()
      .call()
      .catch((e) => {
        console.error(e);
      });

    const orderCountOld = await otc_old_contract.methods
      .orderCount()
      .call()
      .catch((e) => {
        console.error(e);
      });

    const orderCount_bnbOld = await otc_old_bnb_contract.methods
      .orderCount()
      .call()
      .catch((e) => {
        console.error(e);
      });

    if (orderCount && Number(orderCount) > 0) {
      await Promise.all(
        window.range(0, Number(orderCount) - 1).map(async (i) => {
          let tokenToSell_decimals;
          let tokenToBuy_decimals;
          let tokenToSell_symbol;
          let tokenToBuy_symbol;

          const orderDetail = await otc_contract.methods
            .orders(i)
            .call()
            .catch((e) => {
              console.error(e);
            });
          if (orderDetail) {
            const filteredInfo = Object.fromEntries(
              Object.entries(orderDetail)
            );

            const tokenToSell_contract = new window.infuraWeb3.eth.Contract(
              window.TOKEN_ABI,
              filteredInfo.tokenToSell
            );

            const tokenToBuy_contract = new window.infuraWeb3.eth.Contract(
              window.TOKEN_ABI,
              filteredInfo.tokenToBuy
            );

            if (
              filteredInfo.tokenToSell.toLowerCase() ===
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ) {
              tokenToSell_symbol = "USDC";
            } else {
              tokenToSell_symbol = await tokenToSell_contract.methods
                .symbol()
                .call()
                .catch((e) => {
                  console.error(e);
                });
            }

            if (
              filteredInfo.tokenToSell.toLowerCase() ===
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ) {
              tokenToSell_decimals = 6;
            } else {
              tokenToSell_decimals = await tokenToSell_contract.methods
                .decimals()
                .call()
                .catch((e) => {
                  console.error(e);
                });
            }

            if (
              filteredInfo.tokenToBuy.toLowerCase() ===
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ) {
              tokenToBuy_decimals = 6;
            } else {
              tokenToBuy_decimals = await tokenToBuy_contract.methods
                .decimals()
                .call()
                .catch((e) => {
                  console.error(e);
                });
            }
            if (
              filteredInfo.tokenToBuy.toLowerCase() ===
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ) {
              tokenToBuy_symbol = "USDC";
            } else {
              tokenToBuy_symbol = await tokenToBuy_contract.methods
                .symbol()
                .call()
                .catch((e) => {
                  console.error(e);
                });
            }
            if (filteredInfo && filteredInfo.status === "1") {
              completedArray.push({
                ...filteredInfo,
                tokenToSellSymbol: tokenToSell_symbol,
                tokenToBuySymbol: tokenToBuy_symbol,
                tokenToSellDecimals: tokenToSell_decimals,
                tokenToBuyDecimals: tokenToBuy_decimals,
                chain: 1,
              });
            }
          }
        })
      );

      // const finalPendingArray = Object.values((pendingOrdersArray))
    }

    if (orderCount_bnb && Number(orderCount_bnb) > 0) {
      const limit = pageslice > orderCount_bnb ? orderCount_bnb : pageslice;

      await Promise.all(
        window.range(pageslice - 20, limit - 1).map(async (i) => {
          let tokenToSell_decimals;
          let tokenToBuy_decimals;
          let tokenToSell_symbol;
          let tokenToBuy_symbol;

          const orderDetail = await otc_bnb_contract.methods
            .orders(i)
            .call()
            .catch((e) => {
              console.error(e);
            });

          const filteredInfo = Object.fromEntries(Object.entries(orderDetail));

          const tokenToSell_contract = new window.bscWeb3.eth.Contract(
            window.TOKEN_ABI,
            filteredInfo.tokenToSell
          );

          const tokenToBuy_contract = new window.bscWeb3.eth.Contract(
            window.TOKEN_ABI,
            filteredInfo.tokenToBuy
          );

          if (
            filteredInfo.tokenToSell.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToSell_symbol = "USDC";
          } else {
            tokenToSell_symbol = await tokenToSell_contract.methods
              .symbol()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }

          if (
            filteredInfo.tokenToSell.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToSell_decimals = 6;
          } else {
            tokenToSell_decimals = await tokenToSell_contract.methods
              .decimals()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }

          if (
            filteredInfo.tokenToBuy.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToBuy_decimals = 6;
          } else {
            tokenToBuy_decimals = await tokenToBuy_contract.methods
              .decimals()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }
          if (
            filteredInfo.tokenToBuy.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToBuy_symbol = "USDC";
          } else {
            tokenToBuy_symbol = await tokenToBuy_contract.methods
              .symbol()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }
          if (filteredInfo && filteredInfo.status === "1") {
            completedArray.push({
              ...filteredInfo,
              tokenToSellSymbol: tokenToSell_symbol,
              tokenToBuySymbol: tokenToBuy_symbol,
              tokenToSellDecimals: tokenToSell_decimals,
              tokenToBuyDecimals: tokenToBuy_decimals,
              chain: 56,
            });
          }
        })
      );
    }

    if (orderCountOld && Number(orderCountOld) > 0) {
      await Promise.all(
        window.range(0, orderCountOld - 1).map(async (i) => {
          let tokenToSell_decimals;
          let tokenToBuy_decimals;
          let tokenToSell_symbol;
          let tokenToBuy_symbol;

          const orderDetail = await otc_old_contract.methods
            .orders(i)
            .call()
            .catch((e) => {
              console.error(e);
            });

          const filteredInfo = Object.fromEntries(Object.entries(orderDetail));

          const tokenToSell_contract = new window.infuraWeb3.eth.Contract(
            window.TOKEN_ABI,
            filteredInfo.tokenToSell
          );

          const tokenToBuy_contract = new window.infuraWeb3.eth.Contract(
            window.TOKEN_ABI,
            filteredInfo.tokenToBuy
          );

          if (
            filteredInfo.tokenToSell.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToSell_symbol = "USDC";
          } else {
            tokenToSell_symbol = await tokenToSell_contract.methods
              .symbol()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }

          if (
            filteredInfo.tokenToSell.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToSell_decimals = 6;
          } else {
            tokenToSell_decimals = await tokenToSell_contract.methods
              .decimals()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }

          if (
            filteredInfo.tokenToBuy.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToBuy_decimals = 6;
          } else {
            tokenToBuy_decimals = await tokenToBuy_contract.methods
              .decimals()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }
          if (
            filteredInfo.tokenToBuy.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToBuy_symbol = "USDC";
          } else {
            tokenToBuy_symbol = await tokenToBuy_contract.methods
              .symbol()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }
          if (filteredInfo && filteredInfo.status === "2") {
            completedArray.push({
              ...filteredInfo,
              tokenToSellSymbol: tokenToSell_symbol,
              tokenToBuySymbol: tokenToBuy_symbol,
              tokenToSellDecimals: tokenToSell_decimals,
              tokenToBuyDecimals: tokenToBuy_decimals,
              chain: 1,
            });
          }
        })
      );

      // const finalPendingArray = Object.values((pendingOrdersArray))
    }

    if (orderCount_bnbOld && Number(orderCount_bnbOld) > 0) {
      const limit =
        pageslice > orderCount_bnbOld ? orderCount_bnbOld : pageslice;

      await Promise.all(
        window.range(pageslice - 20, limit - 1).map(async (i) => {
          let tokenToSell_decimals;
          let tokenToBuy_decimals;
          let tokenToSell_symbol;
          let tokenToBuy_symbol;

          const orderDetail = await otc_old_bnb_contract.methods
            .orders(i)
            .call()
            .catch((e) => {
              console.error(e);
            });

          const filteredInfo = Object.fromEntries(Object.entries(orderDetail));

          const tokenToSell_contract = new window.bscWeb3.eth.Contract(
            window.TOKEN_ABI,
            filteredInfo.tokenToSell
          );

          const tokenToBuy_contract = new window.bscWeb3.eth.Contract(
            window.TOKEN_ABI,
            filteredInfo.tokenToBuy
          );

          if (
            filteredInfo.tokenToSell.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToSell_symbol = "USDC";
          } else {
            tokenToSell_symbol = await tokenToSell_contract.methods
              .symbol()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }

          if (
            filteredInfo.tokenToSell.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToSell_decimals = 6;
          } else {
            tokenToSell_decimals = await tokenToSell_contract.methods
              .decimals()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }

          if (
            filteredInfo.tokenToBuy.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToBuy_decimals = 6;
          } else {
            tokenToBuy_decimals = await tokenToBuy_contract.methods
              .decimals()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }
          if (
            filteredInfo.tokenToBuy.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToBuy_symbol = "USDC";
          } else {
            tokenToBuy_symbol = await tokenToBuy_contract.methods
              .symbol()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }
          if (filteredInfo && filteredInfo.status === "2") {
            completedArray.push({
              ...filteredInfo,
              tokenToSellSymbol: tokenToSell_symbol,
              tokenToBuySymbol: tokenToBuy_symbol,
              tokenToSellDecimals: tokenToSell_decimals,
              tokenToBuyDecimals: tokenToBuy_decimals,
              chain: 56,
            });
          }
        })
      );
    }

    setcompletedOrdersArray(completedArray.reverse());
    setLoading(false);
  };

  const getActivityOrders = async (pageslice) => {
    setLoading(true);
    const otc_contract = new window.infuraWeb3.eth.Contract(
      window.OTC_OLD_ABI,
      window.config.otc_address
    );

    const otc_bnb_contract = new window.bscWeb3.eth.Contract(
      window.OTC_ABI,
      window.config.otc_bnb_address
    );

    const otc_old_contract = new window.infuraWeb3.eth.Contract(
      window.OTC_OLD_ABI,
      window.config.otc_old_address
    );

    const otc_old_bnb_contract = new window.bscWeb3.eth.Contract(
      window.OTC_OLD_ABI,
      window.config.otc_old_bnb_address
    );

    const activityArray = [];

    const orderCount = await otc_contract.methods
      .orderCount()
      .call()
      .catch((e) => {
        console.error(e);
      });

    const orderCount_bnb = await otc_bnb_contract.methods
      .orderCount()
      .call()
      .catch((e) => {
        console.error(e);
      });

    const orderCountOld = await otc_old_contract.methods
      .orderCount()
      .call()
      .catch((e) => {
        console.error(e);
      });

    const orderCount_bnbOld = await otc_old_bnb_contract.methods
      .orderCount()
      .call()
      .catch((e) => {
        console.error(e);
      });

    settotalOrders(
      Number(orderCount) +
        Number(orderCount_bnb) +
        Number(orderCountOld) +
        Number(orderCount_bnbOld)
    );
    if (orderCount_bnb && Number(orderCount_bnb) > 0) {
      const limit = pageslice > orderCount_bnb ? orderCount_bnb : pageslice;

      await Promise.all(
        window.range(pageslice - 20, limit - 1).map(async (i) => {
          let tokenToSell_decimals;
          let tokenToBuy_decimals;
          let tokenToSell_symbol;
          let tokenToBuy_symbol;

          const orderDetail = await otc_bnb_contract.methods
            .orders(i)
            .call()
            .catch((e) => {
              console.error(e);
            });

          const filteredInfo = Object.fromEntries(Object.entries(orderDetail));

          const tokenToSell_contract = new window.bscWeb3.eth.Contract(
            window.TOKEN_ABI,
            filteredInfo.tokenToSell
          );

          const tokenToBuy_contract = new window.bscWeb3.eth.Contract(
            window.TOKEN_ABI,
            filteredInfo.tokenToBuy
          );

          if (
            filteredInfo.tokenToSell.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToSell_symbol = "USDC";
          } else {
            tokenToSell_symbol = await tokenToSell_contract.methods
              .symbol()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }

          if (
            filteredInfo.tokenToSell.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToSell_decimals = 6;
          } else {
            tokenToSell_decimals = await tokenToSell_contract.methods
              .decimals()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }

          if (
            filteredInfo.tokenToBuy.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToBuy_decimals = 6;
          } else {
            tokenToBuy_decimals = await tokenToBuy_contract.methods
              .decimals()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }
          if (
            filteredInfo.tokenToBuy.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToBuy_symbol = "USDC";
          } else {
            tokenToBuy_symbol = await tokenToBuy_contract.methods
              .symbol()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }
          if (filteredInfo && filteredInfo.status === "0") {
            activityArray.push({
              ...filteredInfo,
              tokenToSellSymbol: tokenToSell_symbol,
              tokenToBuySymbol: tokenToBuy_symbol,
              tokenToSellDecimals: tokenToSell_decimals,
              tokenToBuyDecimals: tokenToBuy_decimals,
              chain: 56,
            });
          } else if (filteredInfo && filteredInfo.status === "1") {
            activityArray.push({
              ...filteredInfo,
              tokenToSellSymbol: tokenToSell_symbol,
              tokenToBuySymbol: tokenToBuy_symbol,
              tokenToSellDecimals: tokenToSell_decimals,
              tokenToBuyDecimals: tokenToBuy_decimals,
              chain: 56,
            });
          }
        })
      );
    }

    if (orderCount && Number(orderCount) > 0) {
      await Promise.all(
        window.range(0, Number(orderCount) - 1).map(async (i) => {
          let tokenToSell_decimals;
          let tokenToBuy_decimals;
          let tokenToSell_symbol;
          let tokenToBuy_symbol;

          const orderDetail = await otc_contract.methods
            .orders(i)
            .call()
            .catch((e) => {
              console.error(e);
            });
          if (orderDetail) {
            const filteredInfo = Object.fromEntries(
              Object.entries(orderDetail)
            );

            const tokenToSell_contract = new window.infuraWeb3.eth.Contract(
              window.TOKEN_ABI,
              filteredInfo.tokenToSell
            );

            const tokenToBuy_contract = new window.infuraWeb3.eth.Contract(
              window.TOKEN_ABI,
              filteredInfo.tokenToBuy
            );

            if (
              filteredInfo.tokenToSell.toLowerCase() ===
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ) {
              tokenToSell_symbol = "USDC";
            } else {
              tokenToSell_symbol = await tokenToSell_contract.methods
                .symbol()
                .call()
                .catch((e) => {
                  console.error(e);
                });
            }

            if (
              filteredInfo.tokenToSell.toLowerCase() ===
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ) {
              tokenToSell_decimals = 6;
            } else {
              tokenToSell_decimals = await tokenToSell_contract.methods
                .decimals()
                .call()
                .catch((e) => {
                  console.error(e);
                });
            }

            if (
              filteredInfo.tokenToBuy.toLowerCase() ===
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ) {
              tokenToBuy_decimals = 6;
            } else {
              tokenToBuy_decimals = await tokenToBuy_contract.methods
                .decimals()
                .call()
                .catch((e) => {
                  console.error(e);
                });
            }
            if (
              filteredInfo.tokenToBuy.toLowerCase() ===
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ) {
              tokenToBuy_symbol = "USDC";
            } else {
              tokenToBuy_symbol = await tokenToBuy_contract.methods
                .symbol()
                .call()
                .catch((e) => {
                  console.error(e);
                });
            }
            if (filteredInfo && filteredInfo.status === "0") {
              activityArray.push({
                ...filteredInfo,
                tokenToSellSymbol: tokenToSell_symbol,
                tokenToBuySymbol: tokenToBuy_symbol,
                tokenToSellDecimals: tokenToSell_decimals,
                tokenToBuyDecimals: tokenToBuy_decimals,
                chain: 1,
              });
            } else if (filteredInfo && filteredInfo.status === "1") {
              activityArray.push({
                ...filteredInfo,
                tokenToSellSymbol: tokenToSell_symbol,
                tokenToBuySymbol: tokenToBuy_symbol,
                tokenToSellDecimals: tokenToSell_decimals,
                tokenToBuyDecimals: tokenToBuy_decimals,
                chain: 1,
              });
            }
          }
        })
      );

      // const finalPendingArray = Object.values((pendingOrdersArray))
    }

    if (orderCountOld && Number(orderCountOld) > 0) {
      await Promise.all(
        window.range(0, Number(orderCount) - 1).map(async (i) => {
          let tokenToSell_decimals;
          let tokenToBuy_decimals;
          let tokenToSell_symbol;
          let tokenToBuy_symbol;

          const orderDetail = await otc_old_contract.methods
            .orders(i)
            .call()
            .catch((e) => {
              console.error(e);
            });

          const filteredInfo = Object.fromEntries(Object.entries(orderDetail));

          const tokenToSell_contract = new window.infuraWeb3.eth.Contract(
            window.TOKEN_ABI,
            filteredInfo.tokenToSell
          );

          const tokenToBuy_contract = new window.infuraWeb3.eth.Contract(
            window.TOKEN_ABI,
            filteredInfo.tokenToBuy
          );

          if (
            filteredInfo.tokenToSell.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToSell_symbol = "USDC";
          } else {
            tokenToSell_symbol = await tokenToSell_contract.methods
              .symbol()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }

          if (
            filteredInfo.tokenToSell.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToSell_decimals = 6;
          } else {
            tokenToSell_decimals = await tokenToSell_contract.methods
              .decimals()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }

          if (
            filteredInfo.tokenToBuy.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToBuy_decimals = 6;
          } else {
            tokenToBuy_decimals = await tokenToBuy_contract.methods
              .decimals()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }
          if (
            filteredInfo.tokenToBuy.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToBuy_symbol = "USDC";
          } else {
            tokenToBuy_symbol = await tokenToBuy_contract.methods
              .symbol()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }
          if (filteredInfo && filteredInfo.status === "0") {
            activityArray.push({
              ...filteredInfo,
              tokenToSellSymbol: tokenToSell_symbol,
              tokenToBuySymbol: tokenToBuy_symbol,
              tokenToSellDecimals: tokenToSell_decimals,
              tokenToBuyDecimals: tokenToBuy_decimals,
              chain: 1,
            });
          } else if (filteredInfo && filteredInfo.status === "1") {
            activityArray.push({
              ...filteredInfo,
              tokenToSellSymbol: tokenToSell_symbol,
              tokenToBuySymbol: tokenToBuy_symbol,
              tokenToSellDecimals: tokenToSell_decimals,
              tokenToBuyDecimals: tokenToBuy_decimals,
              chain: 1,
            });
          } else if (filteredInfo && filteredInfo.status === "2") {
            activityArray.push({
              ...filteredInfo,
              tokenToSellSymbol: tokenToSell_symbol,
              tokenToBuySymbol: tokenToBuy_symbol,
              tokenToSellDecimals: tokenToSell_decimals,
              tokenToBuyDecimals: tokenToBuy_decimals,
              chain: 1,
            });
          }
        })
      );

      // const finalPendingArray = Object.values((pendingOrdersArray))
    }

    if (orderCount_bnbOld && Number(orderCount_bnbOld) > 0) {
      const limit =
        pageslice > orderCount_bnbOld ? orderCount_bnbOld : pageslice;

      await Promise.all(
        window.range(pageslice - 20, limit - 1).map(async (i) => {
          let tokenToSell_decimals;
          let tokenToBuy_decimals;
          let tokenToSell_symbol;
          let tokenToBuy_symbol;

          const orderDetail = await otc_old_bnb_contract.methods
            .orders(i)
            .call()
            .catch((e) => {
              console.error(e);
            });

          const filteredInfo = Object.fromEntries(Object.entries(orderDetail));

          const tokenToSell_contract = new window.bscWeb3.eth.Contract(
            window.TOKEN_ABI,
            filteredInfo.tokenToSell
          );

          const tokenToBuy_contract = new window.bscWeb3.eth.Contract(
            window.TOKEN_ABI,
            filteredInfo.tokenToBuy
          );

          if (
            filteredInfo.tokenToSell.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToSell_symbol = "USDC";
          } else {
            tokenToSell_symbol = await tokenToSell_contract.methods
              .symbol()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }

          if (
            filteredInfo.tokenToSell.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToSell_decimals = 6;
          } else {
            tokenToSell_decimals = await tokenToSell_contract.methods
              .decimals()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }

          if (
            filteredInfo.tokenToBuy.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToBuy_decimals = 6;
          } else {
            tokenToBuy_decimals = await tokenToBuy_contract.methods
              .decimals()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }
          if (
            filteredInfo.tokenToBuy.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToBuy_symbol = "USDC";
          } else {
            tokenToBuy_symbol = await tokenToBuy_contract.methods
              .symbol()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }
          if (filteredInfo && filteredInfo.status === "0") {
            activityArray.push({
              ...filteredInfo,
              tokenToSellSymbol: tokenToSell_symbol,
              tokenToBuySymbol: tokenToBuy_symbol,
              tokenToSellDecimals: tokenToSell_decimals,
              tokenToBuyDecimals: tokenToBuy_decimals,
              chain: 56,
            });
          } else if (filteredInfo && filteredInfo.status === "1") {
            activityArray.push({
              ...filteredInfo,
              tokenToSellSymbol: tokenToSell_symbol,
              tokenToBuySymbol: tokenToBuy_symbol,
              tokenToSellDecimals: tokenToSell_decimals,
              tokenToBuyDecimals: tokenToBuy_decimals,
              chain: 56,
            });
          } else if (filteredInfo && filteredInfo.status === "2") {
            activityArray.push({
              ...filteredInfo,
              tokenToSellSymbol: tokenToSell_symbol,
              tokenToBuySymbol: tokenToBuy_symbol,
              tokenToSellDecimals: tokenToSell_decimals,
              tokenToBuyDecimals: tokenToBuy_decimals,
              chain: 56,
            });
          }
        })
      );
    }

    setactivityArray(activityArray.reverse());
    setLoading(false);
  };

  const getActivityOrders2 = async (pageslice) => {
    setLoading(true);
    const otc_contract = new window.infuraWeb3.eth.Contract(
      window.OTC_OLD_ABI,
      window.config.otc_address
    );

    const otc_bnb_contract = new window.bscWeb3.eth.Contract(
      window.OTC_ABI,
      window.config.otc_bnb_address
    );

    const otc_old_contract = new window.infuraWeb3.eth.Contract(
      window.OTC_OLD_ABI,
      window.config.otc_old_address
    );

    const otc_old_bnb_contract = new window.bscWeb3.eth.Contract(
      window.OTC_OLD_ABI,
      window.config.otc_old_bnb_address
    );

    const activityArray = [];

    const orderCount = await otc_contract.methods
      .orderCount()
      .call()
      .catch((e) => {
        console.error(e);
      });

    const orderCount_bnb = await otc_bnb_contract.methods
      .orderCount()
      .call()
      .catch((e) => {
        console.error(e);
      });

    const orderCountOld = await otc_old_contract.methods
      .orderCount()
      .call()
      .catch((e) => {
        console.error(e);
      });

    const orderCount_bnbOld = await otc_old_bnb_contract.methods
      .orderCount()
      .call()
      .catch((e) => {
        console.error(e);
      });

    settotalOrders(
      Number(orderCount) +
        Number(orderCount_bnb) +
        Number(orderCountOld) +
        Number(orderCount_bnbOld)
    );

    if (orderCount && Number(orderCount) > 0) {
      await Promise.all(
        window.range(0, Number(orderCount) - 1).map(async (i) => {
          let tokenToSell_decimals;
          let tokenToBuy_decimals;
          let tokenToSell_symbol;
          let tokenToBuy_symbol;

          const orderDetail = await otc_contract.methods
            .orders(i)
            .call()
            .catch((e) => {
              console.error(e);
            });

          if (orderDetail) {
            const filteredInfo = Object.fromEntries(
              Object.entries(orderDetail)
            );

            const tokenToSell_contract = new window.infuraWeb3.eth.Contract(
              window.TOKEN_ABI,
              filteredInfo.tokenToSell
            );

            const tokenToBuy_contract = new window.infuraWeb3.eth.Contract(
              window.TOKEN_ABI,
              filteredInfo.tokenToBuy
            );

            if (
              filteredInfo.tokenToSell.toLowerCase() ===
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ) {
              tokenToSell_symbol = "USDC";
            } else {
              tokenToSell_symbol = await tokenToSell_contract.methods
                .symbol()
                .call()
                .catch((e) => {
                  console.error(e);
                });
            }

            if (
              filteredInfo.tokenToSell.toLowerCase() ===
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ) {
              tokenToSell_decimals = 6;
            } else {
              tokenToSell_decimals = await tokenToSell_contract.methods
                .decimals()
                .call()
                .catch((e) => {
                  console.error(e);
                });
            }

            if (
              filteredInfo.tokenToBuy.toLowerCase() ===
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ) {
              tokenToBuy_decimals = 6;
            } else {
              tokenToBuy_decimals = await tokenToBuy_contract.methods
                .decimals()
                .call()
                .catch((e) => {
                  console.error(e);
                });
            }
            if (
              filteredInfo.tokenToBuy.toLowerCase() ===
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ) {
              tokenToBuy_symbol = "USDC";
            } else {
              tokenToBuy_symbol = await tokenToBuy_contract.methods
                .symbol()
                .call()
                .catch((e) => {
                  console.error(e);
                });
            }
            if (filteredInfo && filteredInfo.status === "0") {
              activityArray.push({
                ...filteredInfo,
                tokenToSellSymbol: tokenToSell_symbol,
                tokenToBuySymbol: tokenToBuy_symbol,
                tokenToSellDecimals: tokenToSell_decimals,
                tokenToBuyDecimals: tokenToBuy_decimals,
                chain: 1,
              });
            } else if (filteredInfo && filteredInfo.status === "1") {
              activityArray.push({
                ...filteredInfo,
                tokenToSellSymbol: tokenToSell_symbol,
                tokenToBuySymbol: tokenToBuy_symbol,
                tokenToSellDecimals: tokenToSell_decimals,
                tokenToBuyDecimals: tokenToBuy_decimals,
                chain: 1,
              });
            }
          }
        })
      );

      // const finalPendingArray = Object.values((pendingOrdersArray))
    }
    if (orderCountOld && Number(orderCountOld) > 0) {
      const limit = pageslice > orderCountOld ? orderCountOld : pageslice;

      await Promise.all(
        window.range(0, limit - 1).map(async (i) => {
          let tokenToSell_decimals;
          let tokenToBuy_decimals;
          let tokenToSell_symbol;
          let tokenToBuy_symbol;

          const orderDetail = await otc_old_contract.methods
            .orders(i)
            .call()
            .catch((e) => {
              console.error(e);
            });
          if (orderDetail) {
            const filteredInfo = Object.fromEntries(
              Object.entries(orderDetail)
            );

            const tokenToSell_contract = new window.infuraWeb3.eth.Contract(
              window.TOKEN_ABI,
              filteredInfo.tokenToSell
            );

            const tokenToBuy_contract = new window.infuraWeb3.eth.Contract(
              window.TOKEN_ABI,
              filteredInfo.tokenToBuy
            );

            if (
              filteredInfo.tokenToSell.toLowerCase() ===
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ) {
              tokenToSell_symbol = "USDC";
            } else {
              tokenToSell_symbol = await tokenToSell_contract.methods
                .symbol()
                .call()
                .catch((e) => {
                  console.error(e);
                });
            }

            if (
              filteredInfo.tokenToSell.toLowerCase() ===
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ) {
              tokenToSell_decimals = 6;
            } else {
              tokenToSell_decimals = await tokenToSell_contract.methods
                .decimals()
                .call()
                .catch((e) => {
                  console.error(e);
                });
            }

            if (
              filteredInfo.tokenToBuy.toLowerCase() ===
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ) {
              tokenToBuy_decimals = 6;
            } else {
              tokenToBuy_decimals = await tokenToBuy_contract.methods
                .decimals()
                .call()
                .catch((e) => {
                  console.error(e);
                });
            }
            if (
              filteredInfo.tokenToBuy.toLowerCase() ===
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ) {
              tokenToBuy_symbol = "USDC";
            } else {
              tokenToBuy_symbol = await tokenToBuy_contract.methods
                .symbol()
                .call()
                .catch((e) => {
                  console.error(e);
                });
            }
            if (filteredInfo && filteredInfo.status === "0") {
              activityArray.push({
                ...filteredInfo,
                tokenToSellSymbol: tokenToSell_symbol,
                tokenToBuySymbol: tokenToBuy_symbol,
                tokenToSellDecimals: tokenToSell_decimals,
                tokenToBuyDecimals: tokenToBuy_decimals,
                chain: 1,
              });
            } else if (filteredInfo && filteredInfo.status === "1") {
              activityArray.push({
                ...filteredInfo,
                tokenToSellSymbol: tokenToSell_symbol,
                tokenToBuySymbol: tokenToBuy_symbol,
                tokenToSellDecimals: tokenToSell_decimals,
                tokenToBuyDecimals: tokenToBuy_decimals,
                chain: 1,
              });
            } else if (filteredInfo && filteredInfo.status === "2") {
              activityArray.push({
                ...filteredInfo,
                tokenToSellSymbol: tokenToSell_symbol,
                tokenToBuySymbol: tokenToBuy_symbol,
                tokenToSellDecimals: tokenToSell_decimals,
                tokenToBuyDecimals: tokenToBuy_decimals,
                chain: 1,
              });
            }
          }
        })
      );

      // const finalPendingArray = Object.values((pendingOrdersArray))
    }

    if (orderCount_bnb && Number(orderCount_bnb) > 0) {
      const limit = pageslice > orderCount_bnb ? orderCount_bnb : pageslice;

      await Promise.all(
        window.range(pageslice - 20, limit - 1).map(async (i) => {
          let tokenToSell_decimals;
          let tokenToBuy_decimals;
          let tokenToSell_symbol;
          let tokenToBuy_symbol;

          const orderDetail = await otc_bnb_contract.methods
            .orders(i)
            .call()
            .catch((e) => {
              console.error(e);
            });

          const filteredInfo = Object.fromEntries(Object.entries(orderDetail));

          const tokenToSell_contract = new window.bscWeb3.eth.Contract(
            window.TOKEN_ABI,
            filteredInfo.tokenToSell
          );

          const tokenToBuy_contract = new window.bscWeb3.eth.Contract(
            window.TOKEN_ABI,
            filteredInfo.tokenToBuy
          );

          if (
            filteredInfo.tokenToSell.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToSell_symbol = "USDC";
          } else {
            tokenToSell_symbol = await tokenToSell_contract.methods
              .symbol()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }

          if (
            filteredInfo.tokenToSell.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToSell_decimals = 6;
          } else {
            tokenToSell_decimals = await tokenToSell_contract.methods
              .decimals()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }

          if (
            filteredInfo.tokenToBuy.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToBuy_decimals = 6;
          } else {
            tokenToBuy_decimals = await tokenToBuy_contract.methods
              .decimals()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }
          if (
            filteredInfo.tokenToBuy.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToBuy_symbol = "USDC";
          } else {
            tokenToBuy_symbol = await tokenToBuy_contract.methods
              .symbol()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }
          if (filteredInfo && filteredInfo.status !== "2") {
            activityArray.push({
              ...filteredInfo,
              tokenToSellSymbol: tokenToSell_symbol,
              tokenToBuySymbol: tokenToBuy_symbol,
              tokenToSellDecimals: tokenToSell_decimals,
              tokenToBuyDecimals: tokenToBuy_decimals,
              chain: 56,
            });
          }
        })
      );
    }

    if (orderCount_bnbOld && Number(orderCount_bnbOld) > 0) {
      const limit =
        pageslice > orderCount_bnbOld ? orderCount_bnbOld : pageslice;
      await Promise.all(
        window.range(pageslice - 20, limit - 1).map(async (i) => {
          let tokenToSell_decimals;
          let tokenToBuy_decimals;
          let tokenToSell_symbol;
          let tokenToBuy_symbol;

          const orderDetail = await otc_old_bnb_contract.methods
            .orders(i)
            .call()
            .catch((e) => {
              console.error(e);
            });
          if (orderDetail) {
            const filteredInfo = Object.fromEntries(
              Object.entries(orderDetail)
            );

            const tokenToSell_contract = new window.bscWeb3.eth.Contract(
              window.TOKEN_ABI,
              filteredInfo.tokenToSell
            );

            const tokenToBuy_contract = new window.bscWeb3.eth.Contract(
              window.TOKEN_ABI,
              filteredInfo.tokenToBuy
            );

            if (
              filteredInfo.tokenToSell.toLowerCase() ===
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ) {
              tokenToSell_symbol = "USDC";
            } else {
              tokenToSell_symbol = await tokenToSell_contract.methods
                .symbol()
                .call()
                .catch((e) => {
                  console.error(e);
                });
            }

            if (
              filteredInfo.tokenToSell.toLowerCase() ===
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ) {
              tokenToSell_decimals = 6;
            } else {
              tokenToSell_decimals = await tokenToSell_contract.methods
                .decimals()
                .call()
                .catch((e) => {
                  console.error(e);
                });
            }

            if (
              filteredInfo.tokenToBuy.toLowerCase() ===
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ) {
              tokenToBuy_decimals = 6;
            } else {
              tokenToBuy_decimals = await tokenToBuy_contract.methods
                .decimals()
                .call()
                .catch((e) => {
                  console.error(e);
                });
            }
            if (
              filteredInfo.tokenToBuy.toLowerCase() ===
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ) {
              tokenToBuy_symbol = "USDC";
            } else {
              tokenToBuy_symbol = await tokenToBuy_contract.methods
                .symbol()
                .call()
                .catch((e) => {
                  console.error(e);
                });
            }
            if (filteredInfo && filteredInfo.status === "0") {
              activityArray.push({
                ...filteredInfo,
                tokenToSellSymbol: tokenToSell_symbol,
                tokenToBuySymbol: tokenToBuy_symbol,
                tokenToSellDecimals: tokenToSell_decimals,
                tokenToBuyDecimals: tokenToBuy_decimals,
                chain: 56,
              });
            } else if (filteredInfo && filteredInfo.status === "1") {
              activityArray.push({
                ...filteredInfo,
                tokenToSellSymbol: tokenToSell_symbol,
                tokenToBuySymbol: tokenToBuy_symbol,
                tokenToSellDecimals: tokenToSell_decimals,
                tokenToBuyDecimals: tokenToBuy_decimals,
                chain: 56,
              });
            } else if (filteredInfo && filteredInfo.status === "2") {
              activityArray.push({
                ...filteredInfo,
                tokenToSellSymbol: tokenToSell_symbol,
                tokenToBuySymbol: tokenToBuy_symbol,
                tokenToSellDecimals: tokenToSell_decimals,
                tokenToBuyDecimals: tokenToBuy_decimals,
                chain: 56,
              });
            }
          }
        })
      );
    }

    setactivityArray2(activityArray.reverse());
    setLoading(false);
  };

  const checkNetworkId = async () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "net_version" })
        .then((data) => {
          setChainId(parseInt(data));
        })
        .catch(console.error);
      getAllOpenOrders(20);
    } else {
      setChainId(1);
    }
  };

  const checkConnection = async () => {
    await window.getCoinbase().then((data) => {
      if (data) {
        setCoinbase(data);
        setIsConnected(true);
        localStorage.setItem("logout", "false");
      } else {
        setCoinbase();
        setIsConnected(false);
      }
    });
  };

  const getUserOrders = async (address) => {
    let userOpenOrdersArray = [];
    let userCompletedOrdersArray = [];
    let userActivityArray = [];
    let openArray = [];
    let completedArray = [];

    const netID = await window.ethereum
      .request({ method: "net_version" })
      .then((data) => {
        return parseInt(data);
      })
      .catch(console.error);

    const otc_bnb_contract = new window.bscWeb3.eth.Contract(
      window.OTC_ABI,
      window.config.otc_bnb_address
    );

    const otc_contract = new window.infuraWeb3.eth.Contract(
      window.OTC_OLD_ABI,
      window.config.otc_address
    );

    const allOpenUserOrders = await otc_bnb_contract.methods
      .getUserOrdersByStatus(address, "0")
      .call()
      .catch((e) => {
        console.error(e);
      });

    const allCompletedUserOrders = await otc_bnb_contract.methods
      .getUserOrdersByStatus(address, "1")
      .call()
      .catch((e) => {
        console.error(e);
      });

    const allActivityUserOrders = await otc_bnb_contract.methods
      .getUserOrdersByStatus(address, "2")
      .call()
      .catch((e) => {
        console.error(e);
      });
    setUserLoading(true);

    const orderCount = await otc_contract.methods
      .orderCount()
      .call()
      .catch((e) => {
        console.error(e);
      });

    if (orderCount && Number(orderCount) > 0) {
      await Promise.all(
        window.range(0, Number(orderCount) - 1).map(async (i) => {
          let tokenToSell_decimals;
          let tokenToBuy_decimals;
          let tokenToSell_symbol;
          let tokenToBuy_symbol;

          const orderDetail = await otc_contract.methods
            .orders(i)
            .call()
            .catch((e) => {
              console.error(e);
            });

          if (orderDetail) {
            const filteredInfo = Object.fromEntries(
              Object.entries(orderDetail)
            );

            const tokenToSell_contract = new window.infuraWeb3.eth.Contract(
              window.TOKEN_ABI,
              filteredInfo.tokenToSell
            );

            const tokenToBuy_contract = new window.infuraWeb3.eth.Contract(
              window.TOKEN_ABI,
              filteredInfo.tokenToBuy
            );

            if (
              filteredInfo.tokenToSell.toLowerCase() ===
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ) {
              tokenToSell_symbol = "USDC";
            } else {
              tokenToSell_symbol = await tokenToSell_contract.methods
                .symbol()
                .call()
                .catch((e) => {
                  console.error(e);
                });
            }

            if (
              filteredInfo.tokenToSell.toLowerCase() ===
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ) {
              tokenToSell_decimals = 6;
            } else {
              tokenToSell_decimals = await tokenToSell_contract.methods
                .decimals()
                .call()
                .catch((e) => {
                  console.error(e);
                });
            }

            if (
              filteredInfo.tokenToBuy.toLowerCase() ===
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ) {
              tokenToBuy_decimals = 6;
            } else {
              tokenToBuy_decimals = await tokenToBuy_contract.methods
                .decimals()
                .call()
                .catch((e) => {
                  console.error(e);
                });
            }
            if (
              filteredInfo.tokenToBuy.toLowerCase() ===
              "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ) {
              tokenToBuy_symbol = "USDC";
            } else {
              tokenToBuy_symbol = await tokenToBuy_contract.methods
                .symbol()
                .call()
                .catch((e) => {
                  console.error(e);
                });
            }
            if (
              filteredInfo &&
              filteredInfo.status === "0" &&
              filteredInfo.seller?.toLowerCase() === coinbase?.toLowerCase()
            ) {
              openArray.push({
                ...filteredInfo,
                tokenToSellSymbol: tokenToSell_symbol,
                tokenToBuySymbol: tokenToBuy_symbol,
                tokenToSellDecimals: tokenToSell_decimals,
                tokenToBuyDecimals: tokenToBuy_decimals,
                chain: 1,
              });
            } else if (
              filteredInfo &&
              filteredInfo.status === "2" &&
              filteredInfo.seller?.toLowerCase() === coinbase?.toLowerCase()
            ) {
              completedArray.push({
                ...filteredInfo,
                tokenToSellSymbol: tokenToSell_symbol,
                tokenToBuySymbol: tokenToBuy_symbol,
                tokenToSellDecimals: tokenToSell_decimals,
                tokenToBuyDecimals: tokenToBuy_decimals,
                chain: 1,
              });
            } else if (
              filteredInfo &&
              filteredInfo.status === "1" &&
              filteredInfo.seller?.toLowerCase() === coinbase?.toLowerCase()
            ) {
              completedArray.push({
                ...filteredInfo,
                tokenToSellSymbol: tokenToSell_symbol,
                tokenToBuySymbol: tokenToBuy_symbol,
                tokenToSellDecimals: tokenToSell_decimals,
                tokenToBuyDecimals: tokenToBuy_decimals,
                chain: 1,
              });
            }
          }
        })
      );

      // const finalPendingArray = Object.values((pendingOrdersArray))
    }

    if (allOpenUserOrders && allOpenUserOrders.length > 0) {
      await Promise.all(
        window.range(0, allOpenUserOrders.length - 1).map(async (i) => {
          let tokenToSell_decimals;
          let tokenToBuy_decimals;
          let tokenToSell_symbol;
          let tokenToBuy_symbol;

          const orderDetail = await otc_bnb_contract.methods
            .orders(allOpenUserOrders[i])
            .call()
            .catch((e) => {
              console.error(e);
            });

          const filteredInfo = Object.fromEntries(Object.entries(orderDetail));

          const tokenToSell_contract = new window.bscWeb3.eth.Contract(
            window.TOKEN_ABI,
            filteredInfo.tokenToSell
          );

          const tokenToBuy_contract = new window.bscWeb3.eth.Contract(
            window.TOKEN_ABI,
            filteredInfo.tokenToBuy
          );

          if (
            filteredInfo.tokenToSell.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToSell_symbol = "USDC";
          } else {
            tokenToSell_symbol = await tokenToSell_contract.methods
              .symbol()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }

          if (
            filteredInfo.tokenToSell.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToSell_decimals = 6;
          } else {
            tokenToSell_decimals = await tokenToSell_contract.methods
              .decimals()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }

          if (
            filteredInfo.tokenToBuy.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToBuy_decimals = 6;
          } else {
            tokenToBuy_decimals = await tokenToBuy_contract.methods
              .decimals()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }
          if (
            filteredInfo.tokenToBuy.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToBuy_symbol = "USDC";
          } else {
            tokenToBuy_symbol = await tokenToBuy_contract.methods
              .symbol()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }
          if (filteredInfo) {
            userOpenOrdersArray.push({
              ...filteredInfo,
              tokenToSellSymbol: tokenToSell_symbol,
              tokenToBuySymbol: tokenToBuy_symbol,
              tokenToSellDecimals: tokenToSell_decimals,
              tokenToBuyDecimals: tokenToBuy_decimals,
              chain: 56,
            });
          }
        })
      );
    }

    if (allCompletedUserOrders && allCompletedUserOrders.length > 0) {
      await Promise.all(
        window.range(0, allCompletedUserOrders.length - 1).map(async (i) => {
          let tokenToSell_decimals;
          let tokenToBuy_decimals;
          let tokenToSell_symbol;
          let tokenToBuy_symbol;

          const orderDetail = await otc_bnb_contract.methods
            .orders(allCompletedUserOrders[i])
            .call()
            .catch((e) => {
              console.error(e);
            });

          const filteredInfo = Object.fromEntries(Object.entries(orderDetail));

          const tokenToSell_contract = new window.bscWeb3.eth.Contract(
            window.TOKEN_ABI,
            filteredInfo.tokenToSell
          );

          const tokenToBuy_contract = new window.bscWeb3.eth.Contract(
            window.TOKEN_ABI,
            filteredInfo.tokenToBuy
          );

          if (
            filteredInfo.tokenToSell.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToSell_symbol = "USDC";
          } else {
            tokenToSell_symbol = await tokenToSell_contract.methods
              .symbol()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }

          if (
            filteredInfo.tokenToSell.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToSell_decimals = 6;
          } else {
            tokenToSell_decimals = await tokenToSell_contract.methods
              .decimals()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }

          if (
            filteredInfo.tokenToBuy.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToBuy_decimals = 6;
          } else {
            tokenToBuy_decimals = await tokenToBuy_contract.methods
              .decimals()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }
          if (
            filteredInfo.tokenToBuy.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToBuy_symbol = "USDC";
          } else {
            tokenToBuy_symbol = await tokenToBuy_contract.methods
              .symbol()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }
          if (filteredInfo) {
            userCompletedOrdersArray.push({
              ...filteredInfo,
              tokenToSellSymbol: tokenToSell_symbol,
              tokenToBuySymbol: tokenToBuy_symbol,
              tokenToSellDecimals: tokenToSell_decimals,
              tokenToBuyDecimals: tokenToBuy_decimals,
              chain: 56,
            });
          }
        })
      );
    }
    if (allActivityUserOrders && allActivityUserOrders.length > 0) {
      await Promise.all(
        window.range(0, allActivityUserOrders.length - 1).map(async (i) => {
          let tokenToSell_decimals;
          let tokenToBuy_decimals;
          let tokenToSell_symbol;
          let tokenToBuy_symbol;

          const orderDetail = await otc_bnb_contract.methods
            .orders(allActivityUserOrders[i])
            .call()
            .catch((e) => {
              console.error(e);
            });

          const filteredInfo = Object.fromEntries(Object.entries(orderDetail));

          const tokenToSell_contract = new window.bscWeb3.eth.Contract(
            window.TOKEN_ABI,
            filteredInfo.tokenToSell
          );

          const tokenToBuy_contract = new window.bscWeb3.eth.Contract(
            window.TOKEN_ABI,
            filteredInfo.tokenToBuy
          );

          if (
            filteredInfo.tokenToSell.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToSell_symbol = "USDC";
          } else {
            tokenToSell_symbol = await tokenToSell_contract.methods
              .symbol()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }

          if (
            filteredInfo.tokenToSell.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToSell_decimals = 6;
          } else {
            tokenToSell_decimals = await tokenToSell_contract.methods
              .decimals()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }

          if (
            filteredInfo.tokenToBuy.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToBuy_decimals = 6;
          } else {
            tokenToBuy_decimals = await tokenToBuy_contract.methods
              .decimals()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }
          if (
            filteredInfo.tokenToBuy.toLowerCase() ===
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          ) {
            tokenToBuy_symbol = "USDC";
          } else {
            tokenToBuy_symbol = await tokenToBuy_contract.methods
              .symbol()
              .call()
              .catch((e) => {
                console.error(e);
              });
          }
          if (filteredInfo) {
            userActivityArray.push({
              ...filteredInfo,
              tokenToSellSymbol: tokenToSell_symbol,
              tokenToBuySymbol: tokenToBuy_symbol,
              tokenToSellDecimals: tokenToSell_decimals,
              tokenToBuyDecimals: tokenToBuy_decimals,
              chain: 56,
            });
          }
        })
      );
    }

    let userActivityArray2 = [
      ...userOpenOrdersArray,
      ...userCompletedOrdersArray,
    ];
    let finalUserActivityArray = [
      ...userActivityArray,
      ...completedArray,
      ...userActivityArray2,
    ];

    let finalUserOpenArray = [...userOpenOrdersArray, ...openArray];
    let finalUserCompletedArray = [
      ...userCompletedOrdersArray,
      ...completedArray,
    ];

    if (netID === 1) {
      setUseropenOrdersArray(openArray.reverse());
    } else {
      setUseropenOrdersArray(userOpenOrdersArray.reverse());
    }

    setUseractivityArray(finalUserActivityArray);
    setUserLoading(false);
    setUsercompletedOrdersArray(finalUserCompletedArray);
  };

  useEffect(() => {
    if (isConnected && coinbase) {
      getUserOrders(coinbase);
    }
  }, [coinbase, isConnected, usercount, chainId]);

  useEffect(() => {
    if (window.ethereum && window.ethereum.isConnected() === true) {
      if (logout === "false") {
        checkConnection();
      } else {
        setIsConnected(false);
        setCoinbase();
      }
    } else {
      setIsConnected(false);
      setCoinbase();
      // localStorage.setItem("logout", "true");
    }
    checkNetworkId();
  }, [window.ethereum, coinbase, logout]);

  useEffect(() => {
    if (dataFetchedRef2.current) return;
    dataFetchedRef2.current = true;
    // getActivityOrders(20);
  }, []);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getActivityOrders2(20);
  }, []);

  const { ethereum } = window;

  ethereum?.on("chainChanged", checkNetworkId);
  ethereum?.on("accountsChanged", checkConnection);

  return (
    <div className="container-fluid d-flex flex-column px-0 align-items-center whole-wrapper">
      <Header
        isConnected={isConnected}
        coinbase={coinbase}
        onConnect={() => {
          setWalletModal(true);
        }}
        chainId={chainId}
        onSwitchNetwork={(value) => {
          handleSwitchNetworkhook(value);
        }}
        manageDisconnect={handleDisconnect}
      />
      <MobileHeader
        isConnected={isConnected}
        coinbase={coinbase}
        onConnect={() => {
          setWalletModal(true);
        }}
        chainId={chainId}
        onSwitchNetwork={(value) => {
          handleSwitchNetworkhook(value);
        }}
      />
      <div className="container-fluid d-flex allroutes-wrapper flex-column gap-2 align-items-center px-lg-0">
        <Routes>
          <Route
            exact
            path="/"
            element={
              <Homepage
                isConnected={isConnected}
                coinbase={coinbase}
                onConnect={() => {
                  setWalletModal(true);
                }}
                chainId={chainId}
                activityArray={activityArray2}
                onCreateOrderSuccess={() => {
                  setcount(count + 1);
                }}
                loading={loading}
                handleCollectedPage2={handleCollectedPage2}
                totalOrders2={totalOrders}
                collectedPage2={collectedPage2}
              />
            }
          />
          <Route
            exact
            path="/sell"
            element={
              <Selling
                isConnected={isConnected}
                coinbase={coinbase}
                onConnect={() => {
                  setWalletModal(true);
                }}
                chainId={chainId}
                openOrdersArray={openOrdersArray}
                activityArray={activityArray}
                onCreateOrderSuccess={() => {
                  setcount(count + 1);
                }}
                onSwitchNetwork={(value) => {
                  handleSwitchNetworkhook(value);
                }}
              />
            }
          />

          <Route
            exact
            path="/buy"
            element={
              <Buying
                isConnected={isConnected}
                coinbase={coinbase}
                onConnect={() => {
                  setWalletModal(true);
                }}
                chainId={chainId}
                openOrdersArray={openOrdersArray}
                completedOrdersArray={completedOrdersArray}
                activityArray={activityArray}
                onCreateOrderSuccess={() => {
                  setcount(count + 1);
                }}
                onSwitchNetwork={(value) => {
                  handleSwitchNetworkhook(value);
                }}
              />
            }
          />

          <Route
            exact
            path="/open-positions"
            element={
              <Listing
                isConnected={isConnected}
                coinbase={coinbase}
                onConnect={() => {
                  setWalletModal(true);
                }}
                chainId={chainId}
                openOrdersArray={openOrdersArray}
                completedOrdersArray={completedOrdersArray}
                activityArray={activityArray}
                onAcceptOrderComplete={() => {
                  setcount(count + 1);
                }}
                onSwitchNetwork={(value) => {
                  handleSwitchNetworkhook(value);
                }}
                loading={loading}
                totalOrders={totalOrders}
                handleCollectedPage={handleCollectedPage}
                handleOpenPage={handleOpenPage}
                handleCompletedPage={handleCompletedPage}
                collectedPage={collectedPage}
                openPage={openPage}
                completedPage={completedPage}
                onActivityClick={getActivityOrders}
                onCompletedClick={getAllCompletedOrders}
                onOpenClick={getAllOpenOrders}
              />
            }
          />

          <Route
            exact
            path="/account"
            element={
              <Account
                isConnected={isConnected}
                coinbase={coinbase}
                onConnect={() => {
                  setWalletModal(true);
                }}
                chainId={chainId}
                openOrdersArray={useropenOrdersArray}
                completedOrdersArray={usercompletedOrdersArray}
                activityArray={useractivityArray}
                onAcceptUserOrderComplete={() => {
                  setUsercount(usercount + 1);
                }}
                onSwitchNetwork={(value) => {
                  handleSwitchNetworkhook(value);
                }}
                loading={userloading}
                onActivityClick={getActivityOrders}
                onCompletedClick={getAllCompletedOrders}
                onOpenClick={getAllOpenOrders}
              />
            }
          />

          <Route
            exact
            path="/activity"
            element={
              <Listing
                isConnected={isConnected}
                coinbase={coinbase}
                onConnect={() => {
                  setWalletModal(true);
                }}
                chainId={chainId}
                openOrdersArray={openOrdersArray}
                completedOrdersArray={completedOrdersArray}
                activityArray={activityArray}
                onAcceptOrderComplete={() => {
                  setcount(count + 1);
                }}
                onSwitchNetwork={(value) => {
                  handleSwitchNetworkhook(value);
                }}
                loading={loading}
                totalOrders={totalOrders}
                handleCollectedPage={handleCollectedPage}
                handleOpenPage={handleOpenPage}
                handleCompletedPage={handleCompletedPage}
                collectedPage={collectedPage}
                openPage={openPage}
                completedPage={completedPage}
                onActivityClick={getActivityOrders}
                onCompletedClick={getAllCompletedOrders}
                onOpenClick={getAllOpenOrders}
              />
            }
          />
        </Routes>
        {walletModal === true && (
          <WalletModal
            show={walletModal}
            handleClose={() => {
              setWalletModal(false);
            }}
            handleConnection={() => {
              handleConnect();
            }}
          />
        )}
      </div>
      <Footer orders={totalOrders} />
    </div>
  );
}

export default App;
