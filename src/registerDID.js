const Caver = require('caver-js');
const { config } = require('dotenv');
const KlaytnDIDRegistry = require('../build/contracts/KlaytnDIDRegistry.json');

const caver = new Caver('https://api.baobab.klaytn.net:8651/');
const privateKey = process.env.PRIVATE_KEY;
const account = caver.klay.accounts.privateKeyToAccount(privateKey);
const registry = new caver.contract(KlaytnDIDRegistry.abi, KlaytnDIDRegistry.networks['1001'].address);

async function getPublicKeyForAddress(address) {
	const account = await caver.klay.getAccount(address);

	if (!account) {
			return null;
	}

	// Check if the account key is of type AccountKeyPublic
	if (account.account.key.keyType !== 2) {
			return null;
	}

	// Extract the public key from the AccountKeyPublic object
	const publicKeyForRPC = account.account.key;
	const publicKey = publicKeyForRPC.x + publicKeyForRPC.y;
	return publicKey;
}

// DID 등록
async function registerDID() {
  const did = 'did:klaytn:baobab:0xA738931B9Dd4019D282D9cf368644fEc52e9ec58';
  const publicKey = await getPublicKeyForAddress('0xA738931B9Dd4019D282D9cf368644fEc52e9ec58');
  const didDocument = {
    '@context': 'https://www.w3.org/ns/did/v1',
    id: did,
    verificationMethod: [
      {
        id: `${did}#controller`,
        type: 'EcdsaSecp256k1VerificationKey2019',
        controller: did,
        publicKeyHex: publicKey,
      },
    ],
    authentication: [`${did}#controller`],
    // service: [], // Add service endpoints if necessary
  };


  // Convert the didDocument object to a JSON string
  const didDocumentString = JSON.stringify(didDocument);

  const tx = registry.methods.setDIDDocument("0xA738931B9Dd4019D282D9cf368644fEc52e9ec58", didDocumentString);
	
  const createTx = {
    type: 'SMART_CONTRACT_EXECUTION',
    from: account.address,
    to: KlaytnDIDRegistry.networks['1001'].address,
    input: tx.encodeABI(),
    gas: '600000',
    value: '0x0',
  };

  const signedTx = await caver.klay.accounts.signTransaction(createTx, privateKey);
	console.log(signedTx)
  const receipt = await caver.klay.sendSignedTransaction(signedTx.rawTransaction);
  console.log('DID registered:', receipt);

  // 등록된 DID 확인
  const result = await registry.methods.getDIDDocument('0xA738931B9Dd4019D282D9cf368644fEc52e9ec58').call();
  console.log(result);
}

registerDID();
