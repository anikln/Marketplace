import React, { Component } from "react";
import Web3 from "web3";
import Web3Utils from "web3-utils";
import {
  HashRouter,
} from "react-router-dom";
import ipfs from "./ipfs"

class Owner extends Component {

  // displayState = 1:stores, 2:specificstore, 3:specific item
  constructor(props) {
    super(props);
    this.state = {
      storesArr: [],
      web3: null,
      accounts: null,
      contract: null,
      valueAdd: '',
      displayState: 1,
      itemsArr: [],
      ipfsHash : "",
      stringName: "",
      bytesName: "",
      index: "",
      new_name: "",
      valueItem: "",
      descriptionItem: "",
      quantityItem: "",
      priceItem: "",
      balance: "",
      isEnabled: false,
      receiptWith: "",
      showrec: false,
      stringNameItem: "",
      bytesNameItem: "",
      indexItem: "",
      curDescription: "",
      initialQuantity: "",
      bought: "",
      price: "",
      new_nameItem: "",
      new_desc: "",
      new_quant: "",
      new_price: "",
      buffer: "",
      receiptChangeName: "",
      receiptAddRemoveStore: "",
      receiptAll: "",
      receiptItemInfo: ""
    };

    this.initializeStores = this.initializeStores.bind(this);
    this.initializeStoreItems = this.initializeStoreItems.bind(this);
    this.initializeItemInfo = this.initializeItemInfo.bind(this);
    this.detectEvent = this.detectEvent.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClick2 = this.handleClick2.bind(this);
    this.handleClick3 = this.handleClick3.bind(this);
    this.handleClick4 = this.handleClick4.bind(this);
    this.bytesLong = this.bytesLong.bind(this);
    this.handleModificationStore = this.handleModificationStore.bind(this);
    this.handleModificationItem = this.handleModificationItem.bind(this);
    this.MarketContract_addStore = this.MarketContract_addStore.bind(this);
    this.MarketContract_modifyStore = this.MarketContract_modifyStore.bind(this);
    this.MarketContract_modifyItem = this.MarketContract_modifyItem.bind(this);
    this.GoBack = this.GoBack.bind(this);
    this.showBalance = this.showBalance.bind(this);
    this.withdraw = this.withdraw.bind(this);
    this.captureFile = this.captureFile.bind(this);
    this.onSubmitIPFS = this.onSubmitIPFS.bind(this);

    //item
    this.changeDesc = this.changeDesc.bind(this);
    this.changeQuant = this.changeQuant.bind(this);
    this.changePrice = this.changePrice.bind(this);
    this.MarketContract_modifyItem = this.MarketContract_modifyItem.bind(this);
    this.handleModificationItem = this.handleModificationItem.bind(this);
    this.addEventListener = this.addEventListener.bind(this);

  }

  componentDidMount = async () => {
    console.log(this.props);
    let web3 = this.props.web3;
    let accounts = await web3.eth.getAccounts();
    let instance = this.props.contract;
    this.setState({ web3, accounts, contract: instance}, this.addEventListener);
  }

  initializeStores = async () => {
    const { contract } = this.state;
    let accounts = await this.state.web3.eth.getAccounts();
    let responseOwner = await contract.methods.isStoreOwner(accounts[0]).call();
    if(!responseOwner){
      alert("Please switch to an owner account again");
      return;
    }else{
      var len = await contract.methods.returnLengthStoreArray(accounts[0]).call();
      let arrayFinal = [];
      let arrayloop = [];
      let j = 0;
      let k;
      // to avoid overhead, we set the maximum elements returned from the contract
      // each time to be 31
      if(len != 0){
        do{
          k = j * 31;
          if(len < 31 * (j+1)){
            arrayloop = await contract.methods.returnStores(accounts[0], k, len).call();
          }else{
            arrayloop = await contract.methods.returnStores(accounts[0], k, k + 30).call();
          }
          j = j + 1;
          arrayloop = [...arrayloop];
        }while(len >= 31 * j);
        let string;
        for(var i = 0; i < len; i++){
          if(arrayloop[i][2] != 0){
            string = Web3Utils.hexToUtf8(arrayloop[i]);
            arrayFinal.push({index: i, StoreName: string, BytesName: arrayloop[i]});
          }
        }
      }
      this.setState({ storesArr: arrayFinal, value: "" });
    }
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
  }


  MarketContract_addStore(_storeName) {
    this.state.contract.methods.addNewStore(_storeName).send({from: this.state.accounts[0]})
    .then((receipt) => {
      this.setState( {receiptAddRemoveStore: receipt.transactionHash }, this.initializeStores );
    });
  }

  canBeSubmitted = async(string) => {
    let bytes = Web3Utils.asciiToHex(string);
    console.log(bytes);
    if(bytes.length <= 64){
      return true;
    }
    return false;
  }

  bytesLong = async(_storeName) => {
    let length = Web3Utils.asciiToHex(_storeName).length;
    let bytes = Web3Utils.asciiToHex(_storeName);
    if(length < 66){
      let differ = 66 - length;
      for(var i = 0; i < differ; i++){
        bytes = bytes.concat(0);
      }
    }
    return bytes;
  }

  handleSubmit = async(event) => {
    event.preventDefault();
    let accounts = await this.state.web3.eth.getAccounts();
    let responseOwner = await this.state.contract.methods.isStoreOwner(accounts[0]).call();
    if(!responseOwner){
      alert("Please switch to an owner account again");
      return;
    } else{
      let check = await this.canBeSubmitted(this.state.value);
      console.log("rr"+check);
      if (!check) {
        alert("please enter a shorter name");
        return;
      } else{
        let storeName = this.state.value;
        storeName = await this.bytesLong(storeName);
        this.MarketContract_addStore(storeName);
      }
    }
  }

  handleClick = async(_index, _bytesName, event) => {
    event.preventDefault();
    let accounts = await this.state.web3.eth.getAccounts();
    let responseOwner = await this.state.contract.methods.isStoreOwner(accounts[0]).call();
    if(!responseOwner){
      alert("Please switch to an owner account again");
      return;
    }else{
      //check if balance is zero before trying to delete
      let checkbalance = await this.state.contract.methods.balanceOfStore(accounts[0],_index + 1).call();
      console.log(checkbalance, _index)
      if(checkbalance > 0){
        alert("The store holds funds.Please withdraw them first");
      }
      else{
        this.state.contract.methods.removeStore(_bytesName, _index + 1).send({from: this.state.accounts[0]})
        .then((receipt) => {
          this.setState( {receiptAddRemoveStore: receipt.transactionHash }, this.initializeStores );
        });
      }
    }
  }

  handleClick2(_index, _bytes, _string, event){
    event.preventDefault();
    this.setState({displayState: 2, stringName: _string, bytesName: _bytes, index: _index}, this.initializeStoreItems);
  }

///--------------------------------------from here function for a specific STORE
  initializeStoreItems = async () => {
    const { contract, index } = this.state;
    let indexStore = index + 1;
    let accounts = await this.state.web3.eth.getAccounts();
    let responseOwner = await contract.methods.isStoreOwner(accounts[0]).call();
    if(!responseOwner){
      alert("Please switch to an owner account again");
      return;
    } else {
      let ipfsValue = await contract.methods.getHash(this.state.accounts[0], this.state.index + 1).call();
      var len = await contract.methods.returnLengthItemArray(accounts[0], indexStore).call();
      let arrayFinal = [];
      let arrayloop = [];
      let j = 0;
      let k;
      // to avoid overhead, we set the maximum elements returned from the contract
      // each time to be 31
      if(len != 0){
        do{
          k = j * 31;
          if(len < 31 * (j+1)){
            arrayloop = await contract.methods.returnItems(accounts[0], k, len, indexStore ).call();
          }else{
            arrayloop = await contract.methods.returnStores(accounts[0], k, k + 30, indexStore).call();
          }
          j = j + 1;
          arrayloop = [...arrayloop];
        }while(len >= 31 * j);
        let string;
        for(var i = 0; i < len; i++){
          if(arrayloop[i][2] != 0){
            string = Web3Utils.hexToUtf8(arrayloop[i]);
            arrayFinal.push({index: i, ItemName: string, BytesName: arrayloop[i]});
          }
        }
      }
      this.setState({ itemsArr: arrayFinal, valueItem: "", descriptionItem: "", quantityItem: "", priceItem: "", ipfsHash : ipfsValue});
    }
  }

  captureFile(event) {
    event.preventDefault()
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer);
    }
  }

  onSubmitIPFS = async(event) => {
    event.preventDefault();
    let accounts = await this.state.web3.eth.getAccounts();
    let responseOwner = await this.state.contract.methods.isStoreOwner(accounts[0]).call();
    if(!responseOwner){
      alert("Please switch to an owner account again");
      return;
    }else{
      ipfs.files.add(this.state.buffer, (error, result) => {
        if(error) {
          console.error(error);
          return;
        }
        console.log(result, result[0].hash)
        console.log(this.state.bytesName, this.state.accounts[0],this.state.index+1);
        this.state.contract.methods.addHash(this.state.bytesName, this.state.index + 1, result[0].hash).send({ from: this.state.accounts[0] })
        .then((receipt) => {
          return this.setState({ ipfsHash: result[0].hash, receiptAll: receipt.transactionHash });
        });
      });
    }
  }

  handleSubmitStore = async(event) => {
    event.preventDefault();
    let accounts = await this.state.web3.eth.getAccounts();
    let responseOwner = await this.state.contract.methods.isStoreOwner(accounts[0]).call();
    if(!responseOwner){
      alert("Please switch to an owner account again");
      return;
    } else{
      let check = await this.canBeSubmitted(this.state.valueItem);
      if (!check) {
        alert("please enter a shorter name");
        return;
      }else{
        if(Number(this.state.quantityItem) <= 0 || Number(this.state.priceItem) <= 0 ){
          alert("quantity or price are not valid");
          return;
        }else{
          let itemName = this.state.valueItem;
          itemName = await this.bytesLong(itemName);
          this.MarketContract_addItem(itemName, this.state.descriptionItem, this.state.quantityItem, this.state.priceItem);
        }
      }
    }
  }

  MarketContract_addItem(itemName, desc, quant, price) {
    this.state.contract.methods.addNewItem(this.state.bytesName, this.state.index + 1, itemName, desc, quant, price).send({from: this.state.accounts[0]})
    .then((receipt) => {
      this.setState( {receiptAll: receipt.transactionHash }, this.initializeStoreItems );
    });
  }

  handleModificationStore = async(event) => {
    event.preventDefault();
    console.log(this.state.index, this.state.bytesName);
    let accounts = await this.state.web3.eth.getAccounts();
    let responseOwner = await this.state.contract.methods.isStoreOwner(accounts[0]).call();
    if(!responseOwner){
      alert("Please switch to an owner account again");
      return;
    }else {
      let check = await this.canBeSubmitted(this.state.new_name);
      if (!check) {
        alert("please enter a shorter name");
        return;
      }else{
        let storeName = this.state.new_name;
        storeName = await this.bytesLong(storeName);
        this.MarketContract_modifyStore(this.state.bytesName, this.state.index, storeName, this.state.new_name);
      }
    }
  }

  MarketContract_modifyStore(_storeName, _index, _newname, _newnameString) {
    this.state.contract.methods.modifyStore(_newname, _index + 1, _storeName).send({from: this.state.accounts[0]})
    .then((receipt) => {
      return this.setState({ stringName:  _newnameString, bytesName: _newname, new_name: "", receiptChangeName: receipt.transactionHash });
    });
  }

  GoBack(){
    let curState = this.state.displayState;
    if(curState == 2){
      this.setState({displayState: 1});
    }else{
    this.setState({displayState: 2});
    }
  }

  showBalance = async(event) => {
    event.preventDefault();
    let accounts = await this.state.web3.eth.getAccounts();
    let responseOwner = await this.state.contract.methods.isStoreOwner(accounts[0]).call();
    if(!responseOwner){
      alert("Please switch to an owner account again");
      return;
    }else{
      let enable = this.state.isEnabled;
      let bal = await this.state.contract.methods.balanceOfStore(this.state.accounts[0],this.state.index + 1).call();
      if (bal.toString() == 0){
        enable = false;
        console.log("disabled");
      } else if(bal.toString() > 0){
        enable = true;
      }
      this.setState({ balance: bal.toString(), isEnabled: enable, receiptWith: "", showrec: false});
    }
  }

  withdraw = async(event) => {
    event.preventDefault();
    let accounts = await this.state.web3.eth.getAccounts();
    let responseOwner = await this.state.contract.methods.isStoreOwner(accounts[0]).call();
    if(!responseOwner){
      alert("Please switch to an owner account again");
      return;
    } else {
      this.state.contract.methods.withdraw(this.state.index + 1).send({from: this.state.accounts[0]})
      .once('receipt', function(receipt){
        console.log(receipt);
      })
      .then((receipt) => {this.setState({ isEnabled: false, receiptWith: receipt.transactionHash, showrec: true})});
    }
  }

  handleClick3 = async(_index, _bytesName, event) => {
    event.preventDefault();
    let accounts = await this.state.web3.eth.getAccounts();
    let responseOwner = await this.state.contract.methods.isStoreOwner(accounts[0]).call();
    if(!responseOwner){
      alert("Please switch to an owner account again");
      return;
    } else{
      this.state.contract.methods.removeStoreItem(this.state.bytesName, this.state.index + 1, _bytesName, _index + 1).send({from: this.state.accounts[0]})
      .then((receipt) => {
        this.setState( {receiptAll: receipt.transactionHash }, this.initializeStoreItems );
      });
    }
  }

  handleClick4(_index, _bytes, _string, event){
    event.preventDefault();
    console.log(_index, _bytes, _string);
    this.setState({displayState: 3, stringNameItem: _string, bytesNameItem: _bytes, indexItem: _index}, this.initializeItemInfo);
  }

  ////---> Item Info Functions
  initializeItemInfo = async() => {
   //fetch item data
   let accounts = await this.state.web3.eth.getAccounts();
   let responseOwner = await this.state.contract.methods.isStoreOwner(accounts[0]).call();
   if(!responseOwner){
     alert("Please switch to an owner account again");
     return;
   }else{
     var info = await this.state.contract.methods.returnItemInfo(this.state.accounts[0], this.state.index + 1, this.state.indexItem + 1).call();
     this.setState( {curDescription: info[1], initialQuantity: info[3].toString(), bought: info[3]-info[2], price: info[4].toString() });
   }
  }

  addEventListener = async() => {
    let listener = await this.state.contract.events.LogBuyItem({fromBlock: "latest"},(error, event) => {
      if(this.state.displayState == 3){
        console.log(event);
        this.detectEvent(event.returnValues[1], event.returnValues[4], event.returnValues[5]);
      } else {
        return;
      }
    });
    this.initializeStores();
  }

  detectEvent(_storeOwner, _storeIndex, _itemIndex){
    let owner = this.state.accounts[0];
    let sIndex = this.state.index +1 ;
    let iIndex = this.state.indexItem + 1;
    console.log(owner +"  "+ _storeOwner +"  "+ sIndex+"  "+ _storeIndex +"  "+ iIndex +"  "+ _itemIndex)
    if(owner == _storeOwner && sIndex == _storeIndex && iIndex == _itemIndex)
    {
      //if a new purchase is done, update
      console.log("detected");
      this.initializeItemInfo();
    }
  }
  // make function to change Item Stuff
  handleModificationItem = async(event) => {
    event.preventDefault();
    let accounts = await this.state.web3.eth.getAccounts();
    let responseOwner = await this.state.contract.methods.isStoreOwner(accounts[0]).call();
    if(!responseOwner){
      alert("Please switch to an owner account again");
      return;
    }else{
      let check = await this.canBeSubmitted(this.state.new_nameItem);
      if (!check) {
        alert("please enter a shorter name");
        return;
      }
      else{
        let itemName = this.state.new_nameItem;
        itemName = await this.bytesLong(itemName);
        this.MarketContract_modifyItem(this.state.bytesNameItem, this.state.indexItem, itemName, this.state.new_nameItem);
      }
    }
  }

  MarketContract_modifyItem(_itemName, _index, _newname, _newnameString) {
    this.state.contract.methods.modifyItemName(_newname, _index + 1, this.state.index + 1, _itemName, this.state.bytesName).send({from: this.state.accounts[0]})
    .then((receipt) => {
      this.setState( {stringNameItem:  _newnameString, bytesNameItem: _newname, new_nameItem: "", receiptItemInfo: receipt.transactionHash } );
    });
  }

  changeDesc= async(event) =>{
   event.preventDefault();
   let accounts = await this.state.web3.eth.getAccounts();
   let responseOwner = await this.state.contract.methods.isStoreOwner(accounts[0]).call();
   if(!responseOwner){
     alert("Please switch to an owner account again");
     return;
   }else{
     if( this.state.curDescription === this.state.new_desc){
       alert("the description is the same with the old one");
       return ;
     }else{
       this.state.contract.methods.modifyItemDescr(this.state.new_desc, this.state.indexItem + 1, this.state.index + 1, this.state.curDescription, this.state.bytesName, this.state.bytesNameItem).send({from: this.state.accounts[0]})
       .then((receipt) => {
         this.setState( {curDescription:  this.state.new_desc, new_desc: "", receiptItemInfo: receipt.transactionHash });
       });
     }
   }
 }

  changeQuant = async(event) =>{
    event.preventDefault();
    let accounts = await this.state.web3.eth.getAccounts();
    let responseOwner = await this.state.contract.methods.isStoreOwner(accounts[0]).call();
    if(!responseOwner){
      alert("Please switch to an owner account again");
      //return;
    }
    else if( Number(this.state.new_quant) <= 0){
      alert("please enter valid quantity");
      return ;
    }
    else if((Number(this.state.initialQuantity) - Number(this.state.bought)) == Number(this.state.new_quant)){
      alert("The quantity you want to save is the same with the current available quantity");
      return ;
    }
    else{
      this.state.contract.methods.modifyItemQuantity(this.state.new_quant, this.state.indexItem + 1, this.state.index + 1, (this.state.initialQuantity - this.state.bought), this.state.bytesName, this.state.bytesNameItem).send({from: this.state.accounts[0]})
      .then((receipt) => {
        this.setState( {initialQuantity:  this.state.new_quant, bought: 0, new_quant: "", receiptItemInfo: receipt.transactionHash });
      });
    }
  }

  changePrice = async(event) => {
    event.preventDefault();
    let accounts = await this.state.web3.eth.getAccounts();
    let responseOwner = await this.state.contract.methods.isStoreOwner(accounts[0]).call();
    if(!responseOwner){
      alert("Please switch to an owner account again");
    //  return;
    }
    else if( Number(this.state.new_price) <= 0){
      alert("please enter valid price");
    //  return ;
    }
    else if(Number(this.state.price) == Number(this.state.new_price)){
      alert("The price you want to save is the same with the current price");
  //    return ;
    }
    else{
      this.state.contract.methods.modifyItemPrice(this.state.new_price, this.state.indexItem + 1, this.state.index + 1, this.state.price, this.state.bytesName, this.state.bytesNameItem).send({from: this.state.accounts[0]})
      .then((receipt) => {this.setState({ price:  this.state.new_price, new_price: "", receiptItemInfo: receipt.transactionHash})});
    }
  }

  render() {
    const items = this.state.storesArr.map((item) =>
        <li key={item.index}>{item.StoreName}
        <button onClick={(e) => this.handleClick(item.index, item.BytesName, e)}>Delete</button>
        <button onClick={(e) => this.handleClick2(item.index, item.BytesName, item.StoreName, e)}>EnterStore</button>
        </li>
    );
    const itemsStore = this.state.itemsArr.map((item) =>
          <li key={item.index}>{item.ItemName}
          <button onClick={(e) => this.handleClick3(item.index, item.BytesName, e)}>Delete</button>
          <button onClick={(e) => this.handleClick4(item.index, item.BytesName, item.ItemName, e)}>ItemInfo</button>
          </li>);

    const display = this.state.isEnabled ? (<button onClick={(e) => this.withdraw(e)}>Withdraw</button>) : null ;
    const rec = this.state.showrec ? (<div>Receipt{this.state.receiptWith}</div>) : null ;
    const displayChangedStoreName = ((this.state.receiptChangeName == "") ? null : (<p> Your transcaction receipt is {this.state.receiptChangeName} </p>));
    const displayRecAddStore = ((this.state.receiptAddRemoveStore == "") ? null : (<p> Your transcaction receipt is {this.state.receiptAddRemoveStore} </p>));
    const recForAllActionsBelow = ((this.state.receiptAll == "") ? null : (<p> Your transcaction receipt is {this.state.receiptAll} </p>));
    const receiptState3 = ((this.state.receiptItemInfo == "") ? null : (<p> Your transcaction receipt is {this.state.receiptItemInfo} </p>));

    if(this.state.displayState == 1){
      return (
  	     <HashRouter>
         <div>
          <h2>HELLOOwner</h2>
          <p>Press link to enter store</p>
          <ul>{items}</ul>
          <div className="addStore">
            <form onSubmit={this.handleSubmit}>
            <label>
              Add Store:
              <input type="text" placeholder="Input name" value={this.state.value} name="value" onChange={this.handleChange} />
            </label>
            <button>Submit</button>
            </form>
            <p>Please mind that the name of the store can not be too long</p>
            {displayRecAddStore}
          </div>
  	    </div>
        </HashRouter>
     );
    }
    else if(this.state.displayState == 2){
      return(
        <HashRouter>
        <div>
        <button onClick={this.GoBack}>GoBack</button>
        <h2>{this.state.stringName}</h2>
        <p>Actions</p>
        <button onClick={(e) => this.showBalance(e)}>Press to check store's balance</button>{this.state.balance}{display}{rec}
        <form onSubmit={(e) => this.handleModificationStore(e)}>
        <label> ModifyName
         <input type="text" placeholder="Input new Name" value={this.state.new_name} name="new_name" onChange={this.handleChange}/>
         <button>Modify Name</button>
         </label>
        </form>
        {displayChangedStoreName}
        {recForAllActionsBelow}
        <p>Upload Image for your store</p>
        <form onSubmit={(e) => this.onSubmitIPFS(e)} >
          <input type='file' onChange={this.captureFile} />
          <input type='submit' />
        </form>
        <p>This image is stored on the Ethereum and on IPFS at<br />{this.state.ipfsHash}</p>
        <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} width="200" height="100" alt=""/>
        <div className="addItem">
         <form onSubmit={(e) => this.handleSubmitStore(e)}>
         <label>
           Add Item:
           <input type="text" placeholder="Input name" value={this.state.valueItem} name="valueItem" onChange={this.handleChange} />
           <input type="text" placeholder="Input description" value={this.state.descriptionItem} name="descriptionItem" onChange={this.handleChange} />
           <input type="text" placeholder="Input quantity" value={this.state.quantityItem} name="quantityItem" onChange={this.handleChange} />
           <input type="text" placeholder="Input price" value={this.state.priceItem} name="priceItem" onChange={this.handleChange} />
         </label>
         <button>Submit</button>
         </form>
         <p>Please mind that the name of the item can not be too long</p>
         </div>
         <p>List of items</p>
         <ul>{itemsStore}</ul>
         </div>
         </HashRouter>
      );
    }
    else{
      return (
        <HashRouter>
        <div>
        <button onClick={this.GoBack}>GoBack</button>
        <h2>Item:{this.state.stringNameItem}</h2>
        <form onSubmit={(e) => this.handleModificationItem(e)}>
        <label> ModifyName
         <input type="text" placeholder="Input new Name" value={this.state.new_nameItem} name="new_nameItem" onChange={this.handleChange}/>
         <button>Modify Name</button>
         </label>
        </form>
        </div>
        <p>ItemInfo</p>
        <div>Description: {this.state.curDescription} <br />
        <form onSubmit={(e) => this.changeDesc(e)}>
        <label>
          Set New Description:
          <input type="text" placeholder="Input new description" value={this.state.new_desc} name="new_desc" onChange={this.handleChange} />
        </label>
        <button>Submit</button>
        </form>
          Quantity: {this.state.initialQuantity} <br />
        <form onSubmit={(e) => this.changeQuant(e)}>
        <label>
          Set New Quantity:
          <input type="text" placeholder="Input new quantity" value={this.state.new_quant} name="new_quant" onChange={this.handleChange} />
        </label>
        <button>Submit</button>
        </form>
          Bought: {this.state.bought} <br />
          Remaining: {this.state.initialQuantity - this.state.bought}<br />
          Price(Wei): {this.state.price}
        <form onSubmit={(e) => this.changePrice(e)}>
        <label>
          Set New Price:
          <input type="text" placeholder="Input new price" value={this.state.new_price} name="new_price" onChange={this.handleChange} />
        </label>
        <button>Submit</button>
        </form>
        {receiptState3}
        </div>
        </HashRouter>
      );
    }
  }
}

export default Owner;
