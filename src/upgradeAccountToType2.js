const Caver = require('caver-js');

const caver = new Caver('https://api.baobab.klaytn.net:8651/');

const privateKey = process.env.PRIVATE_KEY;


// AccountKeyLegacy에서 AccountKeyPublic로 계정 유형 업그레이드
async function upgradeAccountToType2(privateKey) {
  const account = caver.klay.accounts.privateKeyToAccount(privateKey);
	console.log(account)
  const publicKey = caver.klay.accounts.privateKeyToPublicKey(privateKey);
	console.log(publicKey)
	const accountUpdate = caver.klay.accounts.createAccountForUpdate(account.address, privateKey)
	console.log(accountUpdate)
  const createAccountKeyPublicTx = {
    type: 'ACCOUNT_UPDATE',
    from: account.address,
    key: accountUpdate,
    gas: "50000",
  };


  const signedTx = await caver.klay.accounts.signTransaction(createAccountKeyPublicTx, privateKey);
  const receipt = await caver.klay.sendSignedTransaction(signedTx.rawTransaction);
  console.log('Account upgraded to AccountKeyPublic:', receipt);
}

upgradeAccountToType2(privateKey);
