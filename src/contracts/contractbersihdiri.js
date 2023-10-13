import web3 from '../web3';

const contractAddress = '0xcB528aba1Ebe0B9dED27E7267931260Ba29FC235'; // Update with the deployed contract address

const abi = [
    {
        "inputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "bersihdiriId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "userId",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "namaAyah",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "namaIbu",
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
            "internalType": "struct CrudBersihdiri.Bersihdiri",
            "name": "_bersihdiri",
            "type": "tuple"
          }
        ],
        "name": "createBersihdiri",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_bersihdiriId",
            "type": "uint256"
          }
        ],
        "name": "deleteBersihdiri",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_bersihdiriId",
            "type": "uint256"
          }
        ],
        "name": "getBersihdiri",
        "outputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "bersihdiriId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "userId",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "namaAyah",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "namaIbu",
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
            "internalType": "struct CrudBersihdiri.Bersihdiri",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalBersihdiris",
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
            "name": "_bersihdiriId",
            "type": "uint256"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "bersihdiriId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "userId",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "namaAyah",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "namaIbu",
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
            "internalType": "struct CrudBersihdiri.Bersihdiri",
            "name": "_updatedBersihdiri",
            "type": "tuple"
          }
        ],
        "name": "updateBersihdiri",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
];

const contractbersihdiri = new web3.eth.Contract(abi, contractAddress);

export default contractbersihdiri;
