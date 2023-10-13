import React, { useState } from 'react';
import Web3 from 'web3';
import SimpleStorageuser from './contracts/SimpleStorageuser.json';

const Register = () => {
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // Tambah state role
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleConnectMetamask = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else {
      alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  };

  const handleRegister = async () => {
    // Dapatkan alamat akun MetaMask yang terhubung
    const accounts = await window.web3.eth.getAccounts();
    const userAddress = accounts[0];

    // Dapatkan smart contract instance berdasarkan address
    const contractAddress = '0x6A4ae500127934fE1C3247aE8A689EaD0eBAae5A'; // ganti dengan address smart contract setelah proses deploy
    const contract = new window.web3.eth.Contract(SimpleStorageuser.abi, contractAddress);

    try {
      // Kirim data pengguna ke smart contract
      await contract.methods.setUserData(password, role).send({ from: userAddress });
      setSuccessMessage('Registration successful!');
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error occurred during registration. Please try again later.');
    }
  };

  return (
    <div>
      <button onClick={handleConnectMetamask}>Connect MetaMask</button>
      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default Register;
