import React from "react";
import Identicon from "identicon.js";

const Navbar = ({ currentAccount }) => {
  return (
    <nav
      className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow"
      style={{ zIndex: -1 }}
    >
      <a
        className="navbar-brand col-sm-3 col-md-2 mr-0"
        href="https://#"
        target="_blank"
        rel="noopener noreferrer"
      >
        Smart PortFolio
      </a>

      <ul className="navbar-nav px-3">
        <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
          <small className="text-secondary">
            <small id="account">{currentAccount}</small>
          </small>

          {currentAccount ? (
            <img
              className="ml-2"
              width="30"
              height="30"
              src={`data:image/png;base64,${new Identicon(
                currentAccount,
                30
              ).toString()}`}
              alt=""
            />
          ) : (
            <span></span>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
