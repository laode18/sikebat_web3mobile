/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import './Register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import contractbersihdiri from './contractbersihdiri';
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

const Suratbersihdiri = () => {
    const walletId = localStorage.getItem('walletId')

    const [showModal, setShowModal] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showData, setShowData] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const toggleData = (user) => {
    setSelectedData(user);
  };

  const closeData = () => {
    setSelectedData(null);
  };

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

  const [nomorSurat, setNomorSurat] = useState('');

  useEffect(() => {
    const generatedNomorSurat = generateSuratNumber();
    setNomorSurat(generatedNomorSurat);
  }, []);

  const [users, setUsers] = useState([]);
  const [bersihdiris, setBersihdiris] = useState([]);
  const [newBersihdiri, setNewBersihdiri] = useState({
    userId: '', // Add default values for all fields
    namaAyah: '',
    namaIbu: '',
    keperluan: '',
    letterNumber: '',
  });
  const [bersihdirilurahs, setBersihdirilurahs] = useState([]);
  const [newBersihdirilurah, setNewBersihdirilurah] = useState({
    userId: '', // Add default values for all fields
    namaAyah: '',
    namaIbu: '',
    keperluan: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const web3 = new Web3(window.ethereum);
  const [editingBersihdiri, setEditingBersihdiri] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [letterNumberFileName, setLetterNumberFileName] = useState('');
  const backendURL = 'http://localhost:5000';
  const [showFile, setShowFile] = useState(false);
  const [hasSavedData, setHasSavedData] = useState([]);
  const [showDataButtonStatus, setShowDataButtonStatus] = useState({});

  const handleOpenModal = () => {
    setShowFile(true);
  };

  const handleCloseModal = () => {
    setShowFile(false);
  };

  useEffect(() => {
    getUsers();
    getBersihdiris();
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

  const getBersihdiris = async () => {
    try {
      setIsLoading(true);
      const totalBersihdiris = await contractbersihdiri.methods.totalBersihdiris().call();
      const bersihdirisArray = [];

      for (let i = 1; i <= totalBersihdiris; i++) {
        const bersihdiri = await contractbersihdiri.methods.getBersihdiri(i).call();
        if (bersihdiri.userId !== '') {
          bersihdirisArray.push(bersihdiri);
        }
      }

      setBersihdiris(bersihdirisArray);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
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
        setNewBersihdiri({
          ...newBersihdiri,
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
      setNewBersihdiri((prevState) => ({
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

  const handleEditInputChange = (event) => {
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
        setEditingBersihdiri({
          ...editingBersihdiri,
          userId: value,
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
          letterNumber: value, // You can set the letterNumber to the userId if needed
        });
      }
    } else {
      setEditingBersihdiri((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
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
  
  const createBersihdiri = async () => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();
      const bersihdiriCount = await contractbersihdiri.methods.totalBersihdiris().call();
      const bersihdiriId = parseInt(bersihdiriCount) + 1;

      const user = users.find((user) => user.walletId === walletId);
        if (!user) {
        throw new Error("User not found");
      }

      const bersihdiriWithId = {
        ...newBersihdiri,
        bersihdiriId: bersihdiriId.toString(),
        userId: user.username,
        letterNumber: letterNumberFileName, // Use the filename for letterNumber
      };
      await contractbersihdiri.methods.createBersihdiri(bersihdiriWithId).send({ from: accounts[0] });
      api.post('/api/surat', bersihdiriWithId);
      await getBersihdiris();
      setNewBersihdiri({
        userId: '', // Reset the state after successful creation
        namaAyah: '',
        namaIbu: '',
        keperluan: '',
        letterNumber: null, // Reset the letterNumber state after successful creation
      });
      setLetterNumberFileName(null); // Reset the filename state after successful creation
      setShowAdd(false);
      alert('Data Berhasil Terkirim!')
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };  

  const updateBersihdiri = async (bersihdiriId) => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();

      // If a new file was selected for aktaNotaris or letterNumber, upload it and get the filename
      let updatedBersihdiri = { ...editingBersihdiri };

      if (typeof editingBersihdiri.letterNumber === 'object') {
        // Save the updated file in the state directly for later use
        const formDataLetterNumber = new FormData();
        formDataLetterNumber.append('letterNumber', editingBersihdiri.letterNumber);
        const responseLetterNumber = await axios.post(`${backendURL}/api/upload`, formDataLetterNumber, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        updatedBersihdiri.letterNumber = responseLetterNumber.data.filename; // Use the filename returned from the server
      } else {
        updatedBersihdiri.letterNumber = letterNumberFileName; // Use the existing filename if not changed
      }

      await contractbersihdiri.methods
        .updateBersihdiri(bersihdiriId, updatedBersihdiri)
        .send({ from: accounts[0] });

        setSelectedFile(null);
        setEditingBersihdiri(null);
        setShowModal(false);
      await getBersihdiris(); // Refresh the user list after updating the user
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBersihdiri = async (bersihdiriId) => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();
      await contractbersihdiri.methods.deleteBersihdiri(bersihdiris[bersihdiriId].bersihdiriId).send({ from: accounts[0] });
      await getBersihdiris();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="login-container" style={{ marginTop: '130px' }}>
        <h3 style={{ color: 'white', marginBottom: '5px' }}>Isi Surat Bersih Diri</h3>
        <hr style={{ marginBottom: '50px', width: '220px', color: 'white' }} />

        <Form>
        <Form.Group as={Row} hidden>
        <Form.Label column sm="3.5">
          Nama Lengkap
        </Form.Label>
        <Col sm="8.5">
          <Form.Control
            as="select"
            name="userId"
            value={newBersihdiri.userId}
            onChange={handleInputChange}
          >
            {users
              .filter((user) => user.walletId === walletId)
              .map((user) => (
              <option key={user.username} value={user.username}>
                {user.username}
              </option>
            ))}
          </Form.Control>
        </Col>
      </Form.Group>

      <div style={{ paddingLeft: '3px', paddingRight: '12px', marginBottom: '10px' }} className="password-input">
            <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px' }}>Nama Pemilik</p>
            {users
              .filter((user) => user.walletId === walletId)
              .map((user) => (
                <input
                  key={user.userId} // Adding a unique key for each input element
                  type="text"
                  value={user.fullName}
                  readOnly 
                />
              ))}
          </div>
          <div style={{ paddingLeft: '3px', paddingRight: '12px', marginBottom: '10px' }} className="password-input">
            <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px' }}>NIK</p>
            {users
              .filter((user) => user.walletId === walletId)
              .map((user) => (
                <input
                  key={user.userId} // Adding a unique key for each input element
                  type="text"
                  value={user.nik}
                  readOnly 
                />
              ))}
          </div>

          <Form.Group as={Row}>
          <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>Nama Ayah/Wali</p>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="namaAyah"
                  value={newBersihdiri.namaAyah}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
            <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>Nama Ibu/Wali</p>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="namaIbu"
                  value={newBersihdiri.namaIbu}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>

        <Form.Group as={Row}>
        <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>Keperluan</p>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="keperluan"
                  value={newBersihdiri.keperluan}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>

          {/* Add more form inputs for other user fields */}
          <Form.Group as={Row}>
            <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '6px' }}>Surat Keterangan RT</p>
            <Col sm="8.5">
              <Form.Control
                style={{ backgroundColor: 'white' }}
                type="file"
                accept="application/pdf"
                name="letterNumber"
                onChange={handleInputChange}
                required
              />
            </Col>
          </Form.Group>
          <Button style={{ marginTop: '50px' }} variant="primary" onClick={createBersihdiri}>
            Tambah
          </Button>
        </Form>
    
        
      </div>
    </div>
  );
}

export default Suratbersihdiri;
