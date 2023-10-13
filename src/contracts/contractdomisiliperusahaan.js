import web3 from '../web3';

const contractAddress = '0xAbBF264Db07408653C5DcC85a0467961c965Fa64'; // Update with the deployed contract address

const abi = [
    {
        "inputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "domisiliperusahaanId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "userId",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "namaPerusahaan",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "jenisPerusahaan",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "jamKerja",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "alamatPerusahaan",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "aktaNotaris",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "letterNumber",
                "type": "string"
              }
            ],
            "internalType": "struct CrudDomisiliperusahaan.Domisiliperusahaan",
            "name": "_domisiliperusahaan",
            "type": "tuple"
          }
        ],
        "name": "createDomisiliperusahaan",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_domisiliperusahaanId",
            "type": "uint256"
          }
        ],
        "name": "deleteDomisiliperusahaan",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_domisiliperusahaanId",
            "type": "uint256"
          }
        ],
        "name": "getDomisiliperusahaan",
        "outputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "domisiliperusahaanId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "userId",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "namaPerusahaan",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "jenisPerusahaan",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "jamKerja",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "alamatPerusahaan",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "aktaNotaris",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "letterNumber",
                "type": "string"
              }
            ],
            "internalType": "struct CrudDomisiliperusahaan.Domisiliperusahaan",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalDomisiliperusahaans",
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
            "name": "_domisiliperusahaanId",
            "type": "uint256"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "domisiliperusahaanId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "userId",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "namaPerusahaan",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "jenisPerusahaan",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "jamKerja",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "alamatPerusahaan",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "aktaNotaris",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "letterNumber",
                "type": "string"
              }
            ],
            "internalType": "struct CrudDomisiliperusahaan.Domisiliperusahaan",
            "name": "_updatedDomisiliperusahaan",
            "type": "tuple"
          }
        ],
        "name": "updateDomisiliperusahaan",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }        
];

const contractdomisiliperusahaan = new web3.eth.Contract(abi, contractAddress);

export default contractdomisiliperusahaan;
