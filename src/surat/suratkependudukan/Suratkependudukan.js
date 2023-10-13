/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import './Register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import contractkependudukan from './contractkependudukan';
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

const Suratkependudukan = () => {
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

  const walletId = localStorage.getItem('walletId')

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
  const [kependudukans, setKependudukans] = useState([]);
  const [newKependudukan, setNewKependudukan] = useState({
    userId: '', // Add default values for all fields
    letterNumber: '',
  });
  const [newKependudukanlurah, setNewKependudukanlurah] = useState({
    userId: '', // Add default values for all fields
    noSurat: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const web3 = new Web3(window.ethereum);
  const [fileName, setFileName] = useState('');
  const [editingKependudukan, setEditingKependudukan] = useState(null);
  const [nik, setNIK] = useState(newKependudukan.nik); // State untuk menyimpan NIK
  const [kkNumber, setKKNumber] = useState(newKependudukan.kkNumber); // State untuk menyimpan KK Number
  const [fullName, setFullName] = useState(newKependudukan.fullName);
  const [birthDate, setBirthDate] = useState(newKependudukan.birthDate);
  const [gender, setGender] = useState(newKependudukan.gender);
  const [religion, setReligion] = useState(newKependudukan.religion);
  const [nationality, setNationality] = useState(newKependudukan.nationality);
  const [educationStatus, setEducationStatus] = useState(newKependudukan.educationStatus);
  const [maritalStatus, setMaritalStatus] = useState(newKependudukan.maritalStatus);
  const [occupation, setOccupation] = useState(newKependudukan.occupation);
  const [alamat, setAlamat] = useState(newKependudukan.alamat);
  const [selectedFile, setSelectedFile] = useState(null);
  const [letterNumberFileName, setLetterNumberFileName] = useState('');
  const backendURL = 'http://localhost:5000';
  const [showFile, setShowFile] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [kependudukanlurahs, setKependudukanlurahs] = useState([]);
  const [hasUserIdData, setHasUserIdData] = useState(false);
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
    getKependudukans();
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

  const getKependudukans = async () => {
    try {
      setIsLoading(true);
      const totalKependudukans = await contractkependudukan.methods.totalKependudukans().call();
      const kependudukansArray = [];

      for (let i = 1; i <= totalKependudukans; i++) {
        const kependudukan = await contractkependudukan.methods.getKependudukan(i).call();
        if (kependudukan.userId !== '') {
          kependudukansArray.push(kependudukan);
        }
      }

      setKependudukans(kependudukansArray);
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
        setNewKependudukan({
          ...newKependudukan,
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

        // Set NIK and KK Number based on selected user
        setNIK(selectedUser.nik);
        setKKNumber(selectedUser.kkNumber);
        setFullName(selectedUser.fullName);
        setBirthDate(selectedUser.birthDate);
        setGender(selectedUser.gender);
        setReligion(selectedUser.religion);
        setNationality(selectedUser.nationality);
        setEducationStatus(selectedUser.educationStatus);
        setMaritalStatus(selectedUser.maritalStatus);
        setOccupation(selectedUser.occupation);
        setAlamat(selectedUser.alamat);
      }
    } else {
      setNewKependudukan((prevState) => ({
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
        setEditingKependudukan({
          ...editingKependudukan,
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
        setNIK(selectedUser.nik);
        setKKNumber(selectedUser.kkNumber);
        setFullName(selectedUser.fullName);
        setBirthDate(selectedUser.birthDate);
        setGender(selectedUser.gender);
        setReligion(selectedUser.religion);
        setNationality(selectedUser.nationality);
        setEducationStatus(selectedUser.educationStatus);
        setMaritalStatus(selectedUser.maritalStatus);
        setOccupation(selectedUser.occupation);
        setAlamat(selectedUser.alamat);
      }
    } else {
      setEditingKependudukan((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  
  const handleInputChangelurah = (event) => {
    const { name, value } = event.target;
    setNewKependudukanlurah((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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

  const createKependudukan = async () => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();
      const kependudukanCount = await contractkependudukan.methods.totalKependudukans().call();
      const kependudukanId = parseInt(kependudukanCount) + 1;

      const user = users.find((user) => user.walletId === walletId);
        if (!user) {
        throw new Error("User not found");
        }

      const kependudukanWithId = {
        ...newKependudukan,
        kependudukanId: kependudukanId.toString(),
        userId: user.username,
        letterNumber: letterNumberFileName, // Use the filename for letterNumber
      };
      await contractkependudukan.methods.createKependudukan(kependudukanWithId).send({ from: accounts[0] });
      api.post('/api/surat', kependudukanWithId);
      await getKependudukans();
      setNewKependudukan({
        userId: '', // Reset the state after successful creation
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

  const updateKependudukan = async (kependudukanId) => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();

      // If a new file was selected for aktaNotaris or letterNumber, upload it and get the filename
      let updatedKependudukan = { ...editingKependudukan };

      if (typeof editingKependudukan.letterNumber === 'object') {
        // Save the updated file in the state directly for later use
        const formDataLetterNumber = new FormData();
        formDataLetterNumber.append('letterNumber', editingKependudukan.letterNumber);
        const responseLetterNumber = await axios.post(`${backendURL}/api/upload`, formDataLetterNumber, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        updatedKependudukan.letterNumber = responseLetterNumber.data.filename; // Use the filename returned from the server
      } else {
        updatedKependudukan.letterNumber = letterNumberFileName; // Use the existing filename if not changed
      }

      await contractkependudukan.methods
        .updateKependudukan(kependudukanId, updatedKependudukan)
        .send({ from: accounts[0] });

        setSelectedFile(null);
        setEditingKependudukan(null);
        setShowModal(false);
      await getKependudukans(); // Refresh the user list after updating the user
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteKependudukan = async (kependudukanId) => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();
      await contractkependudukan.methods.deleteKependudukan(kependudukans[kependudukanId].kependudukanId).send({ from: accounts[0] });
      await getKependudukans();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="login-container" style={{ marginTop: '20px' }}>
        <h3 style={{ color: 'white', marginBottom: '5px' }}>Isi Surat Kependudukan</h3>
        <hr style={{ marginBottom: '50px', width: '220px', color: 'white' }} />

        <Form>
<div style={{ paddingLeft: '3px', paddingRight: '12px', marginBottom: '10px' }} className="password-input" hidden>
  <label style={{ fontWeight: 'bold', color: 'white', textAlign: 'left', lineHeight: '5px' }} htmlFor="namaLengkap">Nama Lengkap</label>
  <select id="namaLengkap"
      name="userId"
      value={newKependudukan.userId}
      onChange={handleInputChange} readOnly>
    {users
      .filter((user) => user.walletId === walletId)
      .map((user) => (
        <option
          key={user.userId}
          value={user.username}
        >
          {user.username}
        </option>
      ))}
  </select>
</div>

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
          <Button style={{ marginTop: '50px' }} variant="primary" onClick={createKependudukan}>
            Tambah
          </Button>
        </Form>

      </div>
    </div>
  );
}

export default Suratkependudukan;
