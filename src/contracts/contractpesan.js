import web3 from '../web3';

const contractAddress = '0xB9fce59f9Ed3B02a9165a59B2B7F4464B6D76a01'; // Update with the deployed contract address

const abi = [
    {
        "inputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "pesanId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "userId",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "tanggal",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "isiPesan",
                "type": "string"
              }
            ],
            "internalType": "struct CrudPesan.Pesan",
            "name": "_pesan",
            "type": "tuple"
          }
        ],
        "name": "createPesan",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_pesanId",
            "type": "uint256"
          }
        ],
        "name": "deletePesan",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_pesanId",
            "type": "uint256"
          }
        ],
        "name": "getPesan",
        "outputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "pesanId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "userId",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "tanggal",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "isiPesan",
                "type": "string"
              }
            ],
            "internalType": "struct CrudPesan.Pesan",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalPesans",
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
            "name": "_pesanId",
            "type": "uint256"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "pesanId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "userId",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "tanggal",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "isiPesan",
                "type": "string"
              }
            ],
            "internalType": "struct CrudPesan.Pesan",
            "name": "_updatedPesan",
            "type": "tuple"
          }
        ],
        "name": "updatePesan",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
];

const contractpesan = new web3.eth.Contract(abi, contractAddress);

export default contractpesan;
