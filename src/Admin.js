import React, { Component } from "react";
import Web3 from "web3";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";

class Admin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ownersArr: [],
      web3: null,
      accounts: null,
      contract: null,
      value: '',
      value2: '',
      isPaused: false,
      receipt: ""
    };
    this.initializeOwners = this.initializeOwners.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmit2 = this.handleSubmit2.bind(this);
    this.MarketContract_addOwner = this.MarketContract_addOwner.bind(this);
    this.MarketContract_removeOwner = this.MarketContract_removeOwner.bind(this);

  }

  componentDidMount = async () => {
    let web3 = this.props.web3;
    let accounts = await web3.eth.getAccounts();
    let instance = this.props.contract;
    let isPaused = await instance.methods.contractPaused().call();
    let listen1 = await instance.events.AddedOwner({fromBlock: "latest"},(error, event) => { console.log(event); this.initializeOwners();});
    let listen2 = await instance.events.RemovedOwner({fromBlock: "latest"},(error, event) => { console.log(event); this.initializeOwners();});
    this.setState({ web3, accounts, contract: instance, isPaused: isPaused }, this.initializeOwners);
  }

  initializeOwners = async () => {
    const { contract } = this.state;
    let accounts = await this.state.web3.eth.getAccounts();
    let isAdmin = await contract.methods.admins(accounts[0]).call();
    if(!isAdmin){
      alert("Please switch to manager account again");
      return;
    }else {
      var len = await contract.methods.lenOwnersArr().call();
      let array = [];
      let arrayFinal = [];
      let isActive = false;
      for(var i = 0; i < len; i++){
        array[i]= await contract.methods.storeOwners(i).call();
      }
      for(var i = 0; i < len; i++){
        isActive = await contract.methods.isStoreOwner(array[i]).call();
        if(isActive){
          arrayFinal.push(array[i]);
        }
      }
      var uniqueArray = [];
      for(var i = 0; i < arrayFinal.length; i++){
        if(uniqueArray.indexOf(arrayFinal[i]) === -1) {
          uniqueArray.push(arrayFinal[i]);
        }
      }
      this.setState({ ownersArr: uniqueArray, value: '', value2: '' });
    }
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
  }

  MarketContract_addOwner(_ownerAddress) {
    this.state.contract.methods.addOwner(_ownerAddress).send({from: this.state.accounts[0]})
    .then((receipt) => { this.setState({ receipt: receipt.transactionHash }); });
  }

  handleSubmit= async(event) => {
    event.preventDefault();
    let accounts = await this.state.web3.eth.getAccounts();
    let isAdmin = await this.state.contract.methods.admins(accounts[0]).call();
    if(!isAdmin){
      alert("Please switch to manager account again");
      return;
    }else{
      let ownerAddress = this.state.value;
      this.MarketContract_addOwner(ownerAddress);
    }
  }

  MarketContract_removeOwner(_ownerAddress) {
    this.state.contract.methods.removeOwner(_ownerAddress).send({from: this.state.accounts[0]})
    .then((receipt) => { this.setState( {receipt: receipt.transactionHash } );});
  }

  handleSubmit2 = async(event) => {
    event.preventDefault();
    let accounts = await this.state.web3.eth.getAccounts();
    let isAdmin = await this.state.contract.methods.admins(accounts[0]).call();
    if(!isAdmin){
      alert("Please switch to manager account again");
      return;
    }else{
      let ownerAddress2 = this.state.value2;
      this.MarketContract_removeOwner(ownerAddress2);
    }
  }

  render() {
    const items = this.state.ownersArr.map((item, key) =>
        <li key={key}>{item}</li>
    );
    const isFrozen = this.state.isPaused ? <p>The contract is paused</p> : <p>The contract is not paused</p>;
    const displayReceipt = ((this.state.receipt == "") ? null : (<p> Your transcaction receipt is {this.state.receipt} </p>));
    return (
      <HashRouter>
      <div>
        <h2>Admin</h2>
        {displayReceipt}
        <p>The current List of Owners</p>
        <ul>{items}</ul>
        <div className="addOwner">
          <form onSubmit={(e) => this.handleSubmit(e)}>
          <label>
            Add Store Owner:
            <input type="text" placeholder="Input address" value={this.state.value} name="value" onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit"/>
          </form>
        </div>
        <div className="removeOwner">
          <form onSubmit={(e) => this.handleSubmit2(e)}>
          <label>
            Remove Store Owner:
            <input type="text"placeholder="Input address" name="value2" value={this.state.value2} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit"/>
          </form>
        </div>
        {isFrozen}
      </div>
	    </HashRouter>
    );
  }
}

export default Admin;
