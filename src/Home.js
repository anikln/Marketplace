import React, { Component } from "react";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";

class Home extends Component {
  render() {
    return (
	 <HashRouter>
      <div>
        <p>Please press the link below to explore the site</p>
	</div>
	 </HashRouter>

    );
  }
}

export default Home;
