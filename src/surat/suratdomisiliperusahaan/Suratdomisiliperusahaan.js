/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import './Register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import contractdomisiliperusahaan from './contractdomisiliperusahaan';
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

const Suratdomisiliperusahaan = () => {
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
    const [domisiliperusahaans, setDomisiliperusahaans] = useState([]);
    const [newDomisiliperusahaan, setNewDomisiliperusahaan] = useState({
      userId: '', // Add default values for all fields
      namaPerusahaan: '',
      jenisPerusahaan: '',
      jamKerja: '',
      alamatPerusahaan: '',
      aktaNotaris: '',
      letterNumber: '',
    });
    const [domisiliperusahaanlurahs, setDomisiliperusahaanlurahs] = useState([]);
    const [newDomisiliperusahaanlurah, setNewDomisiliperusahaanlurah] = useState({
      userId: '', // Add default values for all fields
      namaPerusahaan: '',
      jenisPerusahaan: '',
      jamKerja: '',
      alamatPerusahaan: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const web3 = new Web3(window.ethereum);
    const [editingDomisiliperusahaan, setEditingDomisiliperusahaan] = useState(null);
    const [letterNumberFileName, setLetterNumberFileName] = useState('');
    const backendURL = 'http://localhost:5000';
    const [showFile, setShowFile] = useState(false);
    const [showFiles, setShowFiles] = useState(false);
    const [aktaNotarisFileName, setAktaNotarisFileName] = useState('');
    const [hasSavedData, setHasSavedData] = useState([]);
    const [showDataButtonStatus, setShowDataButtonStatus] = useState({});
  
    const handleOpenModal = () => {
      setShowFile(true);
    };
  
    const handleCloseModal = () => {
      setShowFile(false);
    };
  
    const handleOpenModals = () => {
      setShowFiles(true);
    };
  
    const handleCloseModals = () => {
      setShowFiles(false);
    };
  
    useEffect(() => {
      getUsers();
      getDomisiliperusahaans();
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
  
    const getDomisiliperusahaans = async () => {
      try {
        setIsLoading(true);
        const totalDomisiliperusahaans = await contractdomisiliperusahaan.methods.totalDomisiliperusahaans().call();
        const domisiliperusahaansArray = [];
  
        for (let i = 1; i <= totalDomisiliperusahaans; i++) {
          const domisiliperusahaan = await contractdomisiliperusahaan.methods.getDomisiliperusahaan(i).call();
          if (domisiliperusahaan.userId !== '') {
            domisiliperusahaansArray.push(domisiliperusahaan);
          }
        }
  
        setDomisiliperusahaans(domisiliperusahaansArray);
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
          setNewDomisiliperusahaan({
            ...newDomisiliperusahaan,
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
        setNewDomisiliperusahaan((prevState) => ({
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
          if (name === 'aktaNotaris') {
            setAktaNotarisFileName(response.data.filename);
          } else if (name === 'letterNumber') {
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
          setEditingDomisiliperusahaan({
            ...editingDomisiliperusahaan,
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
        setEditingDomisiliperusahaan((prevState) => ({
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
    
    const createDomisiliperusahaan = async () => {
      try {
        setIsLoading(true);
        const accounts = await web3.eth.getAccounts();
        const domisiliperusahaanCount = await contractdomisiliperusahaan.methods.totalDomisiliperusahaans().call();
        const domisiliperusahaanId = parseInt(domisiliperusahaanCount) + 1;

        const user = users.find((user) => user.walletId === walletId);
        if (!user) {
        throw new Error("User not found");
      }
    
        const domisiliperusahaanWithId = {
          ...newDomisiliperusahaan,
          domisiliperusahaanId: domisiliperusahaanId.toString(),
          userId: user.username,
          aktaNotaris: aktaNotarisFileName, // Set the file name for aktaNotaris
          letterNumber: letterNumberFileName, // Set the file name for letterNumber
        };
    
        await contractdomisiliperusahaan.methods.createDomisiliperusahaan(domisiliperusahaanWithId).send({ from: accounts[0] });
        api.post('/api/surat', domisiliperusahaanWithId);
        await getDomisiliperusahaans();
        setNewDomisiliperusahaan({
          userId: '',
          namaPerusahaan: '',
          jenisPerusahaan: '',
          jamKerja: '',
          alamatPerusahaan: '',
          aktaNotaris: null,
          letterNumber: null,
        });
        setAktaNotarisFileName(''); // Reset the filename state after successful creation
        setLetterNumberFileName(''); // Reset the filename state after successful creation
        setShowAdd(false);
        alert('Data Berhasil Terkirim!')
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const updateDomisiliperusahaan = async (domisiliperusahaanId) => {
      try {
        setIsLoading(true);
        const accounts = await web3.eth.getAccounts();
    
        // If a new file was selected for aktaNotaris or letterNumber, upload it and get the filename
        let updatedDomisiliperusahaan = { ...editingDomisiliperusahaan };
    
        if (typeof editingDomisiliperusahaan.aktaNotaris === 'object') {
          // Save the updated file in the state directly for later use
          const formDataAktaNotaris = new FormData();
          formDataAktaNotaris.append('aktaNotaris', editingDomisiliperusahaan.aktaNotaris);
          const responseAktaNotaris = await axios.post(`${backendURL}/api/upload`, formDataAktaNotaris, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          updatedDomisiliperusahaan.aktaNotaris = responseAktaNotaris.data.filename; // Use the filename returned from the server
        } else {
          updatedDomisiliperusahaan.aktaNotaris = aktaNotarisFileName; // Use the existing filename if not changed
        }
    
        if (typeof editingDomisiliperusahaan.letterNumber === 'object') {
          // Save the updated file in the state directly for later use
          const formDataLetterNumber = new FormData();
          formDataLetterNumber.append('letterNumber', editingDomisiliperusahaan.letterNumber);
          const responseLetterNumber = await axios.post(`${backendURL}/api/upload`, formDataLetterNumber, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          updatedDomisiliperusahaan.letterNumber = responseLetterNumber.data.filename; // Use the filename returned from the server
        } else {
          updatedDomisiliperusahaan.letterNumber = letterNumberFileName; // Use the existing filename if not changed
        }
    
        await contractdomisiliperusahaan.methods
          .updateDomisiliperusahaan(domisiliperusahaanId, updatedDomisiliperusahaan)
          .send({ from: accounts[0] });
    
        setEditingDomisiliperusahaan(null);
        setShowModal(false);
        await getDomisiliperusahaans(); // Refresh the user list after updating the data
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const deleteDomisiliperusahaan = async (domisiliperusahaanId) => {
      try {
        setIsLoading(true);
        const accounts = await web3.eth.getAccounts();
        await contractdomisiliperusahaan.methods.deleteDomisiliperusahaan(domisiliperusahaans[domisiliperusahaanId].domisiliperusahaanId).send({ from: accounts[0] });
        await getDomisiliperusahaans();
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
        <h3 style={{ color: 'white', marginBottom: '5px' }}>Isi Surat Domisili Perusahaan</h3>
        <hr style={{ marginBottom: '50px', width: '260px', color: 'white' }} />

        <Form>
        <Form.Group as={Row} hidden>
        <Form.Label column sm="3.5">
          Nama Lengkap
        </Form.Label>
        <Col sm="8.5">
          <Form.Control
            as="select"
            name="userId"
            value={newDomisiliperusahaan.userId}
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
            <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px' }}>Nama Ketua/Pemilik</p>
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
          <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>Nama Perusahaan</p>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="namaPerusahaan"
                  value={newDomisiliperusahaan.namaPerusahaan}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
        <Form.Group as={Row}>
        <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>Jenis Perusahaan</p>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="jenisPerusahaan"
                  value={newDomisiliperusahaan.jenisPerusahaan}
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
                  value={newDomisiliperusahaan.jamKerja}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
        <Form.Group as={Row}>
        <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>Alamat Perusahaan</p>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="alamatPerusahaan"
                  value={newDomisiliperusahaan.alamatPerusahaan}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>

          {/* Add more form inputs for other user fields */}
          <Form.Group as={Row}>
            <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '6px' }}>Akta Notaris</p>
            <Col sm="8.5">
              <Form.Control
                style={{ backgroundColor: 'white' }}
                type="file"
                accept="application/pdf" // Specify the accepted file type to PDF
                name="aktaNotaris"
                onChange={handleInputChange}
                required
              />
            </Col>
          </Form.Group>
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
          <Button style={{ marginTop: '50px' }} variant="primary" onClick={createDomisiliperusahaan}>
            Tambah
          </Button>
        </Form>
    
        
      </div>
    </div>
  );
}

export default Suratdomisiliperusahaan;
