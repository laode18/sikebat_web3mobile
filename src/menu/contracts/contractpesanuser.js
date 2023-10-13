/* eslint-disable prettier/prettier */
import web3 from './web3';

const contractAddress = '0xccA0796fa459c9b0377E9348A489FAC089eD8E84'; // Update with the deployed contract address

const abi = [
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "pesanuserId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "userId",
            "type": "string"
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
        "internalType": "struct CrudPesanuser.Pesanuser",
        "name": "_pesanuser",
        "type": "tuple"
      }
    ],
    "name": "createPesanuser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_pesanuserId",
        "type": "uint256"
      }
    ],
    "name": "deletePesanuser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_pesanuserId",
        "type": "uint256"
      }
    ],
    "name": "getPesanuser",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "pesanuserId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "userId",
            "type": "string"
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
        "internalType": "struct CrudPesanuser.Pesanuser",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalPesanusers",
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
        "name": "_pesanuserId",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "pesanuserId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "userId",
            "type": "string"
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
        "internalType": "struct CrudPesanuser.Pesanuser",
        "name": "_updatedPesanuser",
        "type": "tuple"
      }
    ],
    "name": "updatePesanuser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const contractpesanuser = new web3.eth.Contract(abi, contractAddress);

export default contractpesanuser;
