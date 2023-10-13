import web3 from '../web3';

const contractAddress = '0xE3B946387959c4086b26B24A50Cd6c96a5591E54'; // Update with the deployed contract address

const abi = [
    {
        "inputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "skckId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "userId",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "keperluan",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "letterNumber",
                "type": "string"
              }
            ],
            "internalType": "struct CrudSkck.Skck",
            "name": "_skck",
            "type": "tuple"
          }
        ],
        "name": "createSkck",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_skckId",
            "type": "uint256"
          }
        ],
        "name": "deleteSkck",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_skckId",
            "type": "uint256"
          }
        ],
        "name": "getSkck",
        "outputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "skckId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "userId",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "keperluan",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "letterNumber",
                "type": "string"
              }
            ],
            "internalType": "struct CrudSkck.Skck",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalSkcks",
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
            "name": "_skckId",
            "type": "uint256"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "skckId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "userId",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "keperluan",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "letterNumber",
                "type": "string"
              }
            ],
            "internalType": "struct CrudSkck.Skck",
            "name": "_updatedSkck",
            "type": "tuple"
          }
        ],
        "name": "updateSkck",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }     
];

const contractskck = new web3.eth.Contract(abi, contractAddress);

export default contractskck;
