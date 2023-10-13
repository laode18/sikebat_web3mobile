/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-undef */
import React, { useState, useEffect } from 'react';
import './Login.css'; // Anda perlu membuat file CSS untuk mengatur tampilan
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Web3 from 'web3'
import SimpleStorageuser from './contracts/SimpleStorageuser.json'
import { useNavigate } from 'react-router-dom'
import {
    CCol,
    CRow,
  } from '@coreui/react'

const Loginuser = () => {
  const [showPassword, setShowPassword] = useState(false);
  
  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [walletId, setWalletId] = useState('')
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    checkWalletConnection()
    // eslint-disable-next-line no-undef
    ethereum.on('accountsChanged', handleAccountChange)
    return () => {
      // eslint-disable-next-line no-undef
      ethereum.removeListener('accountsChanged', handleAccountChange)
    }
  }, [])

  const handleAccountChange = (accounts) => {
    if (accounts.length > 0) {
      setIsWalletConnected(true)
      formatWalletId(accounts[0])
    } else {
      setIsWalletConnected(false)
      setWalletId('')
    }
  }

  const formatWalletId = (address) => {
    if (address && address.length >= 6) {
      const shortenedAddress = address.slice(0, 5) + '.........' + address.slice(-3)
      setWalletId(shortenedAddress)
    } else {
      setWalletId('')
    }
  }

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      try {
        const accounts = await window.web3.eth.getAccounts()
        if (accounts.length > 0) {
          setIsWalletConnected(true)
          formatWalletId(accounts[0])
        }
      } catch (error) {
        console.error('Error connecting to wallet:', error)
      }
    } else {
      setIsWalletConnected(false)
      setErrorMessage('Please install MetaMask to connect.')
    }
  }

  const handleConnectMetamask = async () => {
    if (!isWalletConnected && !isConnecting) {
      setIsConnecting(true);
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          setIsConnecting(false);
          checkWalletConnection();
        } catch (error) {
          console.error('Error connecting to wallet:', error);
          setIsConnecting(false);
        }
      } else {
        setIsConnecting(false);
        alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    }
  };  

  const handleLogin = async () => {
    // Ensure that MetaMask is connected before proceeding with the login
    if (!isWalletConnected) {
      alert('Please connect your wallet first.')
      return
    }

    // Dapatkan alamat akun MetaMask yang terhubung
    const accounts = await window.web3.eth.getAccounts()
    const userAddress = accounts[0]

    // Dapatkan smart contract instance berdasarkan address
    const contractAddress = '0x6A4ae500127934fE1C3247aE8A689EaD0eBAae5A'
    // const contractAddress = '0x7c663f921607DA5108e1dAE8eBeF8d29aCc8d9e3'
    const contract = new window.web3.eth.Contract(SimpleStorageuser.abi, contractAddress)

    try {
      const userData = await contract.methods.getUserData().call({ from: userAddress })
      const storedPassword = userData[0] // Assuming user data (password) is returned first
      const userRole = userData[1]

      if (storedPassword === password) {
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('userRole', userRole)
        localStorage.setItem('walletId', userAddress)
        localStorage.setItem('password', storedPassword)
        if (userRole === 'admin') {
          navigate('/dashboard') // Pengguna dengan peran admin dialihkan ke /dashboard
        } else if (userRole === 'ketua') {
          navigate('/dashboardlurah') // Pengguna dengan peran ketua dialihkan ke /register
        } else if (userRole === 'user') {
          navigate('/') // Pengguna dengan peran ketua dialihkan ke /register
        }
        alert('Login successful!')
      } else {
        setErrorMessage('Invalid password. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      setErrorMessage('Error occurred during login. Please try again later.')
    }
  }
  
  return (
    <div className="login-container">
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px' }}
      >
        <img
         className="img"
         src="/assets/logo.png"
         alt=""
         style={{ width: 150, height: 150, marginRight: '10px' }}
        />
      </div>
      <h1 style={{ color: 'white', marginBottom: '50px' }}>SIM Kelurahan</h1>
      <CRow>
      <CCol xs={12} style={{ textAlign: 'center', marginBottom: 20 }}>
        {isWalletConnected ? (
          <p style={{ fontWeight: 500, color: 'white' }}>
            <label style={{ fontWeight: 500 }}>Connected Wallet ID:</label>{' '}
            {walletId}
          </p>
        ) : (
          <button
            onClick={handleConnectMetamask}
            className={`btn ${isConnecting ? 'connecting' : ''}`}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              fontWeight: 700,
              width: 289,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 15px',
              marginLeft: '4px',
              position: 'relative',
              height: '45px',
            }}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <div className="loading-effect">
                <div className="loading-spinner" />
              </div>
            ) : (
              <>
                Connect Wallet&nbsp;&nbsp;&nbsp;&nbsp;
                <img
                  className="img"
                  src="/assets/meta.gif"
                  alt=""
                  style={{ width: 56, height: 40, position: 'absolute', right: '50px' }}
                />
              </>
            )}
          </button>
        )}
      </CCol>
    </CRow>
      <div style={{ paddingLeft: '3px', paddingRight: '12px' }} className="password-input">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FontAwesomeIcon
          icon={showPassword ? faEyeSlash : faEye}
          onClick={handleToggleShowPassword}
          className="password-icon"
        />
      </div>
      <button style={{ marginBottom: '30px', marginTop: '20px' }} onClick={handleLogin}>Login</button>
      {errorMessage && (
        <p style={{ textAlign: 'center', marginTop: 20, color: 'white' }}>{errorMessage}</p>
      )}
      <div>
        <label>Sudah memiliki akun? </label><a href='/register'>Register</a>
      </div>
    </div>
  );
};

export default Loginuser;
