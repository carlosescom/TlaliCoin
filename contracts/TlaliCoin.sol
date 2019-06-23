pragma solidity 0.5.8;

 /**
 * @title TlaliCoin es un token que incentiva el reciclaje
 * @dev Carlos Noverón https://github.com/carlosescom/TlaliCoin
 */

import "./IERC20.sol";
import "./IERC223.sol";

contract TlaliCoin is IERC20, IERC223 {
    /**
     * @dev Transfiere la cantidad especificada de tokens a la dirección especificada.
     * Invoca la función `tokenFallback` si el destinatario es un contrato.
     * La transferencia de tokens falla si el receptor es un contrato pero no
     * implementa la función `tokenFallback` o la función de respaldo para recibir fondos.
     *
     * @param _to    Dirección del receptor.
     * @param _value Cantidad de tokens a transferir.
     * @param _data  Metadatos de la transacción.
     */
    function transfer(address _to, uint _value, bytes _data) {
        // La función transfer es similar a la transfer de un ERC20 sin _data.
        // Añadido debido a razones de compatibilidad hacia atrás.
        uint codeLength;
        assembly {
            // Devuelve el tamaño del código en la dirección de destino, ésto necesita ensamblador.
            codeLength := extcodesize(_to)
        }
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        if(codeLength>0) {
            ERC223ReceivingContract receiver = ERC223ReceivingContract(_to);
            receiver.tokenFallback(msg.sender, _value, _data);
        }
        emit Transfer(msg.sender, _to, _value, _data);
    }
}