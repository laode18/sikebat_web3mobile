/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import './Register.css'; // Anda perlu membuat file CSS untuk mengatur tampilan
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Web3 from 'web3'
import { useNavigate } from 'react-router-dom'
import {
    CCol,
    CRow,
  } from '@coreui/react'
  import withAuth from 'src/authMiddleware'
  import contract from './contracts/contract'

function Registernext() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({});
  const [editingUser, setEditingUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const web3 = new Web3(window.ethereum);
  const [isUsernameValid, setIsUsernameValid] = useState(true);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  
  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [username, setUsername] = useState('')
  const [nik, setNik] = useState('')
  const [kkNumber, setKknumber] = useState('')
  const [fullname, setFullname] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [gender, setGender] = useState('')
  const [religion, setReligion] = useState('')
  const [nationality, setNationality] = useState('')
  const [educationStatus, setEducationstatus] = useState('')
  const [maritalStatus, setMaritalstatus] = useState('')
  const [occupation, setOccupation] = useState('')
  const [alamat, setAlamat] = useState('')
  const [passwords, setPassword] = useState('')
  const walletId = localStorage.getItem('walletId')
  const password = localStorage.getItem('password')
  const [errorMessage, setErrorMessage] = useState('')
  const [walletIds, setWalletId] = useState('')
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
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const createUser = async () => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();

      const usernameExists = users.some(user => user.username === newUser.username);
      if (usernameExists) {
        console.error("Username already exists");
        alert("Username already exists");
        setIsLoading(false);
        return;
      }

      const userCount = await contract.methods.totalUsers().call();
      const userId = parseInt(userCount) + 1;
      const userWithId = { ...newUser, userId: userId.toString(), walletId: walletId.toString(), password: password.toString() };
      await contract.methods.createUser(userWithId).send({ from: accounts[0] });
      setNewUser({});
      alert('Data Berhasil Disimpan!')
      window.location.href = '/';
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <><div className="login-container" style={{ marginTop: '120px' }}>
          <div
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px' }}
          >
              <img
                  className="img"
                  src="/assets/logo.png"
                  alt=""
                  style={{ width: 100, height: 100, marginRight: '10px' }} />
          </div>
          <h3 style={{ color: 'white', marginBottom: '50px' }}>Isi Biodata</h3>
          <div style={{ paddingLeft: '3px', paddingRight: '12px', marginBottom: '10px' }} className="password-input">
              <input
                  type={'text'}
                  placeholder="Wallet ID"
                  value={walletId}
                  readOnly
                  onChange={(e) => setWalletId(e.target.value)} />
          </div>
          <div style={{ paddingLeft: '3px', paddingRight: '12px', marginBottom: '10px' }} className="password-input">
              <input
                  type={'password'}
                  placeholder="Password"
                  value={password}
                  readOnly
                  onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div style={{ paddingLeft: '3px', paddingRight: '12px', marginBottom: '10px' }} className="password-input">
              <input
                  type="text" placeholder='Username' name="username" value={newUser.username || ''} onChange={handleInputChange}
                />
          </div>
          <div style={{ paddingLeft: '3px', paddingRight: '12px', marginBottom: '10px' }} className="password-input">
              <input
                  type="text" placeholder='NIK' name="nik" value={newUser.nik || ''} onChange={handleInputChange}
                />
          </div>
          <div style={{ paddingLeft: '3px', paddingRight: '12px', marginBottom: '10px' }} className="password-input">
              <input
                  placeholder="Nomor KK"
                  type="text" name="kkNumber" value={newUser.kkNumber || ''} onChange={handleInputChange}
                />
          </div>
          <div style={{ paddingLeft: '3px', paddingRight: '12px', marginBottom: '10px' }} className="password-input">
              <input
                  placeholder="Nama Lengkap"
                  type="text" name="fullName" value={newUser.fullName || ''} onChange={handleInputChange}
                />
          </div>
          <div style={{ paddingLeft: '3px', paddingRight: '12px', marginBottom: '10px' }} className="password-input">
              <input
                  placeholder="Tanggal Lahir"
                  type="text" name="birthDate" value={newUser.birthDate || ''} onChange={handleInputChange}
                />
          </div>
          <div style={{ paddingLeft: '3px', paddingRight: '12px', marginBottom: '10px' }} className="password-input">
              <input
                  placeholder="Jenis Kelamin"
                  type="text" name="gender" value={newUser.gender || ''} onChange={handleInputChange}
                />
          </div>
          <div style={{ paddingLeft: '3px', paddingRight: '12px', marginBottom: '10px' }} className="password-input">
              <input
                  placeholder="Agama"
                  type="text" name="religion" value={newUser.religion || ''} onChange={handleInputChange}
                />
          </div>
          <div style={{ paddingLeft: '3px', paddingRight: '12px', marginBottom: '10px' }} className="password-input">
              <input
                  placeholder="Kewarganegaraan"
                  type="text" name="nationality" value={newUser.nationality || ''} onChange={handleInputChange}
                />
          </div>
          <div style={{ paddingLeft: '3px', paddingRight: '12px', marginBottom: '10px' }} className="password-input">
              <input
                  placeholder="Status Pendidikan"
                  name="educationStatus" value={newUser.educationStatus || ''} onChange={handleInputChange}
                />
          </div>
          <div style={{ paddingLeft: '3px', paddingRight: '12px', marginBottom: '10px' }} className="password-input">
              <input
                  placeholder="Status Perkawinan"
                  name="maritalStatus" value={newUser.maritalStatus || ''} onChange={handleInputChange}
                />
          </div>
          <div style={{ paddingLeft: '3px', paddingRight: '12px', marginBottom: '10px' }} className="password-input">
              <input
                  placeholder="Pekerjaan" 
                  name="occupation" value={newUser.occupation || ''} onChange={handleInputChange}
                />
          </div>
          <div style={{ paddingLeft: '3px', paddingRight: '12px', marginBottom: '10px' }} className="password-input">
              <input
                  placeholder="Alamat"
                  type="text" name="alamat" value={newUser.alamat || ''} onChange={handleInputChange}
                />
          </div>

          <button onClick={createUser} style={{ marginBottom: '30px', marginTop: '20px' }}>Simpan</button>
      </div>
      </>
  );
};

export default withAuth(['user'])(Registernext)
