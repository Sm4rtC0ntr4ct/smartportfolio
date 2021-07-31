import React, { useState, useEffect } from "react";
import Web3 from "web3";

import tokenLogo from "../img/token-logo.png";
import ethLogo from "../img/eth-logo.png";

const SellForm = ({ walletBalance, ioTokenWalletBalance, sellTokens }) => {
  const [amountInput, setAmountInput] = useState("0");
  const [amountOutput, setAmountOutput] = useState("0");

  const web3 = new Web3(window.ethereum);

  useEffect(() => {
    let _input = amountInput;
    _input = _input.replace(",", ".");
    _input = parseFloat(_input);
    setAmountInput(_input.toString());
    const _output = (parseFloat(amountInput) / 100).toString();
    setAmountOutput(_output);
  }, [amountInput, amountOutput]);

  const handleSubmit = (event) => {
    event.preventDefault();
    let etherAmount;
    etherAmount = web3.utils.toWei(amountInput.toString(), "Ether");
    sellTokens(etherAmount);
  };

  return (
    <form className="mb-3" onSubmit={handleSubmit}>
      <div>
        <label className="float-left">
          <b>Input</b>
        </label>
        <span className="float-right text-muted">
          Balance: {ioTokenWalletBalance}
        </span>
      </div>
      <div className="input-group mb-4">
        <input
          type="text"
          onChange={(event) => {
            let _input = event.target.value.toString();
            if (_input !== "" && parseFloat(_input) > 0) {
              setAmountInput(_input);
            } else {
              setAmountInput("0");
            }
          }}
          value={amountInput}
          className="form-control form-control-lg"
          placeholder="0"
          required
        />
        <div className="input-group-append">
          <div className="input-group-text">
            <img src={tokenLogo} height="32" alt="" />
            &nbsp; IO-Token
          </div>
        </div>
      </div>
      <div>
        <label className="float-left">
          <b>Output</b>
        </label>
        <span className="float-right text-muted">
          Balance: {walletBalance.toString()}
        </span>
      </div>
      <div className="input-group mb-2">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="0"
          value={amountOutput}
          disabled
        />
        <div className="input-group-append">
          <div className="input-group-text">
            <img src={ethLogo} height="32" alt="" />
            &nbsp;&nbsp;&nbsp; ETH
          </div>
        </div>
      </div>
      <div className="mb-5">
        <span className="float-left text-muted">Exchange Rate</span>
        <span className="float-right text-muted">100 DApp = 1 ETH</span>
      </div>
      <button type="submit" className="btn btn-primary btn-block btn-lg">
        SWAP!
      </button>
    </form>
  );
};

export default SellForm;
