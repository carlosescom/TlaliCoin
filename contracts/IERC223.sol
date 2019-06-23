pragma solidity 0.5.8;

 /**
 * @title interfaz ERC223 estríctamente para Solidity 0.5.8
 * @dev Carlos Noverón
 */

contract IERC223 {
  uint public totalSupply;

  function balanceOf(address who) public returns (uint);
  function transfer(address to, uint value) public;
  function transfer(address to, uint value, bytes memory data) public;

  event Transfer(address indexed from, address indexed to, uint value, bytes data);
}