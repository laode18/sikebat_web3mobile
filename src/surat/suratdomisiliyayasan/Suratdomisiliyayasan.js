/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import './Register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import contractdomisiliyayasan from './contractdomisiliyayasan';
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

const Suratdomisiliyayasan = () => {
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
  const [domisiliyayasans, setDomisiliyayasans] = useState([]);
  const [newDomisiliyayasan, setNewDomisiliyayasan] = useState({
    userId: '', // Add default values for all fields
    namaUsaha: '',
    jenisUsaha: '',
    jumlahAnggota: '',
    jamKerja: '',
    alamatUsaha: '',
    letterNumber: '',
  });
  const [domisiliyayasanlurahs, setDomisiliyayasanlurahs] = useState([]);
  const [newDomisiliyayasanlurah, setNewDomisiliyayasanlurah] = useState({
    userId: '', // Add default values for all fields
    namaUsaha: '',
    jenisUsaha: '',
    jumlahAnggota: '',
    jamKerja: '',
    alamatUsaha: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const web3 = new Web3(window.ethereum);
  const [editingDomisiliyayasan, setEditingDomisiliyayasan] = useState(null);
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
    getDomisiliyayasans();
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

  const getDomisiliyayasans = async () => {
    try {
      setIsLoading(true);
      const totalDomisiliyayasans = await contractdomisiliyayasan.methods.totalDomisiliyayasans().call();
      const domisiliyayasansArray = [];

      for (let i = 1; i <= totalDomisiliyayasans; i++) {
        const domisiliyayasan = await contractdomisiliyayasan.methods.getDomisiliyayasan(i).call();
        if (domisiliyayasan.userId !== '') {
          domisiliyayasansArray.push(domisiliyayasan);
        }
      }

      setDomisiliyayasans(domisiliyayasansArray);
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
        setNewDomisiliyayasan({
          ...newDomisiliyayasan,
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
      setNewDomisiliyayasan((prevState) => ({
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
        setEditingDomisiliyayasan({
          ...editingDomisiliyayasan,
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
      setEditingDomisiliyayasan((prevState) => ({
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
  
  const createDomisiliyayasan = async () => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();
      const domisiliyayasanCount = await contractdomisiliyayasan.methods.totalDomisiliyayasans().call();
      const domisiliyayasanId = parseInt(domisiliyayasanCount) + 1;

      const user = users.find((user) => user.walletId === walletId);
        if (!user) {
        throw new Error("User not found");
      }

      const domisiliyayasanWithId = {
        ...newDomisiliyayasan,
        domisiliyayasanId: domisiliyayasanId.toString(),
        userId: user.username,
        letterNumber: letterNumberFileName, // Use the filename for letterNumber
      };
      await contractdomisiliyayasan.methods.createDomisiliyayasan(domisiliyayasanWithId).send({ from: accounts[0] });
      api.post('/api/surat', domisiliyayasanWithId);
      await getDomisiliyayasans();
      setNewDomisiliyayasan({
        userId: '', // Reset the state after successful creation
        namaUsaha: '',
        jenisUsaha: '',
        jumlahAnggota: '',
        jamKerja: '',
        alamatUsaha: '',
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

  const updateDomisiliyayasan = async (domisiliyayasanId) => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();

      // If a new file was selected for aktaNotaris or letterNumber, upload it and get the filename
      let updatedDomisiliyayasan = { ...editingDomisiliyayasan };

      if (typeof editingDomisiliyayasan.letterNumber === 'object') {
        // Save the updated file in the state directly for later use
        const formDataLetterNumber = new FormData();
        formDataLetterNumber.append('letterNumber', editingDomisiliyayasan.letterNumber);
        const responseLetterNumber = await axios.post(`${backendURL}/api/upload`, formDataLetterNumber, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        updatedDomisiliyayasan.letterNumber = responseLetterNumber.data.filename; // Use the filename returned from the server
      } else {
        updatedDomisiliyayasan.letterNumber = letterNumberFileName; // Use the existing filename if not changed
      }

      await contractdomisiliyayasan.methods
        .updateDomisiliyayasan(domisiliyayasanId, updatedDomisiliyayasan)
        .send({ from: accounts[0] });

        setSelectedFile(null);
        setEditingDomisiliyayasan(null);
        setShowModal(false);
      await getDomisiliyayasans(); // Refresh the user list after updating the user
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDomisiliyayasan = async (domisiliyayasanId) => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();
      await contractdomisiliyayasan.methods.deleteDomisiliyayasan(domisiliyayasans[domisiliyayasanId].domisiliyayasanId).send({ from: accounts[0] });
      await getDomisiliyayasans();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="login-container" style={{ marginTop: '230px' }}>
        <h3 style={{ color: 'white', marginBottom: '5px' }}>Isi Surat Domisili Yayasan/Organisasi</h3>
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
            value={newDomisiliyayasan.userId}
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
            <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px' }}>Nama Ketua</p>
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
          <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>Nama Yayasan/Organisasi</p>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="namaUsaha"
                  value={newDomisiliyayasan.namaUsaha}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
        <Form.Group as={Row}>
        <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>Jenis Usaha/Organisasi</p>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="jenisUsaha"
                  value={newDomisiliyayasan.jenisUsaha}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
            <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>Jumlah Anggota</p>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="jumlahAnggota"
                  value={newDomisiliyayasan.jumlahAnggota}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
            <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>Jam Kerja</p>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="jamKerja"
                  value={newDomisiliyayasan.jamKerja}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
        <Form.Group as={Row}>
        <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>Alamat Yayasan/Organisasi</p>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="alamatUsaha"
                  value={newDomisiliyayasan.alamatUsaha}
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
          <Button style={{ marginTop: '50px' }} variant="primary" onClick={createDomisiliyayasan}>
            Tambah
          </Button>
        </Form>
    
        
      </div>
    </div>
  );
}

export default Suratdomisiliyayasan;
