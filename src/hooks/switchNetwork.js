export const handleSwitchNetworkhook = async (chainID) => {
  const { ethereum } = window;
  let error;

  const ETHPARAMS = {
    chainId: "0x1", // A 0x-prefixed hexadecimal string
    chainName: "Ethereum Mainnet",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH", // 2-6 characters long
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.infura.io/v3/"],
    blockExplorerUrls: ["https://etherscan.io"],
  };

  const BNBPARAMS = {
    chainId: "0x38", // A 0x-prefixed hexadecimal string
    chainName: "Smart Chain",
    nativeCurrency: {
      name: "Smart Chain",
      symbol: "BNB", // 2-6 characters long
      decimals: 18,
    },
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    blockExplorerUrls: ["https://bscscan.com"],
  };

  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainID }],
    });
    if (window.ethereum && window.ethereum.isTrust === true) {
      window.location.reload();
    }
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    console.log(switchError, "switch");
    if (
      switchError.code === 4902 ||
      (switchError.code === 4902 &&
        switchError.message.includes("Unrecognized chainID"))
    ) {
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params:
            chainID === "0x1"
              ? [ETHPARAMS]
              : chainID === "0x38"
              ? [BNBPARAMS]
              : "",
        });
        if (window.ethereum && window.ethereum.isTrust === true) {
          window.location.reload();
        }
      } catch (addError) {
        console.log(addError);
      }
    }
    // handle other "switch" errors
  }
};
