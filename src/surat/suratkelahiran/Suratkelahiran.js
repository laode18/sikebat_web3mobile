/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import './Register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import contractkelahiran from './contractkelahiran';
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

const Suratkelahiran = () => {
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
    const [kelahirans, setKelahirans] = useState([]);
    const [kelahiranlurahs, setKelahiranlurahs] = useState([]);
    const [newKelahiran, setNewKelahiran] = useState({
      userId: '', // Add default values for all fields
      namaAyah: '',
      namaIbu: '',
      namaAnak: '',
      tanggalLahir: '',
      jenisKelamin: '',
      anakKe: '',
      jamLahir: '',
      letterNumber: '',
    });
    const [newKelahiranlurah, setNewKelahiranlurah] = useState({
      userId: '', // Add default values for all fields
      namaAyah: '',
      namaIbu: '',
      namaAnak: '',
      tanggalLahir: '',
      jenisKelamin: '',
      anakKe: '',
      jamLahir: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const web3 = new Web3(window.ethereum);
    const [editingKelahiran, setEditingKelahiran] = useState(null);
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
      getKelahirans();
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
  
    const getKelahirans = async () => {
      try {
        setIsLoading(true);
        const totalKelahirans = await contractkelahiran.methods.totalKelahirans().call();
        const kelahiransArray = [];
  
        for (let i = 1; i <= totalKelahirans; i++) {
          const kelahiran = await contractkelahiran.methods.getKelahiran(i).call();
          if (kelahiran.userId !== '') {
            kelahiransArray.push(kelahiran);
          }
        }
  
        setKelahirans(kelahiransArray);
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
          setNewKelahiran({
            ...newKelahiran,
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
        setNewKelahiran((prevState) => ({
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
          setEditingKelahiran({
            ...editingKelahiran,
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
        setEditingKelahiran((prevState) => ({
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
      
  
    const createKelahiran = async () => {
      try {
        setIsLoading(true);
        const accounts = await web3.eth.getAccounts();
        const kelahiranCount = await contractkelahiran.methods.totalKelahirans().call();
        const kelahiranId = parseInt(kelahiranCount) + 1;

        const user = users.find((user) => user.walletId === walletId);
        if (!user) {
        throw new Error("User not found");
        }


        const kelahiranWithId = {
          ...newKelahiran,
          kelahiranId: kelahiranId.toString(),
          userId: user.username,
          letterNumber: letterNumberFileName, // Use the filename for letterNumber
        };
        await contractkelahiran.methods.createKelahiran(kelahiranWithId).send({ from: accounts[0] });
        api.post('/api/surat', kelahiranWithId);
        await getKelahirans();
        setNewKelahiran({
          userId: '', // Reset the state after successful creation
          namaAyah: '',
          namaIbu: '',
          namaAnak: '',
          tanggalLahir: '',
          jenisKelamin: '',
          anakKe: '',
          jamLahir: '',
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
  
    const updateKelahiran = async (kelahiranId) => {
      try {
        setIsLoading(true);
        const accounts = await web3.eth.getAccounts();
  
        // If a new file was selected for aktaNotaris or letterNumber, upload it and get the filename
        let updatedKelahiran = { ...editingKelahiran };
  
        if (typeof editingKelahiran.letterNumber === 'object') {
          // Save the updated file in the state directly for later use
          const formDataLetterNumber = new FormData();
          formDataLetterNumber.append('letterNumber', editingKelahiran.letterNumber);
          const responseLetterNumber = await axios.post(`${backendURL}/api/upload`, formDataLetterNumber, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          updatedKelahiran.letterNumber = responseLetterNumber.data.filename; // Use the filename returned from the server
        } else {
          updatedKelahiran.letterNumber = letterNumberFileName; // Use the existing filename if not changed
        }
  
        await contractkelahiran.methods
          .updateKelahiran(kelahiranId, updatedKelahiran)
          .send({ from: accounts[0] });
  
          setSelectedFile(null);
          setEditingKelahiran(null);
          setShowModal(false);
        await getKelahirans(); // Refresh the user list after updating the user
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const deleteKelahiran = async (kelahiranId) => {
      try {
        setIsLoading(true);
        const accounts = await web3.eth.getAccounts();
        await contractkelahiran.methods.deleteKelahiran(kelahirans[kelahiranId].kelahiranId).send({ from: accounts[0] });
        await getKelahirans();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <div>
      <Header />
      <div className="login-container" style={{ marginTop: '220px' }}>
        <h3 style={{ color: 'white', marginBottom: '5px' }}>Isi Surat Kelahiran</h3>
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
            value={newKelahiran.userId}
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
<p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>Nama Ayah</p>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="namaAyah"
                  value={newKelahiran.namaAyah}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
        <Form.Group as={Row}>
        <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>Nama Ibu</p>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="namaIbu"
                  value={newKelahiran.namaIbu}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
        <Form.Group as={Row}>
        <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>Nama Anak</p>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="namaAnak"
                  value={newKelahiran.namaAnak}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
        <Form.Group as={Row}>
        <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>Tanggal Lahir</p>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="tanggalLahir"
                  value={newKelahiran.tanggalLahir}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
        <Form.Group as={Row}>
        <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>Jenis Kelamin</p>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="jenisKelamin"
                  value={newKelahiran.jenisKelamin}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
        <Form.Group as={Row}>
        <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>Anak Ke</p>
              <Col sm="8.5">
                <Form.Control
                  type="number"
                  name="anakKe"
                  value={newKelahiran.anakKe.toString()}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
        <Form.Group as={Row}>
        <p style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px', paddingLeft: '5px' }}>Jam Lahir</p>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="jamLahir"
                  value={newKelahiran.jamLahir}
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
          <Button style={{ marginTop: '50px' }} variant="primary" onClick={createKelahiran}>
            Tambah
          </Button>
        </Form>
    
        
      </div>
    </div>
  );
}

export default Suratkelahiran;
