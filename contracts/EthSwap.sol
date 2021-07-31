// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./IOToken.sol";

contract EthSwap {
  string public name = "Smart PortFolio Instant Exchange";
  IOToken public token;
  uint public rate = 100;
  
  event TokensPurchased(
    address account, // user
    address token,
    uint amount,
    uint rate
  );

  event TokensSold(
    address account,
    address token,
    uint amount,
    uint rate
  );

  constructor(IOToken _token) {
    token = _token;
  }

  function buyTokens() public payable {
    // Calculate the number of tokens to buy
    uint tokenAmount = msg.value * rate;

    // Require that EthSwap has enough tokens
    require(token.balanceOf(address(this)) >= tokenAmount);

    // Transfer tokens to the user
    token.transfer(payable(msg.sender), tokenAmount);

    // Emit an event
    emit TokensPurchased(payable(msg.sender), address(token), tokenAmount, rate);
  }

  function sellTokens(uint _amount) public {
    // User can't sell more tokens than they have
    require(token.balanceOf(payable(msg.sender)) >= _amount);

    // Calculate the amount of Ether to redeem
    uint etherAmount = _amount / rate;

    // Require that EthSwap has enough Ether
    require(address(this).balance >= etherAmount);

    // Perform sale
    token.transferFrom(payable(msg.sender), address(this), _amount);
    payable(msg.sender).transfer(etherAmount);

    // Emit an event
    emit TokensSold(payable(msg.sender), address(token), _amount, rate);
  }

}
