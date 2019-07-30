# Decentralized Marketplace that operates on Ethereum blockchain

This project contains the necessary files for operating an online marketplace on blockchain. It contains the code of smart contracts that could be used for the backend of your dapp, as well as the code files to support front end client interaction.

The dapp provided in this project is a single page application so it doesn't have to communicate with a back end server and moreover since it is a dapp every information needed for the marketplace function is stored and recorded on ethereum and IPFS and not in a server locally.

The marketplace provides a list of shops that people can visit and buy items that store owners have put on sale. The marketplace is run by a manager responsible to add and remove admins and store owners  the marketplace. New admins can add new store owners who can later on make new store fronts and manage them.
Shoppers can visit the stores, see the available item and purchase them using cryptocurrency.
In case it is needed to stop the functionality of the smart contract used by the marketplace, for example because of errors discovered in its code, the manager can trigger a circuit breaker function existing in the smart contract's code. In this way he will stop any further interaction with the smart contract that it could modify its storage. When the smart contract is paused, an indication is provided in the main page of the marketplace to notify the users. The manager may unpause the contract again and the corresponding indication will be showned to the users.
If it necessary to use another smart contract for the marketplace, for example an updated version of the smart contract without the errors, the manager should update the Registry smart contract that stores the current address of the smart contract run by the marketplace and also the previous addresses of the smart contract used. Only the manager can set the current version in the Registry contract. In this way, users who don' t want to use the frontend of the application to interact with the marketplace even if they are expected to as it is easier, but want to use  the API and the address for the interaction, they can find out the address of the smart contract, that the marketplace uses, from the Registry smart contract. So the Registry is used as an upgrade mechanism in parallel with the circuit breaker technique. If the smart contract is paused someone should check the Registry smart contract to get the latest address.

Below are given some user stories in order to provide a better understanding of the decentralized application functionality provided in this repository.

* The manager, who is the deployer of the smart contract,  visit the app that identifies him as the manager and directes him to the appropriate page showing him manager functions. Then he can enable or disable ethreum addresses as admins, who can handle the operation of the marketplace. Moreover since he is at the same time an admin he can add or remove store owners. Also he pause or unpause the smart contract's function in case in case it is needed.
* An administrator opens the web app. The web app reads the address and identifies that it belongs to an assigned admin so it displays him the corresponding page where he has access to admin only functions, such as managing store owners. An admin can add or remove an address from the list of approved store owners. An approved store owner can log into the app and have access to the store owner functions. When an admin removes an owner, his address is disabled and he can no longer act as a store owner. But later on it can be enabled again by an admin. Because the store owners may have to pay a subscription in order to be assigned as store owners, when an admin disables an owner, his storefronts are not deleted, so when later he pays for the subscription an admin adds him again to the list and he can manage his old storefronts as well.
* An approved store owner logs into the app. The web app reads their address and identifies them as an approved store owner. The app shows him a page with store owner functions. From there they can manage their existing storefronts, delete them or create new ones. They can also upload an image for their store that will be displayed along with the store to the shoppers who visit the marketplace. The image is stored in IPFS and the string returned from IPFS is stored in the blockchain so that the app can fetch it and display it. Store owners can click on one of their listed stores and manage it. They can change its name, its image and they can add and remove items as well as modifying theis name. Also they can see balance of the store and transfer it to their account. Moreover store owners can click on the store's products and provide information for them. By clicking on a product they are directed to the appropriate page from where they can add a name, a description, the available quantity of the product and its price. Also they can modify any item information.
* A shopper logs into the app. The web app does not recognize their address so it provides them the generic shopper page. From there they can see all the
storefronts, their name and image, that have been created in the marketplace.  Also they can see the balance that the smart contract reserves for their account. When a shopper  Clicking on a storefront takes them to the store's page. There they can browse the list of posted products, read their information and buy them. When they purchase an item the item's available quantity is reduced by the appropriate amount and their account is debit and the value in cryptocurrency needed for the purchase are transfered to smart contract's balance. The smart contract reserves the amount until the buyer  gives his consent that the purchase is completed, maybe because he received the product. When a shopper logs in the web app, the main page is displayed to him listing the storefronts, a form and an indication of the amount of money the smart contract reserves for his account. The shopper can fill the form with the information of the purchase he had done, giving the owners address, store, items and amount of his purchase. He can also have access to this information from the blockchain explorer, by using his transcaction hash and browsing in the information provided by the emitted event. In this way, after the shopper submits the form, the corresponding store owner can log in to app and withdraw the money from his store's balance.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You need to install the listing dependencies in order to be able to run the application.
- NODE.js: https://nodejs.org/en/
- Truffle: https://github.com/trufflesuite/truffle
- Ganache-CLI: https://github.com/trufflesuite/ganache-cli
- Metamask: https://metamask.io/
- Optionally you can use a VirtualBox VM (https://www.virtualbox.org/) running Ubuntu 16.04 to reduce the chances of run time environment variables.

### Installing and Configuring the Dapp

These steps are for installing in Ubuntu 16.04 but it should be compantible and with other Ubuntu vesions. Open a terminal and follow the steps for the installation.

#### Step 1. Clone the project
In the terminal execute the command:
``` git clone https://github.com/anikln/Marketplace.git  ```

#### Step 2. Install dependencies
Then execute the following:
```
$ cd marketplace
$ npm install
```

#### Step 3. Start Ganache-CLI
Open a terminal and type the command:
```
$ ganache-cli
```
This will start your local blockchain instance which you can use during development and testing to simulate a blockchain instance.

#### Step 4. Compile & Deploy Marketplace and Registry Smart Contracts
In the same terminal run
```
$ truffle migrate --reset
 ```
Then in the terminal are provided some information about the migration. You can see information about the deployed Market smart contract. There select the provided address and copy it. Then inside the marketplace folder, go to src folder and then contracts folder. Open the Market.js file and in the assign to the variable "MARKET_ADDRESS" the address you just copied. Then save file and exit.
Keep in mind that everytime you run ganache-cli you have to migrate the smart constracts again and copy paste the address of Market smart contract to Market.js file.

#### Step 5. Configure Metamask

- In the terminal where ganache-cli is running copy the provided mnemonic phrase. It should be 12 words.
- Configure Metamask accounts. Open up the browser where you have installed the metamask extension and click on it. Then click on "Mainnet" and choose "localhost 8545". Then press "Import using account seed phrase". In the page opened paste under the field "Wallet seed" the mnemonic you had copied earlier. To do that you can click in the form and press Ctrl + V. Then enter a new password, verify it and press "restore". Now you have connected Metamask with your local blockchain instance and the available accounts provided by ganache-cli.

#### Step 6. Run the Front End Application
Now you can run the front end of the application and interact with it. In the terminall shell, make sure you are still inside the folder marketplace, run:  
`$ npm start`
Wait for a while and a browser tab will open in the URL: http://localhost:3000. A Metamask pop up will come app requesting to connect to the application. Click accept and now you can access the application. From Metamask you can choose one of the available addresses and use it to interact with the application. Because truffle uses by default for the deployement the first of the available accounts provided by ganache-cli instance, the displayed Account 1 in Metamask is the manager of the store and the deployer of the smart contract to the blockchain instance. You can use this address and from the front-end of the app you can add new admins and owners. Their addresses could be the other addresses provided by ganache-cli. In that case after you add a new admin for example, you can change the selected Metamask account to his address and then go again to http://localhost:3000 and use the app as an admin. It is important to reload the page because the app will recognise that you no longer use the manager's account but it won't redirect you back to the front page.

## Running the tests

In the folder "test" of the project, there is a file "test.js" containing some tests for the smart contracts. To run the test files run ganache-cli in a terminal like in step 3. Then open an another terminal window and navigate inside the folder marketplace that contains this project. Then execute the command:

```
$ truffle test
 ```

When the process is complete you should see in the terminal, some messages regarding the execution of the tests.

### Additional information about the tests

In the file test.js that contains the tests, first there are test for the Market smart contract and then for the Registry smart contract. It is important to write tests for the smart contracts before deploying them, in order to check their functionality. When a smart contract is deployed to a blockchain we are unable to change its code, so it is important that its code doesn't contain any errors.
For the first contact "Market" some additional information about each test and the goal of writing them is given below:
- test one: Check that when the contract is deployed the manager of the contract will be our account. We don't want to deploy the contract and then be unable to control them
- test two: Ensure that our contract is functional and the manager is able to add and remove store owner's addresses. We must ensure the functionality of the contract.
- test three: Verify that only accounts recognized with the role of the owner can add new storefronts to marketplace. We must ensure the functionality of the contract.
- test four: Make sure that only the owner of a storefront is able to delete it and not other accounts, like other store owners or admins. We must ensure that only a store owner can manage his own stores
- test five: Ensure that store owners are able to mange their storefronts and they can add new items. We must ensure that only a store owner can manage his own stores
- test six: Check the whole buying process when an account purchase an item. We must ensure that someone can use the smart contract and successfully complete a purchase
- test seventh: Examine the possibility that a shopper interacted with the smart contract, without using the front end of the application and he accidentally sent more value so we check whether he can take the extra value back. We must ensure that the smart contract Market gives shoppers the chance to take the extra amount they paid back.
- test eight: Test if the emergency mechanism of circuit breaker can be successfully applied. It is important that after deployment in case of emergency we will be able to pause the functionality of the smart contract.

For the second contact "Registry" some additional information about each test and the goal of writing them is given below:
- test one: Validate that when we deploy the smart contract the owner account will be ours. We don't want to deploy the contract and then be unable to control them
- test two: Ensure that the owner is able to interact with the smart contract and add an address We must ensure the functionality of the contract.
- test three: Make sure that no other accounts besides the owner are able to add a new address. We must ensure that only the owner can make changes to the storage of the smart contract.
- test four: Try to add the same address for the current version of the contract and it should fail. We don't want to add the same address again and pay the extra cost.
- test five: Test whether it is possible to read the addresses of all previous versions of the contract. We must be sure that we will be able to read from the storage of the smart contract the addresses of the previous versions of the contract.


## Deployment

If you would like to deploy the smart contracts to Ethereum Mainnet or to one of Ethereum Testnets you should open the "truffle.config.js" file and follow the instructions in the comments. Also you can find more information at https://www.trufflesuite.com/docs/truffle/reference/configuration.
Remember you would need some ether for the deployment. During development Ganache CLI provided some accounts with some test ether in order we are able to interact and test the contract and the application. But if you want to deploy to Ethereum Mainnet you have to have some real ether in your account. Also if you want to deploy to one of Ethereum Testnets you should also have in your account some test ether. In order to acquire them you use Metamask and ask some from a faucet https://faucet.metamask.io/.

I have already deployed the smart contracts to Ethereum Ropsten Testnet if you would like to interact with them. The Registry smart contract is deployed at the address "0x87e5128e67D2d96aa2d5EdDaAb352CD8592eBcF4" and the Market smart contract is deployed at the address "0xFbE3f44Fc782Db2A79ab9009132caeCA5Af05E04". If you would like to use the smart contract deployed in Ropsten with the Dapp you should set the Market's contract address in the file "Market.js" which is in the folder src/contracts like you did previously in step 4.

## Live Demo

You can check the application in action in this link https://www.youtube.com/watch?v=A7XP_R1QXtc&feature=youtu.be&fbclid=IwAR0Y4fDCo_sdvZs3RtDnsslr1IRk1gWeQv4lYyZQKdCrkCWj-QRc9ElnNGM

## Authors

* **Kleinaki Athina Styliani** -  [AniKln](https://github.com/anikln)
