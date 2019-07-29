import React, { Component } from "react";

import Web3Utils from "web3-utils";
import {
  HashRouter,
} from "react-router-dom";

class Store extends Component {

  constructor(props) {
    super(props);
    this.state = {
      itemsArr: [],
      web3: null,
      accounts: null,
      contract: null,
      stringName: '',
      bytesName: '',
      index: 0,
      value: '',
      new_name: '',
    };

    this.geti = this.geti.bind(this);
    this.MarketContract_modifyStore = this.MarketContract_modifyStore.bind(this);
    this.handleModification = this.handleModification.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.bytesLong = this.bytesLong.bind(this);
  }

  componentDidMount(){
    //let web3 = this.props.location.state.web3;
    //let accounts = this.props.accounts;
    //let instance = this.props.contract;
    //console.log(accounts);
    //let stringName = this.props.storeName;
    //let bytesName = this.props.bytesName;
    //let index = this.props.index;
    //this.setState({ web3, accounts, contract: instance, stringName, bytesName, index }, this.geti);
    //const { fromNotifications } = this.props.location.state.web3;
    //console.log(this.props);
    console.log(this.props);
    //let accounts = this.props.accounts;
    //let instance = this.props.contract;
    //console.log(accounts);
    //let stringName = this.props.storeName;
    //let bytesName = this.props.bytesName;
    //let index = this.props.index;
    //this.setState({ web3, accounts, contract: instance, stringName, bytesName, index }, this.geti);
  }

  //renders items
  geti = async () => {
    console.log("getitems");
    const { accounts, contract, index } = this.state;
    let indexStore = index + 1;
    var len = await contract.methods.returnLengthItemArray(accounts[0], indexStore).call();
    let arrayFinal = [];
    let arrayloop = [];
    let j=0;
    let k;
    if(len!=0){
      do{
        k=j*31;
        if(len<31*(j+1)){
          arrayloop = await contract.methods.returnItems(accounts[0], k, len, indexStore ).call();
          console.log(len);
        }
        else{
          arrayloop = await contract.methods.returnStores(accounts[0], k, k+30, indexStore).call();
        }
        j=j+1;
        arrayloop = [...arrayloop];
        console.log(arrayloop);
      }while(len>=31*j);
    //arrayloop[i][3] we need 3 because the frst two are 0x
    console.log(arrayloop[0][3]);
    let string;
      for(var i = 0; i < len; i++){
        if(arrayloop[i][3] !=0 ){
          console.log(arrayloop[i]);
          string = Web3Utils.hexToUtf8(arrayloop[i]);
          console.log("the stingitem value is"+ string);
          arrayFinal.push({index: i, ItemName: string, BytesName: arrayloop[i]});
        }
      }
    }
    this.setState({ itemsArr: arrayFinal });
  }

  handleChange(event) {
    //let attribute = event.target.name;
    console.log(event.target.name + "dd"+ event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  }

  MarketContract_modifyStore(_storeName, _index, _newname, _newnameString) {
    console.log("jj"+ this.state.accounts[0]);
    this.state.contract.methods.modifyStore(_newname, _index+1, _storeName).send({from: this.state.accounts[0]})
    .once('transactionHash', function(hash){ console.log(hash); })
    .once('receipt', function(receipt){
      console.log(receipt);
    })
    .then(() => {this.setState({ stringName:  _newnameString, bytesName: _newname})});
  }

  canBeSubmitted = async(string) => {
    //const string = this.state.value;
    let bytes = Web3Utils.asciiToHex(string);
    console.log(bytes);
    if(bytes.length<=64){
      return true;
    }
    return false;
  }

  bytesLong = async(_storeName) => {
    console.log("hi");
    let length = Web3Utils.asciiToHex(_storeName).length;
    let bytes = Web3Utils.asciiToHex(_storeName);
    console.log(length);
    if(length < 66){
      let differ = 66 - length;
      for(var i = 0; i < differ; i++){
        console.log("mpika");
        bytes = bytes.concat(0);
      }
    }
    console.log(bytes);
    if(bytes.length == 66){
      console.log("ready");
    }
    else{
      console.log("error");
    }
    return bytes;
  }

  handleModification = async(_index, _bytesName, _newname, event) => {
    event.preventDefault();
    console.log(_index, _bytesName);
    let check = await this.canBeSubmitted(_newname);
    console.log("rree"+check);
    if (!check) {
      //event.preventDefault();
      console.log("check failed");
      alert("please enter a shorter name");
      return;
    }
    else{
      let storeName = this.state.new_name;
      //event.preventDefault();
      storeName = await this.bytesLong(storeName);
      console.log("return"+storeName);
      this.MarketContract_modifyStore(_bytesName, _index, storeName, _newname);
    }
  }

  render() {

    const items = this.state.itemsArr.map((item) =>
          <li key={item.index}>{item.ItemName}</li>);


    return (
      <HashRouter>
      <div>
       <h2>STORE{this.state.stringName}</h2>
       <p>List of actions</p>
       <form onSubmit={(e) => this.handleModification(this.state.index, this.state.BytesName, this.state.new_name, e)}>
         <button>Modify</button>
         <input type="text" placeholder="Input new Name" value={this.state.new_name} name="new_name" onChange={this.handleChange}/>
       </form>
       <p>List of items</p>
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
       </div>
     </div>
     </HashRouter>
    );
  }
}

export default Store;
