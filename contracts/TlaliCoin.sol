pragma solidity 0.5.8;

/**
 * @title TlaliCoin es un token que incentiva el reciclaje
 * @dev Carlos Noverón https://github.com/carlosescom/TlaliCoin
 */

import "./ERC20.sol";
import "./IERC223.sol";
import "./IERC223_Receiver.sol";
import "./SafeMath.sol";

contract TlaliCoin is IERC223, ERC20 {
  string public name = "TlaliCoin";
  string public symbol = "TLALI";
  uint8 public decimals = 0;

  constructor() public {
    balances[msg.sender] = totalSupply;
  }

  /**
    * @dev Devuleve el balance de la cuenta designada en el parámetro `_owner`.
    *
    * @param _owner   La dirección cuyo balance se está consultando.
    * @return balance Balance del propietario de los fondos (_owner).
    */
  function balanceOf(address _owner) public view returns (uint balance) {
    return balances[_owner];
  }

  /**
    * @dev Transfiere la cantidad especificada de tokens a la dirección especificada.
    * Invoca la función `tokenFallback` si el destinatario es un contrato.
    * La transferencia de tokens falla si el receptor es un contrato pero no
    * implementa la función `tokenFallback` o la función de respaldo para recibir fondos.
    *
    * @param _to Dirección del receptor.
    * @param _value Cantidad de tokens a transferir.
    * @param _data Metadatos de la transacción.
    */
  function transfer(address _to, uint _value, bytes memory _data) public returns (bool) {
    // La función transfer es similar a la transfer de un ERC20 sin _data.
    // Añadido debido a razones de compatibilidad hacia atrás.
    uint codeLength;
    assembly {
      // Devuelve el tamaño del código en la dirección de destino, ésto necesita ensamblador.
      codeLength := extcodesize(_to)
    }
    _transfer(msg.sender, _to, _value);
    if (codeLength > 0) {
      IERC223_Receiver receiver = IERC223_Receiver(_to);
      receiver.tokenFallback(msg.sender, _value, _data);
    }
    emit Transfer(msg.sender, _to, _value, _data);
  }

  /**
    * @dev Transfiere una cantidad de tokens a la dirección especificada.
    * Esta función funciona de la misma manera que la anterior pero no contiene
    * el parámetro `_data`. Añadido debido a razones de compatibilidad.
    *
    * @param _to Dirección del receptor.
    * @param _value Cantidad de tokens a transferir.
    */
  function transfer(address _to, uint _value) public returns (bool) {
    uint codeLength;
    bytes memory empty;
    assembly {
      // Devuelve el tamaño del código en la dirección de destino, ésto necesita ensamblador.
      codeLength := extcodesize(_to)
    }
    _transfer(msg.sender, _to, _value);
    if (codeLength > 0) {
      IERC223_Receiver receiver = IERC223_Receiver(_to);
      receiver.tokenFallback(msg.sender, _value, empty);
    }
    emit Transfer(msg.sender, _to, _value, empty);
  }

  /**
    * @dev Transfiere una cantidad de tokens de una dirección a otra.
    * Para poder ejecutar esta función se requiere primero que el dueño de los fondos
    * apruebe primero que otra dirección gaste tokens de su cuenta. Para lo cual
    * es necesario ejecutar primero la función `Approve` con la cantidad máxima de tokens
    * que el dueño de los fondos está dispuesto a que otro gaste de su cuenta.
    * @param from Dirección del dueño de los fondos.
    * @param to Dirección del receptor.
    * @param value Cantidad de tokens a transferir.
    */
  function transferFrom(address from, address to, uint256 value) public returns (bool) {
    allowed[from][msg.sender] = allowed[from][msg.sender].sub(value);
    _transfer(from, to, value);
    emit Approval(from, msg.sender, allowed[from][msg.sender]);
    return true;
  }

  function _transfer(address from, address to, uint256 value) internal {
    require(to != address(0),"Se previno envio a direccion 0x0");
    balances[from] = balances[from].sub(value);
    balances[to] = balances[to].add(value);
    emit Transfer(from, to, value);
  }
}
