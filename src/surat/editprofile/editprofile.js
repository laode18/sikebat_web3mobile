/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import './Register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import contractandonnikah from './contractandonnikah';
import contract from './contract';
import axios from 'axios';
import api from './api';
import {
  Button,
  Form,
  Row,
  Col,
} from 'react-bootstrap';
import Header from '../../Header';

const generateSuratNumber = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  
  // Simulasi contoh code surat (misalnya: A, B, C, ...)
  const codeSurat = 'Pem'; 

  const nomorSurat = `${month}/${codeSurat}/${year}`;
  return nomorSurat;
};

const Editprofile = () => {
    const walletId = localStorage.getItem('walletId')

    const [showModal, setShowModal] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showData, setShowData] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleAdd = () => {
    setShowAdd(!showAdd);
  };

  const closeAdd = () => {
    setShowAdd(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const toggleData = (user) => {
    setSelectedData(user);
  };

  const closeData = () => {
    setSelectedData(null);
  };

  const [nomorSurat, setNomorSurat] = useState('');

  useEffect(() => {
    const generatedNomorSurat = generateSuratNumber();
    setNomorSurat(generatedNomorSurat);
  }, []);


  const [users, setUsers] = useState([]);
  const [andonnikahs, setAndonnikahs] = useState([]);
  const [newAndonnikah, setNewAndonnikah] = useState({
    userId: '', // Add default values for all fields
    namaPasangan: '',
    alamatPasangan: '',
    letterNumber: '',
  });
  const [andonnikahlurahs, setAndonnikahlurahs] = useState([]);
  const [newAndonnikahlurah, setNewAndonnikahlurah] = useState({
    userId: '', // Add default values for all fields
    namaPasangan: '',
    alamatPasangan: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const web3 = new Web3(window.ethereum);
  const [editingAndonnikah, setEditingAndonnikah] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [letterNumberFileName, setLetterNumberFileName] = useState('');
  const backendURL = 'http://localhost:5000';
  const [showFile, setShowFile] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [hasSavedData, setHasSavedData] = useState([]);
  const [showDataButtonStatus, setShowDataButtonStatus] = useState({});
  const [newUser, setNewUser] = useState({});
  const [editingUser, setEditingUser] = useState({});
  const [isUsernameValid, setIsUsernameValid] = useState(true);

  const handleOpenModal = () => {
    setShowFile(true);
  };

  const handleCloseModal = () => {
    setShowFile(false);
  };

  useEffect(() => {
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
      await getUsers(); // Refresh the user list after updating the user
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value, type, files } = event.target;

    if (type === 'file' && files && files.length > 0) {
      const file = files[0];
      if (file.type !== 'application/pdf') {
        alert('File must be in PDF format.');
        return;
      }

      // Move file upload logic to a separate function
      uploadFile(name, file);

    } else if (name === 'userId') {
      const selectedUser = users.find((user) => user.username === value);
      if (selectedUser) {
        setNewAndonnikah({
          ...newAndonnikah,
          [name]: value,
          nik : selectedUser.nik,
          kkNumber : selectedUser.kkNumber,
          birthDate : selectedUser.birthDate,
          gender : selectedUser.gender,
          religion : selectedUser.religion,
          nationality : selectedUser.nationality,
          educationStatus : selectedUser.educationStatus,
          maritalStatus : selectedUser.maritalStatus,
          occupation : selectedUser.occupation,
          alamat: selectedUser.alamat,
        });
      }
    } else {
      setNewAndonnikah((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const uploadFile = (name, file) => {
    const formData = new FormData();
    formData.append('file', file);
  
    axios
      .post(`${backendURL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('File uploaded successfully:', response.data.filename);
        if (name === 'letterNumber') {
          setLetterNumberFileName(response.data.filename);
        }
      })
      .catch((error) => {
        console.error('File upload failed:', error);
      });
  };

  // eslint-disable-next-line no-lone-blocks
  {
    users
      .filter((user) => user.walletId === walletId)
      .map((user) => {
        const userId = user.username;
        return (
          // Tambahkan elemen JSX yang sesuai di sini
          <div key={userId}>{userId}</div>
        );
      })
  }

  return (
    <div>
      <Header />
      <div className="login-container" style={{ marginTop: '20px' }}>
        <h3 style={{ color: 'white', marginBottom: '5px' }}>Edit Profil</h3>
        <hr style={{ marginBottom: '50px', width: '220px', color: 'white' }} />

        {editingUser.username !== undefined && (
        <Form>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Username
              </Form.Label>
              <Col sm="8.5">
                  <Form.Control
                    type="text"
                    name="username"
                    value={editingUser.username}
                    onChange={handleEditInputChange}
                    onBlur={() => {
                      if (editingUser.username.trim() === '') {
                        setIsUsernameValid(true);
                        return;
                      }
                      const isExistingUsername = users.some(
                        (user) =>
                          user.username === editingUser.username &&
                          user.userId !== editingUser.userId
                      );
                      setIsUsernameValid(!isExistingUsername);
                    }}
                    isInvalid={!isUsernameValid} // Step 2
                  />
                  <Form.Control.Feedback type="invalid">
                    Username already exists.
                  </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Password
              </Form.Label>
              <Col sm="8.5">
                <Form.Control
                  type="password"
                  name="password"
                  value={editingUser.password}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                ID Wallet
              </Form.Label>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="walletId"
                  value={editingUser.walletId}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Nomor Induk Kependudukan
              </Form.Label>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="nik"
                  value={editingUser.nik}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Nomor Kartu Keluarga
              </Form.Label>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="kkNumber"
                  value={editingUser.kkNumber}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Nama Lengkap
              </Form.Label>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="fullName"
                  value={editingUser.fullName}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Tanggal Lahir
              </Form.Label>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="birthDate"
                  value={editingUser.birthDate}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Jenis Kelamin
              </Form.Label>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="gender"
                  value={editingUser.gender}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Agama
              </Form.Label>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="religion"
                  value={editingUser.religion}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Kewarganegaraan
              </Form.Label>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="nationality"
                  value={editingUser.nationality}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Status Pendidikan
              </Form.Label>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="educationStatus"
                  value={editingUser.educationStatus}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Status Perkawinan
              </Form.Label>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="maritalStatus"
                  value={editingUser.maritalStatus}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Pekerjaan
              </Form.Label>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="occupation"
                  value={editingUser.occupation}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Alamat
              </Form.Label>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="alamat"
                  value={editingUser.alamat}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            {/* Add more form inputs for other user fields */}
            
        <Button
                variant="primary"
                onClick={() => updateUser(editingUser.userId)}
                disabled={!isUsernameValid} // Step 3
              >
                Simpan
              </Button>
        </Form>
    )}
        
      </div>
    </div>
  );
}

export default Editprofile;
