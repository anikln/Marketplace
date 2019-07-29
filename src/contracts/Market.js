export const MARKET_ADDRESS = '0x52cfb2A1C6FABf9463E4110c3AAb27f053053151'

export const MARKET_ABI = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "storeOwner",
    "outputs": [
      {
        "name": "isActive",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "admins",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "storeOwners",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "refundBalance",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "contractPaused",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "isOwner",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "adminsArray",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "reservedBalance",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "newAdmin",
        "type": "address"
      }
    ],
    "name": "AddedAdmin",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "removedAdmin",
        "type": "address"
      }
    ],
    "name": "RemovedAdmin",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "newOwner",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "admin",
        "type": "address"
      }
    ],
    "name": "AddedOwner",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "removedOwner",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "admin",
        "type": "address"
      }
    ],
    "name": "RemovedOwner",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "storeName",
        "type": "bytes32"
      }
    ],
    "name": "AddedNewStore",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "removedStoreName",
        "type": "bytes32"
      }
    ],
    "name": "RemovedStore",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "storeIndex",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "itemName",
        "type": "bytes32"
      }
    ],
    "name": "AddedNewStoreItem",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "storeIndex",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "removedStoreItem",
        "type": "bytes32"
      }
    ],
    "name": "RemovedStoreItem",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "storeOwner",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "oldName",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "name": "newName",
        "type": "bytes32"
      }
    ],
    "name": "ModifyStore",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "storeOwner",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "oldName",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "name": "newName",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "ModifyItemName",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "storeOwner",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "oldDescr",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "newDesc",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "ModifyItemDescr",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "storeOwner",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "oldQuant",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "newQuant",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "ModifyItemQuantity",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "storeOwner",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "oldPrice",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "newPrice",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "ModifyItemPrice",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "buyer",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "storeOwner",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "itemName",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "name": "numberItems",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "storeIndex",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "itemIndex",
        "type": "uint256"
      }
    ],
    "name": "LogBuyItem",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "storeName",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Withdraw",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "storeOwner",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "byer",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "storeIndex",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "itemIndex",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "PurchaseFulfillment",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "customer",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Refund",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "paused",
        "type": "bool"
      }
    ],
    "name": "Paused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "circuitBreaker",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_newAdmin",
        "type": "address"
      }
    ],
    "name": "addAdmin",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_toRemove",
        "type": "address"
      }
    ],
    "name": "removeAdmin",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_newOwner",
        "type": "address"
      }
    ],
    "name": "addOwner",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_toRemove",
        "type": "address"
      }
    ],
    "name": "removeOwner",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_storeName",
        "type": "bytes32"
      }
    ],
    "name": "addNewStore",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_name",
        "type": "bytes32"
      },
      {
        "name": "_indexStore",
        "type": "uint256"
      },
      {
        "name": "_ipfsHash",
        "type": "string"
      }
    ],
    "name": "addHash",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_storeName",
        "type": "bytes32"
      },
      {
        "name": "_indexToDelete",
        "type": "uint256"
      }
    ],
    "name": "removeStore",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_storeName",
        "type": "bytes32"
      },
      {
        "name": "_index",
        "type": "uint256"
      },
      {
        "name": "_itemName",
        "type": "bytes32"
      },
      {
        "name": "_description",
        "type": "string"
      },
      {
        "name": "_quantity",
        "type": "uint256"
      },
      {
        "name": "_price",
        "type": "uint256"
      }
    ],
    "name": "addNewItem",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_storeName",
        "type": "bytes32"
      },
      {
        "name": "_index",
        "type": "uint256"
      },
      {
        "name": "_itemName",
        "type": "bytes32"
      },
      {
        "name": "_indexToDelete",
        "type": "uint256"
      }
    ],
    "name": "removeStoreItem",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_name",
        "type": "bytes32"
      },
      {
        "name": "_indexStore",
        "type": "uint256"
      },
      {
        "name": "_oldName",
        "type": "bytes32"
      }
    ],
    "name": "modifyStore",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_name",
        "type": "bytes32"
      },
      {
        "name": "_itemIndex",
        "type": "uint256"
      },
      {
        "name": "_indexStore",
        "type": "uint256"
      },
      {
        "name": "_oldName",
        "type": "bytes32"
      },
      {
        "name": "_storeName",
        "type": "bytes32"
      }
    ],
    "name": "modifyItemName",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_descr",
        "type": "string"
      },
      {
        "name": "_itemIndex",
        "type": "uint256"
      },
      {
        "name": "_indexStore",
        "type": "uint256"
      },
      {
        "name": "_oldDescr",
        "type": "string"
      },
      {
        "name": "_storeName",
        "type": "bytes32"
      },
      {
        "name": "_itemName",
        "type": "bytes32"
      }
    ],
    "name": "modifyItemDescr",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_quantity",
        "type": "uint256"
      },
      {
        "name": "_itemIndex",
        "type": "uint256"
      },
      {
        "name": "_indexStore",
        "type": "uint256"
      },
      {
        "name": "_oldQuantity",
        "type": "uint256"
      },
      {
        "name": "_storeName",
        "type": "bytes32"
      },
      {
        "name": "_itemName",
        "type": "bytes32"
      }
    ],
    "name": "modifyItemQuantity",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_price",
        "type": "uint256"
      },
      {
        "name": "_itemIndex",
        "type": "uint256"
      },
      {
        "name": "_indexStore",
        "type": "uint256"
      },
      {
        "name": "_oldPrice",
        "type": "uint256"
      },
      {
        "name": "_storeName",
        "type": "bytes32"
      },
      {
        "name": "_itemName",
        "type": "bytes32"
      }
    ],
    "name": "modifyItemPrice",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_storeOwner",
        "type": "address"
      },
      {
        "name": "_indexStore",
        "type": "uint256"
      },
      {
        "name": "_itemIndex",
        "type": "uint256"
      },
      {
        "name": "numberOfItems",
        "type": "uint256"
      },
      {
        "name": "_storeName",
        "type": "bytes32"
      },
      {
        "name": "_itemName",
        "type": "bytes32"
      }
    ],
    "name": "purchase",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_storeOwner",
        "type": "address"
      },
      {
        "name": "_storeIndex",
        "type": "uint256"
      },
      {
        "name": "_itemIndex",
        "type": "uint256"
      },
      {
        "name": "_amountToRelease",
        "type": "uint256"
      },
      {
        "name": "_storeName",
        "type": "bytes32"
      },
      {
        "name": "_itemName",
        "type": "bytes32"
      }
    ],
    "name": "releaseFunds",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "getRefund",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_indexStore",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "lenAdminsArr",
    "outputs": [
      {
        "name": "_length",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "lenOwnersArr",
    "outputs": [
      {
        "name": "_length",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "isStoreOwner",
    "outputs": [
      {
        "name": "_answer",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_storeOwner",
        "type": "address"
      },
      {
        "name": "_indexStore",
        "type": "uint256"
      }
    ],
    "name": "getHash",
    "outputs": [
      {
        "name": "ipfshash",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_storeOwner",
        "type": "address"
      },
      {
        "name": "startIndex",
        "type": "uint256"
      },
      {
        "name": "endIndex",
        "type": "uint256"
      }
    ],
    "name": "returnStores",
    "outputs": [
      {
        "name": "_arrayToReturn",
        "type": "bytes32[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_storeOwner",
        "type": "address"
      },
      {
        "name": "startIndex",
        "type": "uint256"
      },
      {
        "name": "endIndex",
        "type": "uint256"
      },
      {
        "name": "_indexStore",
        "type": "uint256"
      }
    ],
    "name": "returnItems",
    "outputs": [
      {
        "name": "_arrayOfItems",
        "type": "bytes32[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_storeOwner",
        "type": "address"
      },
      {
        "name": "_indexStore",
        "type": "uint256"
      },
      {
        "name": "_itemIndex",
        "type": "uint256"
      }
    ],
    "name": "returnItemInfo",
    "outputs": [
      {
        "name": "name",
        "type": "bytes32"
      },
      {
        "name": "desc",
        "type": "string"
      },
      {
        "name": "quantity",
        "type": "uint256"
      },
      {
        "name": "inquant",
        "type": "uint256"
      },
      {
        "name": "price",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_storeOwner",
        "type": "address"
      }
    ],
    "name": "returnLengthStoreArray",
    "outputs": [
      {
        "name": "_length",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_storeOwner",
        "type": "address"
      },
      {
        "name": "_indexStore",
        "type": "uint256"
      }
    ],
    "name": "returnLengthItemArray",
    "outputs": [
      {
        "name": "_length",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "owner",
        "type": "address"
      },
      {
        "name": "_indexStore",
        "type": "uint256"
      }
    ],
    "name": "balanceOfStore",
    "outputs": [
      {
        "name": "_balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
]
