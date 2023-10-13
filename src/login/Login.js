import React, { useState, useEffect } from 'react'
import Web3 from 'web3'
import SimpleStorageuser from './contracts/SimpleStorageuser.json'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'

const Login = () => {
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [walletId, setWalletId] = useState('')
  const [isWalletConnected, setIsWalletConnected] = useState(false)
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
    if (!isWalletConnected) {
      if (window.ethereum) {
        try {
          // Request account access from the user
          await window.ethereum.request({ method: 'eth_requestAccounts' })
          checkWalletConnection()
        } catch (error) {
          console.error('Error connecting to wallet:', error)
        }
      } else {
        alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    }
  }

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
    // const contractAddress = '0x6A4ae500127934fE1C3247aE8A689EaD0eBAae5A'
    const contractAddress = '0x7c663f921607DA5108e1dAE8eBeF8d29aCc8d9e3'
    const contract = new window.web3.eth.Contract(SimpleStorageuser.abi, contractAddress)

    try {
      const userData = await contract.methods.getUserData().call({ from: userAddress })
      const storedPassword = userData[0] // Assuming user data (password) is returned first
      const userRole = userData[1]

      if (storedPassword === password) {
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('userRole', userRole)
        localStorage.setItem('walletId', userAddress)
        if (userRole === 'admin') {
          navigate('/dashboard') // Pengguna dengan peran admin dialihkan ke /dashboard
        } else if (userRole === 'ketua') {
          navigate('/dashboardlurah') // Pengguna dengan peran ketua dialihkan ke /register
        } else if (userRole === 'user') {
          navigate('/register') // Pengguna dengan peran ketua dialihkan ke /register
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
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{ background: '#e4b560' }}
    >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CCardGroup style={{ width: 500 }}>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <div
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <img
                        className="img"
                        src="/assets/logo.png"
                        alt=""
                        style={{ width: 60, height: 60, marginRight: '10px' }}
                      />
                      <h1>SIM Kelurahan</h1>
                    </div>
                    <p
                      className="text-medium-emphasis"
                      style={{
                        textAlign: 'center',
                        justifyContent: 'center',
                        marginTop: 20,
                        fontSize: 18,
                        fontWeight: 'bold',
                      }}
                    >
                      Login
                    </p>
                    <CRow>
                      <CCol xs={12} style={{ textAlign: 'center', marginBottom: 20 }}>
                        {isWalletConnected ? (
                          <p style={{ fontWeight: 500 }}>
                            <label style={{ fontWeight: 500 }}>Connected Wallet ID:</label>{' '}
                            {walletId}
                          </p>
                        ) : (
                          <button
                            onClick={handleConnectMetamask}
                            className="btn"
                            style={{
                              backgroundColor: '#e4b560',
                              color: 'white',
                              fontWeight: 700,
                              width: 420,
                            }}
                          >
                            Connect Wallet
                            <img
                              className="img"
                              src="/assets/meta.gif"
                              alt=""
                              style={{ width: 56, height: 40, marginLeft: '3px' }}
                            />
                          </button>
                        )}
                      </CCol>
                    </CRow>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol
                        xs={12}
                        style={{
                          textAlign: 'center',
                        }}
                      >
                        <CButton onClick={handleLogin} color="primary" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                    {errorMessage && (
                      <p style={{ textAlign: 'center', marginTop: 20 }}>{errorMessage}</p>
                    )}
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
