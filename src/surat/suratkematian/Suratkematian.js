/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import './Register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import contractkematian from './contractkematian';
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

const Suratkematian = () => {
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
  const [kematians, setKematians] = useState([]);
  const [newKematian, setNewKematian] = useState({
    userId: '', // Add default values for all fields
    namaAlmarhum: '',
    tanggalMeninggal: '',
    jamMeninggal: '',
    lokasiMeninggal: '',
    penyebabMeninggal: '',
    usia: '',
    letterNumber: '',
  });
  const [kematianlurahs, setKematianlurahs] = useState([]);
  const [newKematianlurah, setNewKematianlurah] = useState({
    userId: '', // Add default values for all fields
    namaAlmarhum: '',
    tanggalMeninggal: '',
    jamMeninggal: '',
    lokasiMeninggal: '',
    penyebabMeninggal: '',
    usia: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const web3 = new Web3(window.ethereum);
  const [editingKematian, setEditingKematian] = useState(null);
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
    getKematians();
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

  const getKematians = async () => {
    try {
      setIsLoading(true);
      const totalKematians = await contractkematian.methods.totalKematians().call();
      const kematiansArray = [];

      for (let i = 1; i <= totalKematians; i++) {
        const kematian = await contractkematian.methods.getKematian(i).call();
        if (kematian.userId !== '') {
          kematiansArray.push(kematian);
        }
      }

      setKematians(kematiansArray);
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
        setNewKematian({
          ...newKematian,
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
      setNewKematian((prevState) => ({
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
        setEditingKematian({
          ...editingKematian,
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
      setEditingKematian((prevState) => ({
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

  const createKematian = async () => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();
      const kematianCount = await contractkematian.methods.totalKematians().call();
      const kematianId = parseInt(kematianCount) + 1;

      const user = users.find((user) => user.walletId === walletId);
        if (!user) {
        throw new Error("User not found");
    }

      const kematianWithId = {
        ...newKematian,
        kematianId: kematianId.toString(),
        userId: user.username,
        letterNumber: letterNumberFileName, // Use the filename for letterNumber
      };
      await contractkematian.methods.createKematian(kematianWithId).send({ from: accounts[0] });
      api.post('/api/surat', kematianWithId);
      await getKematians();
      setNewKematian({
        userId: '', // Reset the state after successful creation
        namaAlmarhum: '',
        tanggalMeninggal: '',
        jamMeninggal: '',
        lokasiMeninggal: '',
        penyebabMeninggal: '',
        usia: '',
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

  const updateKematian = async (kematianId) => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();

      // If a new file was selected for aktaNotaris or letterNumber, upload it and get the filename
      let updatedKematian = { ...editingKematian };

      if (typeof editingKematian.letterNumber === 'object') {
        // Save the updated file in the state directly for later use
        const formDataLetterNumber = new FormData();
        formDataLetterNumber.append('letterNumber', editingKematian.letterNumber);
        const responseLetterNumber = await axios.post(`${backendURL}/api/upload`, formDataLetterNumber, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        updatedKematian.letterNumber = responseLetterNumber.data.filename; // Use the filename returned from the server
      } else {
        updatedKematian.letterNumber = letterNumberFileName; // Use the existing filename if not changed
      }

      await contractkematian.methods
        .updateKematian(kematianId, updatedKematian)
        .send({ from: accounts[0] });

        setSelectedFile(null);
        setEditingKematian(null);
        setShowModal(false);
      await getKematians(); // Refresh the user list after updating the user
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteKematian = async (kematianId) => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();
      await contractkematian.methods.deleteKematian(kematians[kematianId].kematianId).send({ from: accounts[0] });
      await getKematians();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="login-container" style={{ marginTop: '180px' }}>
        <h3 style={{ color: 'white', marginBottom: '5px' }}>Isi Surat Kematian</h3>
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
            value={newKematian.userId}
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

      <Form.Group as={Row}>
      <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>Nama Almarhum</p>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="namaAlmarhum"
                  value={newKematian.namaAlmarhum}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
        <Form.Group as={Row}>
        <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>Tanggal Meninggal</p>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="tanggalMeninggal"
                  value={newKematian.tanggalMeninggal}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
        <Form.Group as={Row}>
        <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>Jam Meninggal</p>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="jamMeninggal"
                  value={newKematian.jamMeninggal}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
        <Form.Group as={Row}>
        <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>Lokasi Meninggal</p>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="lokasiMeninggal"
                  value={newKematian.lokasiMeninggal}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
        <Form.Group as={Row}>
        <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>Penyebab Meninggal</p>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="penyebabMeninggal"
                  value={newKematian.penyebabMeninggal}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
        <Form.Group as={Row}>
        <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>Usia Almarhum</p>
              <Col sm="8.5">
                <Form.Control
                  type="number"
                  name="usia"
                  value={newKematian.usia}
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
          <Button style={{ marginTop: '50px' }} variant="primary" onClick={createKematian}>
            Tambah
          </Button>
        </Form>
    
       
      </div>
    </div>
  );
}

export default Suratkematian;
