import React, { Component } from "react";
import Web3 from "web3";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";

class Manager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adminsArr: [],
      ownersArr: [],
      web3: null,
      accounts: null,
      contract: null,
      value: '',
      value2: '',
      valueAdmin: '',
      value2Admin: '',
      isPaused: null,
      receipt: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmit2 = this.handleSubmit2.bind(this);
    this.MarketContract_addOwner = this.MarketContract_addOwner.bind(this);
    this.MarketContract_removeOwner = this.MarketContract_removeOwner.bind(this);
    this.handleSubmitAdmin = this.handleSubmitAdmin.bind(this);
    this.handleSubmit2Admin = this.handleSubmit2Admin.bind(this);
    this.MarketContract_addAdmin = this.MarketContract_addAdmin.bind(this);
    this.MarketContract_removeAdmin = this.MarketContract_removeAdmin.bind(this);
    this.initializeAdmins = this.initializeAdmins.bind(this);
    this.initializeOwners = this.initializeOwners.bind(this);
    this.circuitBreaker = this.circuitBreaker.bind(this);
  }


  //--- functions to add/remove OwnersStoresArray
  componentDidMount = async () => {
    let web3 = this.props.web3;
    let accounts = await web3.eth.getAccounts();
    let instance = this.props.contract;
    let isPaused = await instance.methods.contractPaused().call();
    let listen1 = await instance.events.AddedOwner({fromBlock: "latest"},(error, event) => { console.log(event); this.initializeOwners();});
    let listen2 = await instance.events.AddedAdmin({fromBlock: "latest"}, (error, event) => { console.log(event); this.initializeAdmins(); });
    let listen3 = await instance.events.RemovedAdmin({fromBlock: "latest"},(error, event) => { console.log(event); this.initializeAdmins();});
    let listen4 = await instance.events.RemovedOwner({fromBlock: "latest"},(error, event) => { console.log(event); this.initializeOwners();});
    this.setState({ web3, accounts, contract: instance, isPaused: isPaused }, this.initializeAdmins);
  }

  //get admins
  initializeAdmins = async () => {
    const { contract } = this.state;
    let accounts = await this.state.web3.eth.getAccounts();
    let isManager = await contract.methods.owner().call();
    if(accounts[0] != isManager){
      alert("Please switch to manager account again");
      return;
    }
    var len = await contract.methods.lenAdminsArr().call();
    let array = [];
    let arrayFinal = [];
    let isActive = false;
    for(var i = 0; i < len; i++){
      array[i] = await contract.methods.adminsArray(i).call();
    }
    for(var i = 0; i < len; i++){
      var responseAdmin = await contract.methods.admins(array[i]).call();
      if(responseAdmin){
        arrayFinal.push(array[i]);
      }
    }
    var uniqueArray = [];
    for(var i=0; i < arrayFinal.length; i++){
      if(uniqueArray.indexOf(arrayFinal[i]) === -1) {
        uniqueArray.push(arrayFinal[i]);
      }
    }
    this.setState({ adminsArr: uniqueArray, valueAdmin: "", value2Admin: "" }, this.initializeOwners);
  }

  //get owners
  initializeOwners = async () => {
    const { contract } = this.state;
    let accounts = await this.state.web3.eth.getAccounts();
    let isManager = await contract.methods.owner().call();
    if(accounts[0] != isManager){
      alert("Please switch to manager account again");
      return;
    }
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
    for(var i=0; i < arrayFinal.length; i++){
      if(uniqueArray.indexOf(arrayFinal[i]) === -1) {
        uniqueArray.push(arrayFinal[i]);
      }
    }
    this.setState({ ownersArr: uniqueArray, value: "", value2: "" });
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
  }

  MarketContract_addOwner(_ownerAddress) {
    this.state.contract.methods.addOwner(_ownerAddress).send({from: this.state.accounts[0]})
    .then((receipt) => { this.setState( {receipt: receipt.transactionHash } );});
  }

  handleSubmit = async(event) => {
    event.preventDefault();
    let accounts = await this.state.web3.eth.getAccounts();
    let isManager = await this.state.contract.methods.owner().call();
    if(accounts[0] != isManager){
      alert("Please switch to manager account again");
      return;
    }
    let ownerAddress = this.state.value;
    console.log(ownerAddress);
    this.MarketContract_addOwner(ownerAddress);
  }

  MarketContract_removeOwner(_ownerAddress) {
    this.state.contract.methods.removeOwner(_ownerAddress).send({from: this.state.accounts[0]})
    .then((receipt) => { this.setState( {receipt: receipt.transactionHash } );});
  }

  handleSubmit2= async(event) =>{
    event.preventDefault();
    let accounts = await this.state.web3.eth.getAccounts();
    let isManager = await this.state.contract.methods.owner().call();
    if(accounts[0] != isManager){
      alert("Please switch to manager account again");
      return;
    }
    let ownerAddress2 = this.state.value2;
    this.MarketContract_removeOwner(ownerAddress2);
  }

  //-- admin Functions
  MarketContract_addAdmin(_adminAddress) {
    this.state.contract.methods.addAdmin(_adminAddress).send({from: this.state.accounts[0]})
    .then((receipt) => { this.setState( {receipt: receipt.transactionHash } );});
  }

  handleSubmitAdmin = async(event) => {
    event.preventDefault();
    let accounts = await this.state.web3.eth.getAccounts();
    let isManager = await this.state.contract.methods.owner().call();
    if(accounts[0] != isManager){
      alert("Please switch to manager account again");
      return;
    }
    let adminAddress = this.state.valueAdmin;
    this.MarketContract_addAdmin(adminAddress);
  }

  MarketContract_removeAdmin(_adminAddress) {
    this.state.contract.methods.removeAdmin(_adminAddress).send({from: this.state.accounts[0]})
    .then((receipt) => { this.setState( {receipt: receipt.transactionHash } );});
  }

  handleSubmit2Admin = async(event) => {
    event.preventDefault();
    let accounts = await this.state.web3.eth.getAccounts();
    let isManager = await this.state.contract.methods.owner().call();
    if(accounts[0] != isManager){
      alert("Please switch to manager account again");
      return;
    }
    let adminAddress2 = this.state.value2Admin;
    this.MarketContract_removeAdmin(adminAddress2);
  }

  circuitBreaker = async(event) => {
    event.preventDefault();
    let accounts = await this.state.web3.eth.getAccounts();
    let isManager = await this.state.contract.methods.owner().call();
    if(accounts[0] != isManager){
      alert("Please switch to manager account again");
      return;
    }
    let freeze = await this.state.contract.methods.circuitBreaker().send({from: accounts[0]})
    .then((receipt) => { this.setState( {isPaused : !this.state.isPaused, receipt: receipt.transactionHash }); });
  }

  render() {
    const items = this.state.ownersArr.map((item, key) =>
        <li key={key}>{item}</li>
    );
    const itemsAdmins = this.state.adminsArr.map((item, key) =>
        <li key={key}>{item}</li>
    );
    const isFrozen = this.state.isPaused ? <p>The contract is paused.Click to unpause</p> : <p>Click to pause contract</p>
    const displayReceipt = ((this.state.receipt == "") ? null : (<p> Your transcaction receipt is {this.state.receipt} </p>));
    return (
      <HashRouter>
      <div>
        <h2>Manager</h2>
        {displayReceipt}
        <p>The current List of Admins</p>
        <ul>{itemsAdmins}</ul>
        <div className="addAdmin">
          <form onSubmit={(e) => this.handleSubmitAdmin(e)}>
          <label>
            Add New Admin:
            <input type="text" placeholder="Input address" value={this.state.valueAdmin} name="valueAdmin" onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit"/>
          </form>
        </div>
        <div className="removeAdmin">
          <form onSubmit={(e) => this.handleSubmit2Admin(e)}>
          <label>
            Remove Admin:
            <input type="text"placeholder="Input address" name="value2Admin" value={this.state.value2Admin} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit"/>
          </form>
        </div>
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
        <p><button onClick={(e) => this.circuitBreaker(e)}>Circuit Breaker</button></p>
      </div>
	    </HashRouter>
    );
  }
}

export default Manager;
