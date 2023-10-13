import web3 from '../web3';

const contractAddress = '0x0c2a2C7DE5E7400aFd26107934183ecb0F70c0B5'; // Update with the deployed contract address

const abi = [
    {
        "inputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "tmrsId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "userId",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "noJamkesmas",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "namaOrangtua",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "namaRs",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "letterNumber",
                "type": "string"
              }
            ],
            "internalType": "struct CrudTmrs.Tmrs",
            "name": "_tmrs",
            "type": "tuple"
          }
        ],
        "name": "createTmrs",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_tmrsId",
            "type": "uint256"
          }
        ],
        "name": "deleteTmrs",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_tmrsId",
            "type": "uint256"
          }
        ],
        "name": "getTmrs",
        "outputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "tmrsId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "userId",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "noJamkesmas",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "namaOrangtua",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "namaRs",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "letterNumber",
                "type": "string"
              }
            ],
            "internalType": "struct CrudTmrs.Tmrs",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalTmrss",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_tmrsId",
            "type": "uint256"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "tmrsId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "userId",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "noJamkesmas",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "namaOrangtua",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "namaRs",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "letterNumber",
                "type": "string"
              }
            ],
            "internalType": "struct CrudTmrs.Tmrs",
            "name": "_updatedTmrs",
            "type": "tuple"
          }
        ],
        "name": "updateTmrs",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
];

const contracttmrs = new web3.eth.Contract(abi, contractAddress);

export default contracttmrs;
