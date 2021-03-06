import React, { useState } from "react";
import BuyForm from "./BuyForm";
import SellForm from "./SellForm";

const Main = ({
  walletBalance,
  ioTokenWalletBalance,
  buyTokens,
  sellTokens,
}) => {
  const [currentForm, setCurrentForm] = useState("buy");

  let content = "";
  const renderMain = () => {
    if (currentForm === "buy") {
      content = (
        <BuyForm
          walletBalance={walletBalance}
          ioTokenWalletBalance={ioTokenWalletBalance}
          buyTokens={buyTokens}
        />
      );
    } else {
      content = (
        <SellForm
          walletBalance={walletBalance}
          ioTokenWalletBalance={ioTokenWalletBalance}
          sellTokens={sellTokens}
        />
      );
    }
  };
  renderMain();

  return (
    <div id="content" className="mt-3">
      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-light"
          onClick={(event) => {
            setCurrentForm("buy");
          }}
        >
          Buy
        </button>
        <span className="text-muted">&lt; &nbsp; &gt;</span>
        <button
          className="btn btn-light"
          onClick={(event) => {
            setCurrentForm("sell");
          }}
        >
          Sell
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-body">{content}</div>
      </div>
    </div>
  );
};

export default Main;
