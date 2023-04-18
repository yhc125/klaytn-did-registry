// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract KlaytnDIDRegistry {
    mapping(address => string) private didDocuments;
		mapping(address => bool) public deactivated;

    event DIDAttributeChanged(
        address indexed identity,
        bytes32 name,
        bytes value,
        uint256 updatedAt
    );

    function getDIDDocument(address identity)
        public
        view
        returns (string memory)
    {
        return didDocuments[identity];
    }

    function setDIDDocument(address identity, string memory didDocument)
        public
    {
        require(msg.sender == identity, "Not authorized to update DID document");
        didDocuments[identity] = didDocument;
        emit DIDAttributeChanged(identity, "DIDDocument", bytes(didDocument), block.timestamp);
    }

		function deactivate(address didAddress) public {
        require(msg.sender == didAddress, "Only the DID owner can deactivate the DID");
        deactivated[didAddress] = true;
    }

    function isDeactivated(address didAddress) public view returns (bool) {
        return deactivated[didAddress];
    }
}
