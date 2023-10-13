import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import SimpleStorage from './contracts/SimpleStorage.json';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [walletId, setWalletId] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        const accounts = await window.web3.eth.getAccounts();
        if (accounts.length > 0) {
          setIsWalletConnected(true);
          setWalletId(accounts[0]);
        }
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    } else {
      setIsWalletConnected(false);
      setErrorMessage('Please install MetaMask to connect.');
    }
  };

  const handleConnectMetamask = async () => {
    if (!isWalletConnected) {
      if (window.ethereum) {
        try {
          await window.ethereum.enable();
          checkWalletConnection();
        } catch (error) {
          console.error('Error connecting to wallet:', error);
        }
      } else {
        alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    }
  };

  const handleLogin = async () => {
    // Dapatkan alamat akun MetaMask yang terhubung
    const accounts = await window.web3.eth.getAccounts();
    const userAddress = accounts[0];

    // Dapatkan smart contract instance berdasarkan address
    const contractAddress = '0x7c663f921607DA5108e1dAE8eBeF8d29aCc8d9e3'; // ganti dengan address smart contract setelah proses deploy
    const contract = new window.web3.eth.Contract(SimpleStorage.abi, contractAddress);

    try {
      const userData = await contract.methods.getUserData().call({ from: userAddress });
      const storedPassword = userData[0]; // Assuming user data (password) is returned first
      const userRole = userData[1];

      if (storedPassword === password) {
        // Autentikasi berhasil, lakukan pengalihan halaman
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', userRole); // Menyimpan peran pengguna di local storage
        alert('Login successful!');
        navigate('/about');
        // Di sini Anda dapat mengarahkan ke halaman home atau melakukan tindakan lain sesuai kebutuhan aplikasi.
      } else {
        setErrorMessage('Invalid password. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error occurred during login. Please try again later.');
    }
  };

  return (
    <div>
      {isWalletConnected ? (
        <p>Connected Wallet ID: {walletId}</p>
      ) : (
        <button onClick={handleConnectMetamask}>Connect MetaMask</button>
      )}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default Login;
