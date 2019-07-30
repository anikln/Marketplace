# Avoiding common attacks
During the designing process of this project some measures where taken under consideration in order to ensure that the smart contracts used are not vulnerable to common attacks. Below are described some of these common attacks and the way the smart contract is designed to safely deal with them.

## Re-entrancy Attacks
A Re-entancy attack may happen when contract makes an external call to another contract which in this way can take over the control flow.
An example o f a Re-entrancy attack is this:
```
// INSECURE
mapping (address => uint) private userBalances;
function withdrawBalance() public {
    uint amountToWithdraw = userBalances[msg.sender];
    require(msg.sender.call.value(amountToWithdraw)()); // At this point, the caller's code is executed, and can call withdrawBalance again
    userBalances[msg.sender] = 0;
}
```
In this example when the function call is executed, it forwards all remaining gas of by default to the calling address. Ether transfer may include code execution, so the recipient could be a contract that calls back into withdrawBalance address. For example the recipient might be a smart contract with a fallback function, so when ether are sent to it, the code of this fallback function is called. This code may call again the withdrawBalance function,and withdraw the balance again since the user balance is set to zero at the final line of the function's code so at the end of the execution.
The source of the example can be found here : https://consensys.github.io/smart-contract-best-practices/known_attacks/

In this project the smart contract Market deals with this attack in its withdraw function by first decreasing store owner's balance and then execute a transfer function.

## Integer Overflow and Underflow
The Ethereum Virtual Machine (EVM) uses fixed-size data types for integers, so an integer variable can represent numbers in a certain range. If safety measures are not taken, during the execution of mathematical operations inside smart contract's function, the outcome of the operation may not be the desirable one because of an integer overflow or underflow.
An example of this attack is the following:
mapping (address => uint256) public balanceOf;
```
// INSECURE
function transfer(address _to, uint256 _value) {
    /* Check if sender has balance */
    require(balanceOf[msg.sender] >= _value);
    /* Add and subtract new balances */
    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;
}
```
In this example it is not checked whether the outcome of the addition of the variable value to the balance will lead the balance variable to overflow.
To avoid situations as such, the Market contract imports the library SafeMath provided by OpenZeppelin and executes most mathematical operations using it.

## Denial of Service by Block Gas Limit (or startGas)
The Ethereum blockchain poses block gas limit restrictions so transactions can only consume a certain amount of gas. So this attack may happen when a function executes an unbounded loop for example when it loops through the elements of a non fixed size array. If the number of the loop interactions is large, the gas needed for their complete execution might exceed block gas limit causing them to fail and stall smart contracts at a certain point.
Even though the smart contract Market.sol uses loops only in view functions, which are only executed to read data, the possibility of an another smart contract to call these  functions as part of on-chain operations, such as the case of an upgraded contract version that needs information from a previous version, is taken under consideration. For that reason the function returnStores and returnItems have as input parameters the size of the array with the elements returned.
