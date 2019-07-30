import React, { Component } from "react";
import Web3 from "web3";
import {
  Route,
  NavLink,
  HashRouter,
  Link,
  Redirect
} from "react-router-dom";
import Web3Utils from "web3-utils";
import {
  MARKET_ABI,
  MARKET_ADDRESS
} from "./contracts/Market.js";
import getWeb3 from "./utils/getWeb3";
//import Home from "./Home";
import Admin from "./Admin";
import Owner from "./Owner";
import Guest from "./Guest";
import Manager from "./Manager";
class Main extends Component {

  //state = { storageValue: 0, web3: null, accounts: null, contract: null };
  constructor(props) {
    super(props);
    this.state = {
      storageValue: 0,
      web3: null,
      accounts: null,
      contract: null
    };

    this.whoIs = this.whoIs.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const instance = new web3.eth.Contract(MARKET_ABI, MARKET_ADDRESS);

      this.setState({ web3, accounts, contract: instance }, this.whoIs);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  whoIs = async () => {
    const { accounts, contract } = this.state;
    // Get the value from the contract to prove it worked.
    const responseAdmin = await contract.methods.admins(accounts[0]).call();
    let isManager = await contract.methods.owner().call();
    console.log(isManager);
    if(accounts[0] == isManager) {
      this.setState({ storageValue: 1 });
    } else if(responseAdmin){
      this.setState({ storageValue: 2 });
    } else{
      const responseOwner = await contract.methods.isStoreOwner(accounts[0]).call();
      if(responseOwner){
        this.setState({ storageValue: 3 });
      }else{
        // Update state with the result.
        this.setState({ storageValue: 4 });
      }
    }
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    var loginButton = ((this.state.storageValue === 1) ? (<NavLink to="/manager">Manager</NavLink>) : (this.state.storageValue === 2) ? (<NavLink to="/admin">AdminHome</NavLink>) : (this.state.storageValue === 3) ? (<NavLink to="/owner">OwnerHome</NavLink>) : (<NavLink to="/guest">GuestHome</NavLink>) );

    return (
       <HashRouter>
        <div>
          <h1>Your account: {this.state.accounts[0]}</h1>
          <h2><NavLink exact to="/">Welcome</NavLink></h2>
          <div className="fullcontent">
          <div>{loginButton}</div>
          </div>
          <div className="content">
            <Route path="/manager" render={(props) => (<Manager {...props} web3={this.state.web3}  contract={this.state.contract} />)}/>
            <Route path="/admin" render={(props) => (<Admin {...props} web3={this.state.web3}  contract={this.state.contract} />)}/>
            <Route path="/owner" render={(props) => (<Owner {...props} web3={this.state.web3} contract={this.state.contract} />)}/>
            <Route path="/guest" render={(props) => (<Guest {...props} web3={this.state.web3} accounts={this.state.accounts} contract={this.state.contract} />)}/>
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default Main
