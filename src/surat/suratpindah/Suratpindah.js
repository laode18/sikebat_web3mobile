/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import './Register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import contractpindah from './contractpindah';
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

const Suratpindah = () => {
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
  const [pindahs, setPindahs] = useState([]);
  const [newPindah, setNewPindah] = useState({
    userId: '', // Add default values for all fields
    kotaTujuan: '',
    kelurahanTujuan: '',
    alamatTujuan: '',
    rtTujuan: '',
    rwTujuan: '',
    alasanPindah: '',
    tanggalPindah: '',
    letterNumber: '',
  });
  const [pindahlurahs, setPindahlurahs] = useState([]);
  const [newPindahlurah, setNewPindahlurah] = useState({
    userId: '', // Add default values for all fields
    kotaTujuan: '',
    kelurahanTujuan: '',
    alamatTujuan: '',
    rtTujuan: '',
    rwTujuan: '',
    alasanPindah: '',
    tanggalPindah: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const web3 = new Web3(window.ethereum);
  const [editingPindah, setEditingPindah] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [letterNumberFileName, setLetterNumberFileName] = useState('');
  const backendURL = 'http://localhost:5000';
  const [showFile, setShowFile] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
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
    getPindahs();
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

  const getPindahs = async () => {
    try {
      setIsLoading(true);
      const totalPindahs = await contractpindah.methods.totalPindahs().call();
      const pindahsArray = [];

      for (let i = 1; i <= totalPindahs; i++) {
        const pindah = await contractpindah.methods.getPindah(i).call();
        if (pindah.userId !== '') {
          pindahsArray.push(pindah);
        }
      }

      setPindahs(pindahsArray);
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
        setNewPindah({
          ...newPindah,
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
      setNewPindah((prevState) => ({
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
        setEditingPindah({
          ...editingPindah,
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
      setEditingPindah((prevState) => ({
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

  const createPindah = async () => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();
      const pindahCount = await contractpindah.methods.totalPindahs().call();
      const pindahId = parseInt(pindahCount) + 1;

      const user = users.find((user) => user.walletId === walletId);
        if (!user) {
        throw new Error("User not found");
      }

      const pindahWithId = {
        ...newPindah,
        pindahId: pindahId.toString(),
        userId: user.username,
        letterNumber: letterNumberFileName, // Use the filename for letterNumber
      };
      await contractpindah.methods.createPindah(pindahWithId).send({ from: accounts[0] });
      api.post('/api/surat', pindahWithId);
      await getPindahs();
      setNewPindah({
        userId: '', // Reset the state after successful creation
        kotaTujuan: '',
        kelurahanTujuan: '',
        alamatTujuan: '',
        rtTujuan: '',
        rwTujuan: '',
        alasanPindah: '',
        tanggalPindah: '',
        letterNumber: null, // Reset the letterNumber state after successful creation
      });
      setLetterNumberFileName(''); // Reset the filename state after successful creation
      setShowAdd(false);
      alert('Data Berhasil Terkirim!')
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };  

  const updatePindah = async (pindahId) => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();

      // If a new file was selected for aktaNotaris or letterNumber, upload it and get the filename
      let updatedPindah = { ...editingPindah };

      if (typeof editingPindah.letterNumber === 'object') {
        // Save the updated file in the state directly for later use
        const formDataLetterNumber = new FormData();
        formDataLetterNumber.append('letterNumber', editingPindah.letterNumber);
        const responseLetterNumber = await axios.post(`${backendURL}/api/upload`, formDataLetterNumber, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        updatedPindah.letterNumber = responseLetterNumber.data.filename; // Use the filename returned from the server
      } else {
        updatedPindah.letterNumber = letterNumberFileName; // Use the existing filename if not changed
      }

      await contractpindah.methods
        .updatePindah(pindahId, updatedPindah)
        .send({ from: accounts[0] });

        setSelectedFile(null);
        setEditingPindah(null);
        setShowModal(false);
      await getPindahs(); // Refresh the user list after updating the user
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePindah = async (pindahId) => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();
      await contractpindah.methods.deletePindah(pindahs[pindahId].pindahId).send({ from: accounts[0] });
      await getPindahs();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="login-container" style={{ marginTop: '300px' }}>
        <h3 style={{ color: 'white', marginBottom: '5px' }}>Isi Surat Pindah</h3>
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
            value={newPindah.userId}
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
            <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px' }}>Nama Lengkap</p>
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
      <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>Kota Tujuan</p>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="kotaTujuan"
                  value={newPindah.kotaTujuan}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
        <Form.Group as={Row}>
        <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>Kelurahan Tujuan</p>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="kelurahanTujuan"
                  value={newPindah.kelurahanTujuan}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
        <Form.Group as={Row}>
        <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>Alamat Tujuan</p>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="alamatTujuan"
                  value={newPindah.alamatTujuan}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
        <Form.Group as={Row}>
        <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>RT Tujuan</p>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="rtTujuan"
                  value={newPindah.rtTujuan}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
        <Form.Group as={Row}>
        <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>RW Tujuan</p>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="rwTujuan"
                  value={newPindah.rwTujuan}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
        <Form.Group as={Row}>
        <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>Alasan Pindah</p>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="alasanPindah"
                  value={newPindah.alasanPindah}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
            <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>Tanggal Pindah</p>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="tanggalPindah"
                  value={newPindah.tanggalPindah}
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
          <Button style={{ marginTop: '50px' }} variant="primary" onClick={createPindah}>
            Tambah
          </Button>
        </Form>
    
        
      </div>
    </div>
  );
}

export default Suratpindah;
