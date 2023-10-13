import web3 from '../web3';

const contractAddress = '0xd1F1D4652DB2836706bfC0653C691B58c87F02c7'; // Update with the deployed contract address

const abi = [
    {
        "inputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "pindahId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "userId",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "kotaTujuan",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "kelurahanTujuan",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "alamatTujuan",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "rtTujuan",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "rwTujuan",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "alasanPindah",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "tanggalPindah",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "letterNumber",
                "type": "string"
              }
            ],
            "internalType": "struct CrudPindah.Pindah",
            "name": "_pindah",
            "type": "tuple"
          }
        ],
        "name": "createPindah",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_pindahId",
            "type": "uint256"
          }
        ],
        "name": "deletePindah",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_pindahId",
            "type": "uint256"
          }
        ],
        "name": "getPindah",
        "outputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "pindahId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "userId",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "kotaTujuan",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "kelurahanTujuan",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "alamatTujuan",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "rtTujuan",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "rwTujuan",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "alasanPindah",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "tanggalPindah",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "letterNumber",
                "type": "string"
              }
            ],
            "internalType": "struct CrudPindah.Pindah",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalPindahs",
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
            "name": "_pindahId",
            "type": "uint256"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "pindahId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "userId",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "kotaTujuan",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "kelurahanTujuan",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "alamatTujuan",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "rtTujuan",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "rwTujuan",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "alasanPindah",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "tanggalPindah",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "letterNumber",
                "type": "string"
              }
            ],
            "internalType": "struct CrudPindah.Pindah",
            "name": "_updatedPindah",
            "type": "tuple"
          }
        ],
        "name": "updatePindah",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      } 
];

const contractpindah = new web3.eth.Contract(abi, contractAddress);

export default contractpindah;
