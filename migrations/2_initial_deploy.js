const KlaytnDIDRegistry = artifacts.require('KlaytnDIDRegistry'); 

module.exports = function(deployer) {
	deployer.deploy(KlaytnDIDRegistry); 
};