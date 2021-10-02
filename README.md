# ETH-api

### Table of Contents

*   [next][1]
*   [message][2]
*   [db][3]
*   [Coin][4]
    *   [Parameters][5]
    *   [Parameters][6]
    *   [Parameters][7]
*   [Token][8]
    *   [Parameters][9]
    *   [Parameters][10]
*   [Create-Address][11]
    *   [Parameters][12]
*   [Contract][13]
    *   [Parameters][14]
*   [Transaction][15]
    *   [Parameters][16]
    *   [Parameters][17]
    *   [Parameters][18]
    *   [Parameters][19]
    *   [Parameters][20]
    *   [Parameters][21]
    *   [Parameters][22]
    *   [Parameters][23]
*   [Balance_USDT][24]
    *   [Parameters][25]
*   [Doge-Dash-Bitcoin-Litecoin][26]
    *   [Parameters][27]
    *   [Parameters][28]
    *   [Parameters][29]
*   [BNB_History][30]
    *   [Parameters][31]
*   [Addresses][32]
    *   [Parameters][33]
    *   [Parameters][34]

## next

catch 404 and forward to error handler

## message

Error handler, set locals, only providing error in development and render the error page

## db

Sets up connection to database

## Coin

##

/coin endpoint to check balance of a particular coin

### Parameters

*   `WalletAddress` **[string][35]** Address of the wallet to check balance of
*   `networkID` **int** Id of network according to database

Returns **[number][36]** value - Amount in wallet address or error

##

/coin/trans endpoint to transfer funds from a address to one or more address

### Parameters

*   `from` **[String][35]** Wallet address to transfer funds from
*   `value` **Int** Amount of funds to be transfered
*   `PrivateKey` **[String][35]** Private key of from address
*   `networkID` **int** Id of network according to database

Returns **[Object][37]** Result - JSON object of transaction summary

##

/coin/trans endpoint to transfer funds from a address to one or more address

### Parameters

*   `from` **[String][35]** Wallet address to transfer funds from
*   `value` **Int** Amount of funds to be transfered
*   `PrivateKey` **[String][35]** Private key of from address
*   `networkID` **int** Id of network according to database

Returns **[Object][37]** Result - JSON object of transaction summary

## Token

##

/token endpoint to check token balance of a wallet address

### Parameters

*   `Symbol` **[String][35]** token symbol to get other data from DB
*   `WalletAddress` **[String][35]** Address to check balaance from
*   `networkID` **Int** Id of network according to database

Returns **Int** Result - Token balance

##

/token endpoint to transfer token balance

### Parameters

*   `Symbol` **[String][35]** token symbol to get other data from DB
*   `to` **[String][35]** Wallet address to trasfer funds to
*   `from` **[String][35]** Wallet address to transfer funds from
*   `WalletAddress` **[String][35]** Address to check balaance from
*   `value` **Int** Amount of funds to be transfered
*   `gas` **Int** Gas limit to be used
*   `networkID` **Int** Id of network according to database

Returns **[Object][37]** Result - JSON object of transaction summary

## Create-Address

##

/crtAdd endpoint to create a new address

### Parameters

*   `user_name` **[String][35]** Name of user to store with the new account generated
*   `networkID` **Int** Id of network according to database

Returns **[Object][37]** Result - JSON object containing new account information

## Contract

##

/Contract endpoint to a new token contract on a network

### Parameters

*   `account` **[String][35]** Account address from which contract needs to be deployed
*   `abi` **[Object][37]** ABI code for the contract
*   `bytecode` **[String][35]** bytecode for the contract
*   `PrivateKey` **[String][35]** Private key of from address
*   `networkID` **Int** Id of network according to database
*   `gas` **Int** Value of gas limit
*   `gasPrice` **Int** Price of gas

Returns **[Object][37]** Result - JSON object of new contract instance

## Transaction

##

/transaction/past endpoint to get past transaction count

### Parameters

*   `WalletAddress` **[String][35]** Address to count transaction
*   `networkID` **Int** Id of network according to database

Returns **Int** Result - Number of transaction

##

/transaction/pending endpoint to get pending transaction

### Parameters

*   `networkID` **Int** Id of network according to database

Returns **[Object][37]** Result - total pending transaction

##

/transaction/hstry endpoint to get transaction history

### Parameters

*   `networkID` **Int** Id of network according to database

Returns **[Object][37]** Result - total pending transaction

##

/transaction/hstry endpoint to get incoming transaction history

### Parameters

*   `networkID` **Int** Id of network according to database

Returns **[Object][37]** Result - total pending transaction

##

/XRP/crtAdd endpoint to create a new address

### Parameters

*   `user_name` **[String][35]** Name of user to store with the new account generated
*   `networkID` **Int** Id of XRP network according to database

Returns **[Object][37]** Result - JSON object containing new account information

##

/XRP/trans endpoint to transafer crypto from one address to another for a XRP coin

### Parameters

*   `sender` **[string][35]** Address to transfer amount from
*   `reciever` **[string][35]** Address to transfer amount to
*   `secret` **[string][35]** Private key of address to tranfer crypto from
*   `amount` **int** Amount to be transferred
*   `networkID` **Int** Id of XRP network according to database

Returns **[Object][37]** Result - JSON object of transaction hash

##

/XRP/getTrans endpoint to get transaction details of a address

### Parameters

*   `address` **[String][35]** Address to get transaction details of
*   `networkID` **Int** Id of XRP network according to database

Returns **[Object][37]** Result - JSON object containing transaction details of a address

##

/XRP/accInfo endpoint to to get info about a xrp's coin address

### Parameters

*   `networkID` **Int** Id of XRP network according to database
*   `address` **[string][35]** Address to get information of

Returns **[Object][37]** Result - JSON object of containing info of coin's address

## Balance_USDT

##

/USDTbal endpoint to get balance of USDT token or any other ERC20 token(acc to Contract address)

### Parameters

*   `BLOCK_PARAMETER` **[string][35]** an integer block number, or the string "latest", "earliest" or "pending"
*   `ADDRESS` **[string][35]** Address to get balance of
*   `ContractAddress` **[string][35]** Contract address of ERC20 token of address to get balance of

Returns **[Object][37]** Result - JSON object of address's balance of given ERC2 token

## Doge-Dash-Bitcoin-Litecoin

##

/ddbl/crtAdd endpoint to create a new address and private key for a DDBL coin

### Parameters

*   `coin` **[string][35]** Specify coin (Doge, Dash, Bitcoin or Litecoin) to create address for
*   `user_name` **[string][35]** User_name to corresponding address

Returns **[Object][37]** Result - JSON object of pair of Address and its private key

##

/ddbl/trans endpoint to transafer crypto from one address to another for a DDBL coin

### Parameters

*   `coin` **[string][35]** Specify coin (Doge, Dash, Bitcoin or Litecoin) to transfer from
*   `from` **[string][35]** Address to transfer amount from
*   `to` **[string][35]** Address to transfer amount to
*   `PrivateKey` **[string][35]** Private key of address to tranfer crypto from
*   `value` **int** Amount to be transferred

Returns **[Object][37]** Result - JSON object of transaction hash

##

/ddbl/accinfo endpoint to get info about a DDBL's address

### Parameters

*   `coin` **[string][35]** Specify coin (Doge, Dash, Bitcoin or Litecoin)
*   `address` **[string][35]** Address to get information of

Returns **[Object][37]** Result - JSON object of containing info of coin's address

## BNB_History

##

/bnbhist endpoint to get transaction history for a given BNB coin address

### Parameters

*   `address` **int** Address of BNB coin to get past transactions list of

Returns **[Object][37]** Result - JSON object of list of transactions of a BNB address

## Addresses

##

/address endpoint to take addresses from transaction and store them with corresponding network_id(given) in addresses table

### Parameters

*   `networkID` **int** Id of network according to database

Returns **[Object][37]** Result - JSON object of addresses to be stored in addresses table

##

/address/bal endpoint to get balance for all stored array in addresses table according to network_id(given)

### Parameters

*   `networkID` **int** Id of network according to database

Returns **[Object][37]** Result - JSON object of addresses and their balance

[1]: #next

[2]: #message

[3]: #db

[4]: #coin

[5]: #parameters

[6]: #parameters-1

[7]: #parameters-2

[8]: #token

[9]: #parameters-3

[10]: #parameters-4

[11]: #create-address

[12]: #parameters-5

[13]: #contract

[14]: #parameters-6

[15]: #transaction

[16]: #parameters-7

[17]: #parameters-8

[18]: #parameters-9

[19]: #parameters-10

[20]: #parameters-11

[21]: #parameters-12

[22]: #parameters-13

[23]: #parameters-14

[24]: #balance_usdt

[25]: #parameters-15

[26]: #doge-dash-bitcoin-litecoin

[27]: #parameters-16

[28]: #parameters-17

[29]: #parameters-18

[30]: #bnb_history

[31]: #parameters-19

[32]: #addresses

[33]: #parameters-20

[34]: #parameters-21

[35]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[36]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[37]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object
