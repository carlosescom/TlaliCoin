pragma solidity 0.5.8;

 /**
 * @title interfaz ERC223 para que los contratos puedan dar soporte a tokens perdidos.
 */

interface IERC223_Receiver {
/**
 * @dev Función estándar que manejará transacciones entrantes
 *
 * @param _from  Token sender address.
 * @param _value Amount of tokens.
 * @param _data  Transaction metadata.
 */
    function tokenFallback(address _from, uint _value, bytes calldata _data) external;
}