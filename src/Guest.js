import React, { Component } from "react";
import Web3Utils from "web3-utils";
import {
  HashRouter
} from "react-router-dom";
import ipfs from "./ipfs"

class Guest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayState: 1,
      storesArr: [],
      ownersArr: [],
      itemsArr: [],
      web3: null,
      accounts: null,
      contract: null,
      storeIndex: "",
      storeBytes: "",
      storeOwner: "",
      quantityValue: "",
      indexOfItem: "",
      receipt: "",
      releaseOwner: "",
      releaseIndex: "",
      releaseAmount: "",
      receiptRelease: "",
      ipfsHash: "",
      reservedWei : 0
    };

    this.initialize = this.initialize.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.initializeItems = this.initializeItems.bind(this);
    this.addEventListener = this.addEventListener.bind(this);
    this.GoBack = this.GoBack.bind(this);
    this.handleBuy = this.handleBuy.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRelease = this.handleRelease.bind(this);
    this.detectEvent = this.detectEvent.bind(this);
    this.detectEvent = this.detectEvent.bind(this);
    this.guestAmount = this.guestAmount.bind(this);

  }

  componentDidMount = async () => {
    let web3 = this.props.web3;
    let accounts = this.props.accounts;
    let instance = this.props.contract;
    var reservedWei = await instance.methods.reservedBalance(accounts[0]).call();
    console.log(reservedWei.toString());
    this.setState({ web3, accounts, contract: instance, reservedWei: reservedWei.toString()}, this.addEventListener);
  }

  addEventListener = async() => {
    let listener = await this.state.contract.events.AddedNewStore({fromBlock: "latest"},(error, event) => {
      if(this.state.displayState == 1){
        console.log(event);
        this.initialize();
      } else {
        return;
      }
    });
    let listener2 = await this.state.contract.events.RemovedStore({fromBlock: "latest"},(error, event) => {
      if(this.state.displayState == 1){
        console.log(event);
        this.initialize();
      } else {
        return;
      }
    });
    let listener3 = await this.state.contract.events.ModifyStore({fromBlock: "latest"},(error, event) => {
      if(this.state.displayState == 1){
        console.log(event);
        this.initialize();
      } else {
        return;
      }
    });
    // state 2
    let listener4 = await this.state.contract.events.LogBuyItem({fromBlock: "latest"},(error, event) => {
      if(this.state.displayState == 2){
        console.log(event);
        this.detectEvent(event.returnValues[1], event.returnValues[4]);
      } else {
        return;
      }
    });
    let listener5 = await this.state.contract.events.AddedNewStoreItem({fromBlock: "latest"},(error, event) => {
      if(this.state.displayState == 2){
        console.log(event);
        this.detectEvent(event.returnValues[0], event.returnValues[1]);
      } else {
        return;
      }
    });
    let listener6 = await this.state.contract.events.RemovedStoreItem({fromBlock: "latest"},(error, event) => {
      if(this.state.displayState == 2){
        console.log(event);
        this.detectEvent(event.returnValues[0], event.returnValues[1]);
      } else {
        return;
      }
    });
    let listener7 = await this.state.contract.events.ModifyItemName({fromBlock: "latest"},(error, event) => {
      if(this.state.displayState == 2){
        console.log(event);
        this.detectEvent(event.returnValues[0], event.returnValues[3]);
      } else {
        return;
      }
    });
    let listener8 = await this.state.contract.events.ModifyItemDescr({fromBlock: "latest"},(error, event) => {
      if(this.state.displayState == 2){
        console.log(event);
        this.detectEvent(event.returnValues[0], event.returnValues[3]);
      } else {
        return;
      }
    });
    let listener9 = await this.state.contract.events.ModifyItemQuantity({fromBlock: "latest"},(error, event) => {
      if(this.state.displayState == 2){
        console.log(event);
        this.detectEvent(event.returnValues[0], event.returnValues[3]);
      } else {
        return;
      }
    });
    let listener10 = await this.state.contract.events.ModifyItemPrice({fromBlock: "latest"},(error, event) => {
      if(this.state.displayState == 2){
        console.log(event);
        this.detectEvent(event.returnValues[0], event.returnValues[3]);
      } else {
        return;
      }
    });
    this.initialize();
  }

  detectEvent(_owner, _storeIndex){
    let owner = this.state.storeOwner;
    let store_index = this.state.storeIndex + 1;
    console.log(_owner+" "+ owner+" "+store_index+" "+_storeIndex);
    if(_owner == owner && store_index == _storeIndex)
    {
      //if a new purchase is done, update
      console.log("detectedHelloo" );
      this.initializeItems();
    }
  }

  initialize = async () => {
    const { accounts, contract } = this.state;
    var len = await contract.methods.lenOwnersArr().call();
    let arrayFinal = [];
    //stores all active storeOwners
    let arrayloop = [];
    //stores all stores with their correspondin Owner address
    let arrayloop2 = [];
    let owner;
    for (var i=0; i<len; i++){
      //fetch store Owner
      owner = await contract.methods.storeOwners(i).call();
      //check if he is an enabled Store Owner
      var isOwner = await contract.methods.isStoreOwner(owner).call();
      if(isOwner){
        arrayloop.push(owner);
      }
    }
    let j;
    let k;
    // to avoid overhead, we set the maximum elements returned from the contract
    // each time to be 31
    let stores =[];
    //let s;
    var string;
    for (var i=0; i < arrayloop.length; i++){
      j=0;
      var lenOwnerStores = await contract.methods.returnLengthStoreArray(arrayloop[i]).call();
      // if the owner has stores fetch them
      if(lenOwnerStores != 0){
        do{
          k = j * 31;
          if(lenOwnerStores < 31 * (j+1)){
            stores = await contract.methods.returnStores(arrayloop[i], k, lenOwnerStores).call();
          }
          else{
            stores = await contract.methods.returnStores(arrayloop[i], k, k + 30).call();
          }
          j = j + 1;
          stores = [...stores];
          console.log(stores);
        }while(lenOwnerStores >= 31 * j);
        // now remove deleted stores from the array
        for(let index = 0 ; index < lenOwnerStores; index++){
          if(stores[index][2] != 0){
           string = Web3Utils.hexToUtf8(stores[index]);
           let ipfsValue = await contract.methods.getHash(arrayloop[i], index + 1).call();
           arrayloop2.push({index: index, StoreName: string, BytesName: stores[index], Owner: arrayloop[i], ipfsHash: ipfsValue});
          }
        }
      }
      // now go to next owner in the array but first save to final array
      arrayFinal = arrayloop2;
    }
    // now arrayFinal holds the data to store to state variable
    //console.log(arrayFinal);
    this.setState({ storesArr: arrayFinal }, this.addEventListenerStore);
  }

/*  addEventListenerStore = async() => {
   this.state.contract.events.LogBuyItem({fromBlock: "latest"},(error, event) => { console.log(event); this.geti4(event.returnValues[1], event.returnValues[5]); });
  }
*/
  handleEnter(index, bytesName, _owner, _ipfsHash, event){
    event.preventDefault();
    this.setState({ displayState: 2, storeIndex: index, storeBytes: bytesName, storeOwner: _owner, ipfsHash: _ipfsHash}, this.initializeItems);
  }

  //fetch all items
  initializeItems = async () => {
    const { storeOwner, contract, storeIndex } = this.state;
    let indexStore = storeIndex + 1;
    var len = await contract.methods.returnLengthItemArray(storeOwner, indexStore).call();
    let arrayFinal = [];
    let arrayloop = [];
    let j=0;
    let k;
    // to avoid overhead, we set the maximum elements returned from the contract
    // each time to be 31
    if(len != 0){
      do{
        k = j * 31;
        if(len < 31 * (j+1)){
          arrayloop = await contract.methods.returnItems(storeOwner, k, len, indexStore ).call();
        }
        else{
          arrayloop = await contract.methods.returnStores(storeOwner, k, k + 30, indexStore).call();
        }
        j = j + 1;
        arrayloop = [...arrayloop];
      }while(len >= 31 * j);
      let string;
      for(var i = 0; i < len; i++){
        if(arrayloop[i][2] != 0){
          var info = await this.state.contract.methods.returnItemInfo(this.state.storeOwner, this.state.storeIndex + 1, i + 1).call();
          string = Web3Utils.hexToUtf8(arrayloop[i]);
          arrayFinal.push({index: i, ItemName: string, BytesName: arrayloop[i], curDescription: info[1], quantity: info[2], price: info[4].toString()});
        }
      }
    }
    // activate listener to change the quantity available
   this.setState({ itemsArr: arrayFinal });
  }

  /*addEventListener= async() => {
    this.state.contract.events.LogBuyItem({fromBlock: "latest"},(error, event) => { console.log(event); this.geti4(event.returnValues[1], event.returnValues[5]); });
  }*/

/*  geti4 = async(storeName, itemIndex) =>{
    let name_bytes = this.state.storeBytes;
    console.log(this.state.storeBytes);
    console.log(itemIndex);
    console.log(storeName);
    console.log(name_bytes)
    if(storeName == name_bytes)
    {
      //if a new purchase is done for this store, update
      console.log("detected");
      this.geti3(itemIndex);
    }
  }
  */

/*  geti3 = async(itemIndex) => {
   //fetch item data
   var info = await this.state.contract.methods.returnItemInfo(this.state.storeOwner, this.state.storeIndex + 1, itemIndex).call();
   var quantity = info[2];
   let arrayIt = this.state.itemsArr.map(el => (el.index == (itemIndex - 1) ? Object.assign({}, el, { quantity }) : el));
   this.setState({
      itemsArr: arrayIt
    });
  }
*/
  GoBack(){
    this.setState({displayState: 1, itemsArr: [], storeIndex: "", storeBytes: "", storeOwner: "", quantityValue: "", indexOfItem: "", receipt: "" });
  }

  handleBuy = async(event) => {
    event.preventDefault();
    if(this.state.indexOfItem > this.state.itemsArr.length || this.state.indexOfItem <= 0){
      alert("Invalid index");
      return;
    }
    let accounts = await this.state.web3.eth.getAccounts();
    let quantity = this.state.itemsArr[this.state.indexOfItem - 1].quantity;
    let price  = this.state.itemsArr[this.state.indexOfItem - 1].price;
    let indexItem = this.state.itemsArr[this.state.indexOfItem - 1].index;
    if(Number(this.state.quantityValue) <= 0){
      alert("please enter valid quantity");
      return;
    }
    else if(Number(this.state.quantityValue) > Number(quantity)){
      alert("You can not buy more than the available quantity");
      return;
    }
    else{
      var value = (Number(price) * Number(this.state.quantityValue));
      console.log(isNaN(value));
      var itemName = this.state.itemsArr[this.state.indexOfItem - 1].BytesName;
      console.log(this.state.storeOwner+"  "+(this.state.storeIndex + 1)+"  "+(indexItem + 1)+"  "+this.state.quantityValue+" "+this.state.storeBytes+"  "+itemName);
      await this.state.contract.methods.purchase(this.state.storeOwner, this.state.storeIndex + 1, indexItem + 1, this.state.quantityValue, this.state.storeBytes, itemName).send({from: accounts[0], value: value })
      .once('transactionHash', function(hash){ console.log(hash); })
      .once('receipt', function(receipt){
        console.log(receipt.transactionHash);
      })
      .then((receipt) => { prompt("Copy to clipboard: Ctrl+C, Enter", "Note your receipt details.\nStore Owner address:"+this.state.storeOwner+"\nStore index:"+(this.state.storeIndex+1)+"\nItem index:"+(indexItem+1)+"\nAmount:"+value+"\nStore name:"+this.state.storeBytes+"\nitem name:"+itemName);
      this.setState( {receipt: receipt.transactionHash } );});
    }
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
  }

  handleRelease = async(event) => {
    event.preventDefault();
    let accounts = await this.state.web3.eth.getAccounts();
    if( this.state.releaseOwner == "" || this.state.releaseIndex <= 0 || this.state.releaseAmount <= 0){
      alert("The input values are not valid");
      return;
    }else {
      console.log(this.state.releaseOwner+"  "+this.state.releaseIndex+"  "+ this.state.releaseIndexItem+"  "+this.state.releaseAmount+"  "+this.state.releaseName+"  "+this.state.releaseNameItem);
    await this.state.contract.methods.releaseFunds(this.state.releaseOwner, this.state.releaseIndex, this.state.releaseIndexItem, this.state.releaseAmount, this.state.releaseName, this.state.releaseNameItem).send({from: accounts[0]})
    .then((receipt) => {
      this.setState( {receiptRelease: receipt.transactionHash }, this.guestAmount );
    });
    }
  }

  guestAmount = async() => {
    var reservedWei = await this.state.contract.methods.reservedBalance(this.state.accounts[0]).call();
    this.setState( {reservedWei: reservedWei } );
  }
  render() {

    const items = this.state.storesArr.map((item) =>
          <li key={item.index + item.Owner}>{item.StoreName}
          <img src={`https://ipfs.io/ipfs/${item.ipfsHash}`} width="50" height="25" alt=""/><br />
          <button onClick={(e) => this.handleEnter(item.index, item.BytesName, item.Owner, item.ipfsHash, e)} >EnterStore</button>
          </li>
    );
    const itemsStore = this.state.itemsArr.map((item) =>
          <li key={item.index}>{item.ItemName}<br />Description:{item.curDescription}<br />Quantity:{item.quantity}<br />Price:{item.price}
          </li>
        );
    const displayRelease = ((this.state.receiptRelease == "") ? null : (<p> Your transcaction receipt is {this.state.receiptRelease} </p>));

    if(this.state.displayState == 1){
      return (
        <HashRouter>
        <div>
        <h2>HELLOGuest</h2>
        {items}
        <div className="addItem">
         <form onSubmit={(e) => this.handleRelease(e)}>
         <label>
           Enable Store Owner to receive the amount you paid for an item:<br />
           <input type="text" placeholder="address of store owner" value={this.state.releaseOwner} name="releaseOwner" onChange={this.handleChange} /><br />
           <input type="text" placeholder="index of the store returned in the trascaction receipt, in events logs section" value={this.state.releaseIndex} name="releaseIndex" onChange={this.handleChange} /><br />
           <input type="text" placeholder="index of the item returned in the trascaction receipt, in events logs section" value={this.state.releaseIndexItem} name="releaseIndexItem" onChange={this.handleChange} /><br />
           <input type="text" placeholder="name of the store in bytes that is returned in the trascaction receipt, in events logs section" value={this.state.releaseName} name="releaseName" onChange={this.handleChange} /><br />
           <input type="text" placeholder="name of the item in bytes that is returned in the trascaction receipt, in events logs section" value={this.state.releaseNameItem} name="releaseNameItem" onChange={this.handleChange} /><br />
           <input type="text" placeholder="input amount" value={this.state.releaseAmount} name="releaseAmount" onChange={this.handleChange} />
         </label>
         <button>Submit</button>
         {displayRelease}
         </form>
         </div>
         <p> From your purchases the marketplace contract holds {this.state.reservedWei} wei</p>
         <p> Release funds to item owners to fullfill the purchases. Be careful not to send the wrong amount </p>
	      </div>
	      </HashRouter>
      );
    }
    else{
      return (
        <HashRouter>
        <div>
        <button onClick={this.GoBack}>GoBack</button>
        <h2>SecondStateGuest</h2>
        <ol>
        {itemsStore}</ol>
	      </div>
        <div className="buyItem">
          <form onSubmit={(e) => this.handleBuy(e)}>
          <label>
            Buy an item. Give the index of the item from the above list and the quantity you want to buy:
            <input type="text" placeholder="Input index of the item" value={this.state.indexOfItem} name="indexOfItem" onChange={this.handleChange} />
            <input type="text" placeholder="Input quantity" value={this.state.quantityValue} name="quantityValue" onChange={this.handleChange} />
          </label>
          <button>Buy</button>
          </form>
        </div>
        <p>{this.state.receipt}</p>
	      </HashRouter>
      );
    }
  }
}

export default Guest;
