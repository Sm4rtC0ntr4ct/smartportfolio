import React, { useState, useEffect } from "react";
import Web3 from "web3";

import Token from "../abis/IOToken.json";
import EthSwap from "../abis/EthSwap.json";

import Navbar from "./Navbar";
import Main from "./Main";
import "../styles/App.css";

const UserForm = ({ isLogged, currentWalletAddress, currentChainId }) => {
  const [walletBalance, setWalletBalance] = useState(-1);
  const [ioToken, setIoToken] = useState(null);
  const [ioTokenAddress, setIoTokenAddress] = useState("0x");
  const [ioTokenWalletBalance, setIoTokenWalletBalance] = useState(-1);
  const [ethSwap, setEthSwap] = useState(null);
  const [ethSwapAddress, setEthSwapAddress] = useState("0x");
  const [ethSwapBalance, setEthSwapBalance] = useState(-1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isDisplayed = true;

    const loadWalletData = async () => {
      if (typeof window.ethereum === "object") {
        // Instance web3 with the provided information
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          // Request current account balance
          let currAccountBal = await web3.eth.getBalance(currentWalletAddress);
          // if (isDisplayed)
          setWalletBalance(web3.utils.fromWei(currAccountBal, "ether"));
        } catch (e) {
          // User denied access
          console.info(e);
        }
      }
    };
    loadWalletData();

    return () => {
      isDisplayed = false;
    };
  }, [currentWalletAddress, walletBalance, currentChainId]);

  useEffect(() => {
    let isDisplayed = true;

    const loadIoTokenData = async () => {
      if (typeof window.ethereum === "object") {
        // Instance web3 with the provided information
        const web3 = new Web3(window.ethereum);
        try {
          const tokenInstance = Token.networks[currentChainId];
          if (tokenInstance) {
            setIoTokenAddress(
              web3.utils.toChecksumAddress(tokenInstance.address)
            );
            const _ioToken = new web3.eth.Contract(
              Token.abi,
              ioTokenAddress.toString().toLowerCase()
            );
            setIoToken(_ioToken);

            ioToken.methods
              .balanceOf(currentWalletAddress)
              .call()
              .then((_tokenBalance) => {
                ioToken.methods
                  .decimals()
                  .call()
                  .then((_dec) => {
                    _tokenBalance = _tokenBalance / Math.pow(10, _dec);
                    setIoTokenWalletBalance(_tokenBalance);
                  });
              });
          } else {
            if (isLogged)
              window.alert("Token contract not deployed to detected network.");
          }
        } catch (e) {
          // User denied access
          console.info(e);
        }
      }
    };
    loadIoTokenData();

    return () => {
      isDisplayed = false;
    };
  }, [currentWalletAddress, currentChainId, ioTokenAddress]);

  useEffect(() => {
    let isDisplayed = true;

    const loadEthSwapData = async () => {
      if (typeof window.ethereum === "object") {
        // Instance web3 with the provided information
        const web3 = new Web3(window.ethereum);
        try {
          const ethSwapInstance = EthSwap.networks[currentChainId];
          if (ethSwapInstance) {
            setEthSwapAddress(
              web3.utils.toChecksumAddress(ethSwapInstance.address)
            );
            const _ethSwap = new web3.eth.Contract(
              EthSwap.abi,
              ethSwapInstance.address
            );
            setEthSwap(_ethSwap);

            ioToken.methods
              .balanceOf(ethSwapAddress)
              .call()
              .then((_ethSwapBalance) => {
                setEthSwapBalance(_ethSwapBalance);
              });
          } else {
            if (isLogged)
              window.alert(
                "EthSwap contract not deployed to detected network."
              );
          }

          setLoading(false);
        } catch (e) {
          // User denied access
          console.info(e);
        }
      }
    };
    loadEthSwapData();

    return () => {
      isDisplayed = false;
    };
  }, [currentWalletAddress, currentChainId, ethSwapAddress, ethSwapBalance]);

  const buyTokens = (etherAmount) => {
    setLoading(true);
    ethSwap.methods
      .buyTokens()
      .send({ value: etherAmount, from: currentWalletAddress })
      .on("transactionHash", (hash) => {
        setLoading(false);
      });
  };

  const sellTokens = (tokenAmount) => {
    setLoading(true);
    ioToken.methods
      .approve(ethSwapAddress, tokenAmount)
      .send({ from: currentWalletAddress })
      .on("transactionHash", (hash) => {
        ethSwap.methods
          .sellTokens(tokenAmount)
          .send({ from: currentWalletAddress })
          .on("transactionHash", (hash) => {
            setLoading(false);
          });
      });
  };

  let content = "";
  const renderMain = () => {
    if (loading) {
      content = (
        <p id="loader" className="text-center">
          Loading...
        </p>
      );
    } else {
      content = (
        <Main
          walletBalance={walletBalance}
          ioTokenWalletBalance={ioTokenWalletBalance}
          buyTokens={buyTokens}
          sellTokens={sellTokens}
        />
      );
    }
  };
  renderMain();

  return (
    <div>
      <div>
        Réseau : {currentChainId}
        <br />
        Connecté ? : {isLogged ? "true" : "false"}
        <br />
        Compte : {currentWalletAddress}
        <br />
        Solde du compte :{" "}
        {walletBalance >= 0 ? walletBalance + " ETH" : "Solde nul."}
        <br />
        -----------------------------------------------
        <br />
        ioToken (adresse) :{ioTokenAddress}
        <br />
        Solde ioToken :{" "}
        {ioTokenWalletBalance >= 0
          ? ioTokenWalletBalance + " PFIO"
          : "Solde nul."}
        <br />
        -----------------------------------------------
        <br />
        ethSwap (adresse) : {ethSwapAddress}
        <br />
        Solde ethSwap :{" "}
        {ethSwapBalance >= 0 ? ethSwapBalance + " PFIO" : "Solde nul."}
        <br />
        -----------------------------------------------
        <br />
        Loading : {loading ? "true" : "false"}
      </div>
      <div>
        <Navbar account={currentWalletAddress} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main
              role="main"
              className="col-lg-12 ml-auto mr-auto"
              style={{ maxWidth: "600px" }}
            >
              <div className="content mr-auto ml-auto">
                <a
                  href="https://dapp.oeptime.com"
                  target="_blank"
                  rel="noopener noreferrer"
                ></a>
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
