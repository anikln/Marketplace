var Market = artifacts.require("./Market.sol");
var Registry = artifacts.require("./Registry.sol");

module.exports = function(deployer) {
  deployer.deploy(Registry);
  deployer.deploy(Market);
};
