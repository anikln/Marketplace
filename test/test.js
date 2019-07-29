const Market = artifacts.require("Market");
const Registry = artifacts.require("Registry");

contract("Market", async accounts => {
  let instance;
  beforeEach('setup contract for each test', async function () {
      instance = await Market.new();
  })

  // with this test we make sure that when the contract is deployed the manager of the contract will be our account
  it("should make manager the first account", async () => {
    let managerAccount = await instance.owner.call();
    assert.equal(managerAccount, accounts[0], "the first account should have been the manager");
  });

  // the purpose of this test is to ensure that our contract is functional and the manager is able to add and
  // remove store owner's addresses
  it("Manager can add and remove Owners", async function() {
    let addNewOwner = await instance.addOwner(accounts[1], {from: accounts[0] });
    let isOwner = await instance.isStoreOwner(accounts[1]);
    assert.equal(isOwner, true, "the owner was not added successfully");

    let addNewStore = await instance.addNewStore("0x737472696e670000000000000000000000000000000000000000000000000000", {from: accounts[1]  });
	  let lengthArr = await instance.returnLengthStoreArray(accounts[1]);
	  //user checks the array of his stores in order to provide it to the function
   	let ownersStoresArray = await instance.returnStores(accounts[1],0,lengthArr.toString());

	  assert.equal(ownersStoresArray[0], "0x737472696e670000000000000000000000000000000000000000000000000000", "the owner should be able to add a store");

    let removeOwner = await instance.removeOwner(accounts[1], {from: accounts[0] });
	  let isOwner2 = await instance.isStoreOwner(accounts[1]);
    assert.equal(isOwner2, false, "the owner is not deactivated successfully");
  });

  // with this test we verify that only accounts recognized with the role of the owner can add new storefronts to marketplace
  it("Only owner can add stores", async function() {
    let Error;
    try {
    	await instance.addNewStore("0x737472696e670000000000000000000000000000000000000000000000000000", {from: accounts[0]});
    } catch (error) {
      Error = error;
    }
    assert.notEqual(Error, undefined, 'Exception was not thrown');
    assert.isAbove(Error.message.search('VM Exception while processing transaction: revert'), -1, 'Error: VM Exception while processing transaction: revert');
  });

  // the goal of this test is to make sure that only the owner of a storefront is able to delete it and not other accounts,
  // like other store owners or admins
  it("Only the owner can delete one of his stores", async function() {
    let Error;
    let addNewOwner = await instance.addOwner(accounts[1], {from: accounts[0] });
    let addNewStore = await instance.addNewStore("0x737472696e670000000000000000000000000000000000000000000000000000", {from: accounts[1]});
	  //user learns the length of the array in order to specify the indexes
	  let lengthArr = await instance.returnLengthStoreArray(accounts[1]);

    //user checks the array of his stores in order to provide it to the function
    let ownersStoresArray = await instance.returnStores(accounts[1],0,lengthArr.toNumber());
	  //now loop through to find the one with the specific name
    let index = -1;
	  for (let i = 0; i< lengthArr.toNumber(); i++){
      if(ownersStoresArray[i] == "0x737472696e670000000000000000000000000000000000000000000000000000") {
        index = i ;
        console.log(index);
		  }
	  }
	  try {
 	    await instance.removeStore("0x737472696e670000000000000000000000000000000000000000000000000000", index + 1, {from: accounts[0]});
    } catch (error) {
      Error = error;
    }
    assert.notEqual(Error, undefined, 'Exception was not thrown');
    assert.isAbove(Error.message.search('VM Exception while processing transaction: revert'), -1, 'Error: VM Exception while processing transaction: revert');

	  let removeStorebyOwner = await instance.removeStore("0x737472696e670000000000000000000000000000000000000000000000000000", index+1, {from: accounts[1] });
	  let storesArray = await instance.returnStores(accounts[1], 0, 1);
	  assert.equal(storesArray[0], 0, "the array is not empty, the store is not deleted successfully");
  });

  // with this test we ensure that store owners are able to mange their storefronts and they can add new items
  it("Owner can add new items to his store", async function() {
    let addNewOwner = await instance.addOwner(accounts[2], {from: accounts[0]});
    let addNewStore = await instance.addNewStore("0x737472696e670000000000000000000000000000000000000000000000000000", {from: accounts[2]});
	  let addNewItem = await instance.addNewItem("0x737472696e670000000000000000000000000000000000000000000000000000", 1, "0x6464000000000000000000000000000000000000000000000000000000000000", "description of item", 10, 100, {from: accounts[2]});
	  //user learns the length of the array in order to specify the indexes
	  let lengthItemArr = await instance.returnLengthItemArray(accounts[2], 1);
	  let returnItemsOfStore = await instance.returnItems(accounts[2], 0, lengthItemArr.toNumber(), 1);
	  assert.equal(returnItemsOfStore[0], "0x6464000000000000000000000000000000000000000000000000000000000000" , "the item was not added successfully");
    //another check if the values inserted are correct
	  let itemInfo = await instance.returnItemInfo(accounts[2], 1, 1);
	  assert.equal(itemInfo[3], 10 , "the item quantity is not correct");
  });

  // with this test we check the whole buying process when an account purchase an item
  it("check purchase", async function() {
	  let addNewOwner = await instance.addOwner(accounts[6], {from: accounts[0]});
    let addNewStore = await instance.addNewStore("0x6161000000000000000000000000000000000000000000000000000000000000", {from: accounts[6]});
	  let addNewItem = await instance.addNewItem("0x6161000000000000000000000000000000000000000000000000000000000000", 1 ,"0x6464000000000000000000000000000000000000000000000000000000000000", "description of item", 10, 100, {from: accounts[6]});

    //account 5 will buy an item sending the rigth ammount of value
    let buy = await instance.purchase(accounts[6], 1, 1, 1, "0x6161000000000000000000000000000000000000000000000000000000000000", "0x6464000000000000000000000000000000000000000000000000000000000000", {from: accounts[5], value: 100});
    // check if he has to be refunded.
    let refundValue = await instance.refundBalance.call(accounts[5]);
    assert.equal(refundValue.toNumber(), 0, "He shouldn't be refunded");

    //ckeck balance of contract
    //console.log(instance.address+"address");
    let contractBalance = await web3.eth.getBalance(instance.address);
    assert.equal(contractBalance, '100', "The balance should be 100");
    // check balance of store
    var balanceOfStore = await instance.balanceOfStore(accounts[6], 1);

    assert.equal(balanceOfStore, 0, "The balance should be 0. The buyer hasn't released the funds");
    // byuer releases funds to StoreOwner
    let release = await instance.releaseFunds(accounts[6], 1, 1, 100, "0x6161000000000000000000000000000000000000000000000000000000000000", "0x6464000000000000000000000000000000000000000000000000000000000000", {from: accounts[5]});
    var balanceOfStoreAfterRelease = await instance.balanceOfStore(accounts[6], 1);
    //console.log(balanceOfStoreAfterRelease+"balanceOfStoreAfterRelease");
    assert.equal(balanceOfStoreAfterRelease, 100, "The balance should be 100. The buyer has released the funds");
    //check if owner can withdraw the money
    var withdraw = await instance.withdraw(1, {from:accounts[6]});
    var balanceOfStoreAfterWithdraw = await instance.balanceOfStore(accounts[6], 1);
    assert.equal(balanceOfStoreAfterWithdraw , 0, "The balance should be 0. The storeOwner withdraw funds");

    //check the balance of the contract is decreased by the amount the owner withdraw
    let contractBalanceAfterWithdraw = await web3.eth.getBalance(instance.address);
    assert.equal(contractBalanceAfterWithdraw, '0', "The balance should be 0 since the storeOwner withdraw the amount");
  });

  // with this test we examine the possibility that a shopper interacted with the smart contract, without using the front end of the application,
  // and he accidentally sent more value so we check whether he can take the extra value back
  it("check purchase with more value", async function() {
	  let addNewOwner = await instance.addOwner(accounts[7], {from: accounts[0]});
    let addNewStore = await instance.addNewStore("0x6161000000000000000000000000000000000000000000000000000000000000", {from: accounts[7]});
	  let addNewItem = await instance.addNewItem("0x6161000000000000000000000000000000000000000000000000000000000000", 1 ,"0x6464000000000000000000000000000000000000000000000000000000000000", "description of item", 10, 100, {from: accounts[7]});

    //account 5 will buy an item sending the exact value required
    let buy = await instance.purchase(accounts[7], 1, 1, 1, "0x6161000000000000000000000000000000000000000000000000000000000000", "0x6464000000000000000000000000000000000000000000000000000000000000", {from: accounts[5], value: 200});
    // check if he has to be refunded.
    let refundValue = await instance.refundBalance.call(accounts[5]);
    assert.equal(refundValue.toNumber(), 100, "He should be refunded");

    //ckeck balance of contract
    let contractBalance = await web3.eth.getBalance(instance.address);
    assert.equal(contractBalance, '200', "The balance should be 200");
    // check balance of store
    var balanceOfStore = await instance.balanceOfStore(accounts[7], 1);
    assert.equal(balanceOfStore, 0, "The balance should be 0. The buyer hasn't released the funds");
    // buyer finds out he send more funds tries to refund
    let getRefunded = await instance.getRefund({from: accounts[5]});
    let refundValueAfterRefund = await instance.refundBalance.call(accounts[5]);
    assert.equal(refundValueAfterRefund.toNumber(), 0, "He should be able to get a refund again");

    let contractBalanceAfterRefund = await web3.eth.getBalance(instance.address);
    assert.equal(contractBalanceAfterRefund, '100', "The balance should be 100. The store only holds the amount for the bought item");
  });

  // here we test if the emergency mechanism of circuit breaker can be successfully applied
  it("Circuit Breaker works", async function() {
    var ErrorCheck1;
    let ErrorCheck2;
    let addNewOwner = await instance.addOwner(accounts[8], {from: accounts[0]});
    let freeze = await instance.circuitBreaker({from: accounts[0]});
    // owner tries to add a new store but the transaction should fail
    try {
    	await instance.addNewStore("0x737472696e670000000000000000000000000000000000000000000000000000", {from: accounts[8]});
    } catch (error) {
      ErrorCheck1 = error;
    }
    assert.notEqual(ErrorCheck1, undefined, 'Exception was not thrown');
    assert.isAbove(ErrorCheck1.message.search('VM Exception while processing transaction: revert'), -1, 'Error: VM Exception while processing transaction: revert');

    let isPaused = await instance.contractPaused();
    assert.equal(isPaused, true, "The contract should be paused");

    //unpause contract and try the previously command to add a new store again. It should succeed
    let unfreeze = await instance.circuitBreaker({from: accounts[0]});
    try {
    	await instance.addNewStore("0x737472696e670000000000000000000000000000000000000000000000000000", {from: accounts[8]});
    } catch (error) {
      ErrorCheck1 = error;
    }
    assert.equal(ErrorCheck2, undefined, "An exception should' t have been throwned");

    let lengthArr = await instance.returnLengthStoreArray(accounts[8]);
    let ownersStoresArray = await instance.returnStores(accounts[8], 0,lengthArr.toNumber());
	  assert.equal(ownersStoresArray[0], "0x737472696e670000000000000000000000000000000000000000000000000000" , "the store was not added successfully");
  });
});

contract("Registry", async accounts => {
  let instance;
  beforeEach('setup contract for each test', async function () {
      instance = await Registry.new();
  })

  // with this test we validate that when we deploy the smart contract the owner account will be ours
  it("should make owner the first account", async () => {
    let ownerAccount = await instance.owner.call();
    assert.equal(ownerAccount, accounts[0], "the first account should have been account[0]");
  });

  // with this test we make sure that the owner is able to interact with the smart contract and add an address.
  it("the owner is able to add an address", async () => {
    let addStore = await instance.setLatestVersionRegistry("0x843c57eF0ea2F68aA30EFCA4B859871c81AF7CE3", {from: accounts[0]});
    let currentVersion = await instance.currentVersion.call();
    console.log(currentVersion);
    assert.equal(currentVersion, "0x843c57eF0ea2F68aA30EFCA4B859871c81AF7CE3", "the addresses should match");
  });

  // with this test we make sure that no other accounts besides the owner are able to add a new address
  it("other accounts who are not the owner are not able to add a new address", async () => {
    let Error;
    try {
    	await instance.setLatestVersionRegistry("0xF3269d6F54fAF3DEf13702d8085E706e10b85A0c", {from: accounts[8]});
    } catch (error) {
      Error= error;
    }
    assert.notEqual(Error, undefined, 'Exception was not thrown');
    assert.isAbove(Error.message.search('VM Exception while processing transaction: revert'), -1, 'Error: VM Exception while processing transaction: revert');
  });

  // with this test we try to add the same address for the current version of the contract, but we should fail
  it("it is not possible to add the same address for the current version", async () => {
    let Error;
    let addStore = await instance.setLatestVersionRegistry("0x843c57eF0ea2F68aA30EFCA4B859871c81AF7CE3", {from: accounts[0]});
    try {
    	await instance.setLatestVersionRegistry("0x843c57eF0ea2F68aA30EFCA4B859871c81AF7CE3", {from: accounts[0]});
    } catch (error) {
      Error= error;
    }
    assert.notEqual(Error, undefined, 'Exception was not thrown');
    assert.isAbove(Error.message.search('VM Exception while processing transaction: revert'), -1, 'Error: VM Exception while processing transaction: revert');
  });

  // with this test we try test whether it is possible to read the addresses of all previous versions of the contract
  it("it is possible to read all previously added addresses", async () => {
    let addStore = await instance.setLatestVersionRegistry("0x843c57eF0ea2F68aA30EFCA4B859871c81AF7CE3", {from: accounts[0]});
    let addStore2 = await instance.setLatestVersionRegistry("0xF3269d6F54fAF3DEf13702d8085E706e10b85A0c", {from: accounts[0]});
    let length = await instance.returnLengthPreviousVersionsArray();
    //ngth = length.toNumber();
    let array = [];
    console.log(length.toNumber());
    for(var i = 0; i < length.toNumber(); i++){
      array[i] = await instance.previousVersions.call(i);
      console.log(array[i]);
    }
    assert.equal(array[0], "0x0000000000000000000000000000000000000000", "the addresses should match");
    assert.equal(array[1], "0x843c57eF0ea2F68aA30EFCA4B859871c81AF7CE3", "the second addresses should match");
  });

});
