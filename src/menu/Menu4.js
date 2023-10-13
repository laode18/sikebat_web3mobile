/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import './css/Menu4.css'; // Import your CSS file for styling
import { useNavigate } from 'react-router-dom'
import contract from './contracts/contract';
import Web3 from 'web3';
import CIcon from '@coreui/icons-react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import Modal from 'react-modal';

const modalStyle = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#fff',
    maxWidth: '500px',
    height: '700px',
  },
};

const Menu4 = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const walletId = localStorage.getItem('walletId');
  const web3 = new Web3(window.ethereum);
  const [isLoading, setIsLoading] = useState(false);
  const [editingUser, setEditingUser] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const [isUsernameValid, setIsUsernameValid] = useState(true);

  useEffect(() => {
    // Panggil fungsi getPesans() dan getUsers()
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      setIsLoading(true);
      const totalUsers = await contract.methods.totalUsers().call();
      const usersArray = [];

      for (let i = 1; i <= totalUsers; i++) {
        const user = await contract.methods.getUser(i).call();
        if (user.username !== '') {
          usersArray.push(user);
        }
      }

      setUsers(usersArray);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditingUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const updateUser = async (userId) => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();
      const userToUpdate = users.find((user) => user.userId === userId.toString());
      
      const updatedUser = {
        ...userToUpdate,
        ...editingUser
      };
  
      await contract.methods.updateUser(userId, updatedUser).send({ from: accounts[0] });
      setEditingUser({});
      setShowModal(false);
      alert('Berhasil Diupdate');
      closeModal();
      await getUsers(); // Refresh the user list after updating the user
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

const handleSignOut = () => {
  // Perform sign-out logic here
  // For now, we'll just simulate a sign-out by redirecting back to the login page
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('userRole')
  localStorage.removeItem('walletId')
  navigate('/login')
}

  return (
    <div>
    <div className="profile-container">
        {users
          .filter((user) => user.walletId === walletId)
          .map((user) => (
      <div key={user.userId} className="profile-details">
        <img src="assets/user.jpg" alt="Foto Profil" className="profile-image" />
        
        <h2 style={{ marginBottom: '20px' }}>{user.fullName}</h2>
        <button onClick={() => {
            openModal();
            setEditingUser(user);
        }} className="logout-button">
            Edit Profile
          </button>
        <div style={{ textAlign: 'left', marginTop: '20px', marginLeft: '-30px' }}>
        <table style={{ width: '100%'}}>
      <tbody>
        <tr>
          <td style={{ paddingBottom: '10px', width: '60%', paddingLeft: '80px' }}>NIK</td>
          <td style={{ width: '2%' }}>:</td>
          <td style={{ width: '38%' }}>{user.nik}</td>
        </tr>
        <tr>
          <td style={{ paddingBottom: '10px', paddingLeft: '80px' }}>Jenis Kelamin</td>
          <td>:</td>
          <td>{user.gender}</td>
        </tr>
        <tr>
          <td style={{ paddingBottom: '10px', paddingLeft: '80px' }}>Agama</td>
          <td>:</td>
          <td>{user.religion}</td>
        </tr>
        <tr>
        <td style={{ paddingBottom: '10px', paddingLeft: '80px' }}>Pekerjaan</td>
          <td>:</td>
          <td>{user.occupation}</td>
          </tr>
          <tr>
        <td style={{ paddingBottom: '10px', paddingLeft: '80px' }}>Alamat</td>
          <td>:</td>
          <td>{user.alamat}</td>
          </tr>
      </tbody>
    </table>
        </div>
      </div>
      ))}
      
      <button onClick={handleSignOut} style={{ marginTop: '20px', marginBottom: '30px' }} className="logout-button">Logout</button>
    </div>

    <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyle}
        contentLabel="Contoh Modal"
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={closeModal}>X</button>
        </div>
        <h2 style={{ textAlign: 'center' }}>Edit Profil</h2>
        {editingUser.username !== undefined && (
        <Form style={{ width: '260px' }}>
        <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Username
              </Form.Label>
              <Col sm="8.5" style={{ marginTop: '7px', marginBottom: '7px' }} aria-readonly>
                  <Form.Control
                    type="text"
                    name="username"
                    value={editingUser.username}
                    onChange={handleEditInputChange}
                    disabled
                    style={{ width: '95%' }}
                  />
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Password
              </Form.Label>
              <Col sm="8.5" style={{ marginTop: '7px', marginBottom: '7px' }}>
                <Form.Control
                  type="password"
                  name="password"
                  value={editingUser.password}
                  onChange={handleEditInputChange}
                  style={{ width: '95%' }}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                ID Wallet
              </Form.Label>
              <Col sm="8.5" style={{ marginTop: '7px', marginBottom: '7px' }}>
                <Form.Control
                  type="text"
                  name="walletId"
                  value={editingUser.walletId}
                  onChange={handleEditInputChange}
                  style={{ width: '95%' }}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Nomor Induk Kependudukan
              </Form.Label>
              <Col sm="8.5" style={{ marginTop: '7px', marginBottom: '7px' }}>
                <Form.Control
                  type="text"
                  name="nik"
                  value={editingUser.nik}
                  onChange={handleEditInputChange}
                  style={{ width: '95%' }}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Nomor Kartu Keluarga
              </Form.Label>
              <Col sm="8.5" style={{ marginTop: '7px', marginBottom: '7px' }}>
                <Form.Control
                  type="text"
                  name="kkNumber"
                  value={editingUser.kkNumber}
                  onChange={handleEditInputChange}
                  style={{ width: '95%' }}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Nama Lengkap
              </Form.Label>
              <Col sm="8.5" style={{ marginTop: '7px', marginBottom: '7px' }}>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={editingUser.fullName}
                  onChange={handleEditInputChange}
                  style={{ width: '95%' }}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Tanggal Lahir
              </Form.Label>
              <Col sm="8.5" style={{ marginTop: '7px', marginBottom: '7px' }}>
                <Form.Control
                  type="text"
                  name="birthDate"
                  value={editingUser.birthDate}
                  onChange={handleEditInputChange}
                  style={{ width: '95%' }}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Jenis Kelamin
              </Form.Label>
              <Col sm="8.5" style={{ marginTop: '7px', marginBottom: '7px' }}>
                <Form.Control
                  type="text"
                  name="gender"
                  value={editingUser.gender}
                  onChange={handleEditInputChange}
                  style={{ width: '95%' }}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Agama
              </Form.Label>
              <Col sm="8.5" style={{ marginTop: '7px', marginBottom: '7px' }}>
                <Form.Control
                  type="text"
                  name="religion"
                  value={editingUser.religion}
                  onChange={handleEditInputChange}
                  style={{ width: '95%' }}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Kewarganegaraan
              </Form.Label>
              <Col sm="8.5" style={{ marginTop: '7px', marginBottom: '7px' }}>
                <Form.Control
                  type="text"
                  name="nationality"
                  value={editingUser.nationality}
                  onChange={handleEditInputChange}
                  style={{ width: '95%' }}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Status Pendidikan
              </Form.Label>
              <Col sm="8.5" style={{ marginTop: '7px', marginBottom: '7px' }}>
                <Form.Control
                  type="text"
                  name="educationStatus"
                  value={editingUser.educationStatus}
                  onChange={handleEditInputChange}
                  style={{ width: '95%' }}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Status Perkawinan
              </Form.Label>
              <Col sm="8.5" style={{ marginTop: '7px', marginBottom: '7px' }}>
                <Form.Control
                  type="text"
                  name="maritalStatus"
                  value={editingUser.maritalStatus}
                  onChange={handleEditInputChange}
                  style={{ width: '95%' }}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Pekerjaan
              </Form.Label>
              <Col sm="8.5" style={{ marginTop: '7px', marginBottom: '7px' }}>
                <Form.Control
                  type="text"
                  name="occupation"
                  value={editingUser.occupation}
                  onChange={handleEditInputChange}
                  style={{ width: '95%' }}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Alamat
              </Form.Label>
              <Col sm="8.5" style={{ marginTop: '7px', marginBottom: '7px' }}>
                <Form.Control
                  type="text"
                  name="alamat"
                  value={editingUser.alamat}
                  onChange={handleEditInputChange}
                  style={{ width: '95%' }}
                />
              </Col>
            </Form.Group>
              <center>
              <Button
                className="logout-button"
                variant="primary"
                onClick={() => updateUser(editingUser.userId)}
                disabled={!isUsernameValid} // Step 3
              >
                Simpan
              </Button>
              </center>
            </Form>
            )}
      </Modal>

    </div>
  );
};

export default Menu4;
