import web3 from '../web3';

const contractAddress = '0xBC89AE0a95a37Df5F6209C23489C0e5cb09C7879'; // Update with the deployed contract address

const abi = [
    {
        "inputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "mempunyaiusahaId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "userId",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "namaUsaha",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "jenisUsaha",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "alamatUsaha",
                "type": "string"
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
            "internalType": "struct CrudMempunyaiusaha.Mempunyaiusaha",
            "name": "_mempunyaiusaha",
            "type": "tuple"
          }
        ],
        "name": "createMempunyaiusaha",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_mempunyaiusahaId",
            "type": "uint256"
          }
        ],
        "name": "deleteMempunyaiusaha",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_mempunyaiusahaId",
            "type": "uint256"
          }
        ],
        "name": "getMempunyaiusaha",
        "outputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "mempunyaiusahaId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "userId",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "namaUsaha",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "jenisUsaha",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "alamatUsaha",
                "type": "string"
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
            "internalType": "struct CrudMempunyaiusaha.Mempunyaiusaha",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalMempunyaiusahas",
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
            "name": "_mempunyaiusahaId",
            "type": "uint256"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "mempunyaiusahaId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "userId",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "namaUsaha",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "jenisUsaha",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "alamatUsaha",
                "type": "string"
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
            "internalType": "struct CrudMempunyaiusaha.Mempunyaiusaha",
            "name": "_updatedMempunyaiusaha",
            "type": "tuple"
          }
        ],
        "name": "updateMempunyaiusaha",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }     
];

const contractmempunyaiusaha = new web3.eth.Contract(abi, contractAddress);

export default contractmempunyaiusaha;
