# Design patterns

A typical solution to avoid common problems while writing the code for a smart contract, is to use design patterns. This project uses the following design patterns:

### Restricting Access

In both Market and Registry smart contract there are certain function that we want to be executed only when they are called from addresses that have been recognized with a specific role, like the admin role. To restrict the access in specific function, modifiers are used, preventing the alteration of smart contract's state. Also the smart contracts imports the

### Condition checking and throwing an exception (Fail early and fail loud)
The smart contracts in this project use the require function to ensure that valid conditions, such as inputs or contract state variables, are met. In this way the smart contract is protected from a not valid modification of its storage from inputs sent accidentally or from a malicious user.

### Circuit Breaker
The Circuit Breaker pattern is essential because sometimes it is needed to stop their execution, for example maybe because errors are discovered in its code.

The Market smart contract uses the circuit breaker design pattern to stop the execution of any function that could modify the smart contract's storage. This is achieved by using a bool variable, a function to toggle its state which can be called only from a specific address and a modifier that checks the value of the bool variable. The modifier is applied to all public functions that can lead to state changes but not to view functions, so that someone can still read the smart contracts storage. In this way an upgraded version of the smart contract can interact with the stopped contract to read its contents.

### Withdrawal Pattern
This pattern is used in the Market smart contract to protect against re-entrancy and denial of service attacks. To apply it in the smart contract's code, each external call is isolated into its own transaction. So when a user buys an item using the purchase function in Market.sol the funds are not transfered to the owner in the same function but instead the owner should call the withdraw function to transfer the money to his account. Moreover the shopper can get back any excess value he may have send accidentally for the execution of the purchase function, by using the function getRefund. So any external call that should be executed when a purchase is done, are isolated to different functions.

### Usage of tested code
A safe technique to avoid bugs during coding is to use safe and tested pieces of code. Both smart contracts, Registry and Market, use Ownable.sol provided by OpenZeppelin contracts. Moreover the Market contract also use the SafeMath.sol contract also provided by OpenZeppelin libraries to achieve safe math operations. With this pattern the risk of discovering an error in smart contract's code is minimized.

### Upgrading System
Because there is a risk of finding errors in a deployed smart contract, like the possibility the smart contract Market.sol which is used by the marketplace to contain errors this project uses an upgrading system pattern. So in case that the marketplace have to use another smart contract, maybe an upgraded version of the old one that contained bugs, the address of the new smart contract is stored in the Registry smart contract. Only the manager can save the new address to the contract. This technique is used in parallel with circuit breaker pattern. In this way in case of an emergency, the manager can pause any execution from the old version of the contract, that may contains errors, using the circuit breaker and then he will save the address of the new upgraded version contract to Registry contract. When someone wants to interact with the smart contract of the marketplace he will have to get its address from the Registry contract and then to interact with the contract. Moreover using the circuit breaker even if someone has an address of an previous version he want be able to execute a transaction and in addition the storage of the previous version is still accessible in case a newer version needs to read its storage.

### Prevent running out of gas
Because of block gas limit restrictions, transactions can only consume a certain amount of gas. Loops that do not have a fixed number of iterations, for example looping over an array of not fixed size, may grow gas need to exceed block gas limit causing them to fail. Even though the smart contract Market.sol uses loops only in view functions, which are only executed to read data, the possibility of an another smart contract to call these  functions may as part of on-chain operations is taken under consideration. Maybe an upgraded contract version may need to call these functions. For that reason the function returnStores and returnItems have as input parameters the size of the array with the elements returned.
