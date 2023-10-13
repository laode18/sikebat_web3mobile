import web3 from '../web3';

const contractAddress = '0xaCF53D9Cb8977720Ce42BE4d9C68A93c5a650C6c'; // Update with the deployed contract address

const abi = [
    {
        "inputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "kelahiranId",
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
                "name": "namaAnak",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "tanggalLahir",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "jenisKelamin",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "anakKe",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "jamLahir",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "letterNumber",
                "type": "string"
              }
            ],
            "internalType": "struct CrudKelahiran.Kelahiran",
            "name": "_kelahiran",
            "type": "tuple"
          }
        ],
        "name": "createKelahiran",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_kelahiranId",
            "type": "uint256"
          }
        ],
        "name": "deleteKelahiran",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_kelahiranId",
            "type": "uint256"
          }
        ],
        "name": "getKelahiran",
        "outputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "kelahiranId",
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
                "name": "namaAnak",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "tanggalLahir",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "jenisKelamin",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "anakKe",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "jamLahir",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "letterNumber",
                "type": "string"
              }
            ],
            "internalType": "struct CrudKelahiran.Kelahiran",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalKelahirans",
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
            "name": "_kelahiranId",
            "type": "uint256"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "kelahiranId",
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
                "name": "namaAnak",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "tanggalLahir",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "jenisKelamin",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "anakKe",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "jamLahir",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "letterNumber",
                "type": "string"
              }
            ],
            "internalType": "struct CrudKelahiran.Kelahiran",
            "name": "_updatedKelahiran",
            "type": "tuple"
          }
        ],
        "name": "updateKelahiran",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
];

const contractkelahiran = new web3.eth.Contract(abi, contractAddress);

export default contractkelahiran;
