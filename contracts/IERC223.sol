pragma solidity 0.5.8;

/**
 * @title interfaz ERC223 estríctamente para Solidity 0.5.8
 * @dev Carlos Noverón
 */

interface IERC223 {
  function balanceOf(address who) external view returns (uint);
  function transfer(address to, uint value) external returns (bool);
  function transfer(address to, uint value, bytes calldata data) external returns (bool);

  event Transfer(
    address indexed from,
    address indexed to,
    uint value,
    bytes data
  );
}
