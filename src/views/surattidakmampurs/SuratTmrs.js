/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import contract from 'src/views/pengguna/contracts/contract';
import Web3 from 'web3';
import { Button, Form, Row, Col, Modal } from 'react-bootstrap';
import contracttmrs from './contracts/contracttmrs';
import contracttmrslurah from './contracts/contracttmrslurah';
import axios from 'axios';
import api from 'src/api';
import CIcon from '@coreui/icons-react';
import logo from 'src/assets/logo.png'; // Pastikan logo.png ada di direktori yang sesuai
import ttdImage from 'src/assets/ttd1.png'; // Pastikan ttd1.png ada di direktori yang sesuai
import stempelImage from 'src/assets/stempel.png';
import {
  cilTrash,
  cilPencil,
  cilPlus,
  cilFile,
  cilCheck,
} from '@coreui/icons';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CRow,
} from '@coreui/react';

const generateSuratNumber = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  
  // Simulasi contoh code surat (misalnya: A, B, C, ...)
  const codeSurat = 'Pembd'; 

  const nomorSurat = `${month}/${codeSurat}/${year}`;
  return nomorSurat;
};

const SuratTmrs = () => {
  const [showModal, setShowModal] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [showData, setShowData] = useState(false);

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
  const [tmrss, setTmrss] = useState([]);
  const [newTmrs, setNewTmrs] = useState({
    userId: '', // Add default values for all fields
    noJamkesmas: '',
    namaOrangtua: '',
    namaRs: '',
    letterNumber: '',
  });
  const [tmrslurahs, setTmrslurahs] = useState([]);
  const [newTmrslurah, setNewTmrslurah] = useState({
    userId: '', // Add default values for all fields
    noJamkesmas: '',
    namaOrangtua: '',
    namaRs: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const web3 = new Web3(window.ethereum);
  const [editingTmrs, setEditingTmrs] = useState(null);
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
    getTmrss();
    getTmrslurahs();
  }, []);

  const getTmrslurahs = async () => {
    try {
      setIsLoading(true);
      const totalTmrslurahs = await contracttmrslurah.methods.totalTmrslurahs().call();
      const tmrslurahsArray = [];
      const savedDataIds = []; // Array to store saved data IDs
      const showDataStatus = {}; // Object to store show data button status
  
      for (let i = 1; i <= totalTmrslurahs; i++) {
        const tmrslurah = await contracttmrslurah.methods.getTmrslurah(i).call();
        tmrslurahsArray.push(tmrslurah);
  
        // Check if data has been saved
        if (tmrslurah.userId !== '') {
          savedDataIds.push(tmrslurah.userId);
          showDataStatus[tmrslurah.userId] = true;
        }
      }
  
      setTmrslurahs(tmrslurahsArray);
      setIsLoading(false);
      setHasSavedData(savedDataIds);
      setShowDataButtonStatus(showDataStatus); // Set the show data button status
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

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

  const getTmrss = async () => {
    try {
      setIsLoading(true);
      const totalTmrss = await contracttmrs.methods.totalTmrss().call();
      const tmrssArray = [];

      for (let i = 1; i <= totalTmrss; i++) {
        const tmrs = await contracttmrs.methods.getTmrs(i).call();
        if (tmrs.userId !== '') {
          tmrssArray.push(tmrs);
        }
      }

      setTmrss(tmrssArray);
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
        setNewTmrs({
          ...newTmrs,
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
      setNewTmrs((prevState) => ({
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
        setEditingTmrs({
          ...editingTmrs,
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
      setEditingTmrs((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleInputChangelurah = (event) => {
    const { name, value } = event.target;
    setNewTmrslurah((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const createTmrslurah = async (newTmrslurah, tmrs) => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();
      const tmrslurahCount = await contracttmrslurah.methods.totalTmrslurahs().call();
      const tmrslurahId = parseInt(tmrslurahCount) + 1;
      const userId = tmrs.userId;
      const noJamkesmas = tmrs.noJamkesmas;
      const namaOrangtua = tmrs.namaOrangtua;
      const namaRs = tmrs.namaRs;
      const tmrslurahWithId = {
        ...newTmrslurah,
        tmrslurahId: tmrslurahId.toString(),
        userId: userId.toString(),
        noJamkesmas: noJamkesmas.toString(),
        namaOrangtua: namaOrangtua.toString(),
        namaRs: namaRs.toString(),

      };
      await contracttmrslurah.methods.createTmrslurah(tmrslurahWithId).send({ from: accounts[0] });
      await getTmrslurahs();
      toggleData(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const createTmrs = async () => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();
      const tmrsCount = await contracttmrs.methods.totalTmrss().call();
      const tmrsId = parseInt(tmrsCount) + 1;
      const tmrsWithId = {
        ...newTmrs,
        tmrsId: tmrsId.toString(),
        letterNumber: letterNumberFileName, // Use the filename for letterNumber
      };
      await contracttmrs.methods.createTmrs(tmrsWithId).send({ from: accounts[0] });
      api.post('/api/surat', tmrsWithId);
      await getTmrss();
      setNewTmrs({
        userId: '', // Reset the state after successful creation
        noJamkesmas: '',
        namaOrangtua: '',
        namaRs: '',
        letterNumber: null, // Reset the letterNumber state after successful creation
      });
      setLetterNumberFileName(null); // Reset the filename state after successful creation
      setShowAdd(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };  

  const updateTmrs = async (tmrsId) => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();

      // If a new file was selected for aktaNotaris or letterNumber, upload it and get the filename
      let updatedTmrs = { ...editingTmrs };

      if (typeof editingTmrs.letterNumber === 'object') {
        // Save the updated file in the state directly for later use
        const formDataLetterNumber = new FormData();
        formDataLetterNumber.append('letterNumber', editingTmrs.letterNumber);
        const responseLetterNumber = await axios.post(`${backendURL}/api/upload`, formDataLetterNumber, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        updatedTmrs.letterNumber = responseLetterNumber.data.filename; // Use the filename returned from the server
      } else {
        updatedTmrs.letterNumber = letterNumberFileName; // Use the existing filename if not changed
      }

      await contracttmrs.methods
        .updateTmrs(tmrsId, updatedTmrs)
        .send({ from: accounts[0] });

        setSelectedFile(null);
        setEditingTmrs(null);
        setShowModal(false);
      await getTmrss(); // Refresh the user list after updating the user
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTmrs = async (tmrsId) => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();
      await contracttmrs.methods.deleteTmrs(tmrss[tmrsId].tmrsId).send({ from: accounts[0] });
      await getTmrss();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Data Surat Tidak Mampu RS</strong>
          </CCardHeader>
          <br />
          <Button variant='primary' style={{ width: 100, marginLeft: 16 }} onClick={toggleAdd}><CIcon icon={cilPlus} style={{ color: 'white', filter: 'drop-shadow(0px 0px 1px black)' }} />
            Tambah</Button>
          <CCardBody>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
            <CTable style={{ marginTop: '10px', borderCollapse: 'collapse', width: '100%' }}>
              <CTableHead style={{ backgroundColor: 'grey', color: 'white', fontSize: '16px', verticalAlign: "middle", lineHeight: '20px' }}>
                <CTableRow>
                  <CTableHeaderCell scope="col" style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>No.</CTableHeaderCell>
                  {/* <CTableHeaderCell scope="col" style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Username</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>NIK</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>No KK</CTableHeaderCell> */}
                  <CTableHeaderCell scope="col" style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>No Jamkesmas</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Nama Lengkap</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Jenis Kelamin</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Nama Orang Tua / Wali</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Nama Rumah Sakit</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Surat Ket RT</CTableHeaderCell>
                  
                  {/* <CTableHeaderCell scope="col" style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Id Wallet</CTableHeaderCell>
                   */}
                  <CTableHeaderCell scope="col" style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody style={{ fontSize: '14px', textAlign: 'center', verticalAlign: "middle" }}>
                {tmrss.map((tmrs, index) => {
                  const selectedUser = users.find((user) => user.username === tmrs.userId);

                  if (!selectedUser) {
                    return null; // Skip rendering if user not found for this kependudukan
                  }

                  return (
                    <CTableRow key={index}>
                      <CTableHeaderCell scope="row" style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{index + 1}.</CTableHeaderCell>
                      {/* <CTableDataCell style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>{tmrs.userId}</CTableDataCell>
                      <CTableDataCell style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>{user.nik}</CTableDataCell>
                      <CTableDataCell style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>{user.kkNumber}</CTableDataCell> */}
                      <CTableDataCell style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{tmrs.noJamkesmas}</CTableDataCell>
                      <CTableDataCell style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{selectedUser.fullName}</CTableDataCell>
                      <CTableDataCell style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{selectedUser.gender}</CTableDataCell>
                      <CTableDataCell style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{tmrs.namaOrangtua}</CTableDataCell>
                      <CTableDataCell style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{tmrs.namaRs}</CTableDataCell>
                      <CTableDataCell style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                        <button onClick={handleOpenModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'blue', textDecorationLine: 'underline' }}>
                          {tmrs.letterNumber}
                        </button>
                      </CTableDataCell>

                      <Modal show={showFile} onHide={handleCloseModal} size="lg">
                        <Modal.Header closeButton>
                          <Modal.Title>{tmrs.letterNumber}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <iframe
                            title="PDF Viewer"
                            src={`http://localhost:5000/api/uploads/${tmrs.letterNumber}`}
                            width="100%"
                            height="500px"
                            allowFullScreen
                          />
                        </Modal.Body>

                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                          </Button>
                        </Modal.Footer>
                      </Modal>
                      <CTableDataCell style={{ border: '1px solid black', padding: '8px', textAlign: 'center', width: '20%' }}>
                        <Button variant="warning" style={{ marginRight: '8px' }} onClick={() => {
                          toggleModal();
                          setEditingTmrs(tmrs);
                        }}><CIcon icon={cilPencil} style={{ color: 'white' }} /></Button>
                        <Button style={{ marginRight: '8px' }} variant="danger" onClick={() => deleteTmrs(index)}><CIcon icon={cilTrash} style={{ color: 'white' }} /></Button>
                        <Button
                          variant={hasSavedData.includes(tmrs.userId) ? "success" : "secondary"}
                          onClick={() => {
                            toggleData(selectedUser);
                          }}
                        >
                          <CIcon icon={showDataButtonStatus[tmrs.userId] ? cilCheck : cilFile} style={{ color: 'white' }} />
                        </Button>

                    <CModal visible={selectedData === selectedUser} onClose={closeData} centered style={{ width: '22cm', height: '34cm' }} size='lg'>
        <CModalHeader closeButton>
          <CModalTitle>Surat Keterangan Tidak Mampu Rumah Sakit</CModalTitle>
        </CModalHeader>
        <Form>
        <CModalBody>
        <center>
        <div style={{ width: '21cm', height: '29.7cm', backgroundColor: 'white' }}> 
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div style={{ width: '20%', paddingLeft: '30px', paddingTop: '35px' }}>
        <img src={logo} style={{ width: '120px', height: '120px' }} alt="" />
      </div>  

      <div style={{ width: '60%', paddingTop: '30px', marginLeft: '25px' }}>
        <div style={{ fontSize: '14pt', margin: '2px 0', fontWeight: 'bold' }}>PEMERINTAH DAERAH KOTA CIMAHI</div>
        <div style={{ fontSize: '14pt', margin: '2px 0', fontWeight: 'bold' }}>KECAMATAN CIMAHI UTARA</div>
        <div style={{ fontSize: '24pt', margin: '2px 0', fontWeight: 'bold' }}>KELURAHAN CIBABAT</div>
        <div style={{ fontSize: '12pt', margin: '2px 0' }}>Jl. Sirnarasa No.18 Telp (022) 6654095 Cimahi 40513</div>
      </div>    

      <div style={{ width: '20%' }}>
            &nbsp;
      </div>
    </div>
    <hr style={{ borderTop: '5px double black', width: '90%', borderColor: 'black' }} />

    <div style={{ marginTop: '30px', textAlign: 'center' }}>
      <p style={{ margin: '5px 0', fontSize: '11pt', fontWeight: 'bold' }}>SURAT KETERANGAN TIDAK MAMPU RUMAH SAKIT</p>
      <p style={{ margin: '5px 0', fontSize: '11pt' }}>NOMOR : {String(index + 1).padStart(3, '0')}.8/{nomorSurat}</p>
    </div>
    <div style={{ marginTop: '50px', textAlign: 'left', paddingLeft: '120px' }}>
    <p style={{ margin: '5px 0', fontSize: '11pt', textIndent: '30px', marginRight: '80px', lineHeight: '25px', textAlign: 'justify' }}>
    Yang bertanda tangan dibawah ini, Lurah Cibabat Kecamatan Cimahi Utara Kota Cimahi dengan ini menerangkan bahwa:
    </p>
    <table style={{ width: '100%'}}>
      <tbody>
        <tr>
          <td style={{ paddingBottom: '5px', width: '30%', paddingLeft: '30px' }}>Nama</td>
          <td style={{ width: '2%' }}>:</td>
          <td style={{ width: '60%' }}>{selectedUser.fullName}</td>
        </tr>
        <tr>
          <td style={{ paddingBottom: '5px', paddingLeft: '30px' }}>Tempat, Tanggal Lahir</td>
          <td>:</td>
          <td> {selectedUser.birthDate} </td>
        </tr>
        <tr>
          <td style={{ paddingBottom: '5px', paddingLeft: '30px' }}>Jenis Kelamin</td>
          <td>:</td>
          <td>{selectedUser.gender}</td>
        </tr>
        <tr>
          <td style={{ paddingBottom: '5px', paddingLeft: '30px' }}>Pekerjaan</td>
          <td>:</td>
          <td>{selectedUser.occupation}</td>
        </tr>
        <tr>
          <td style={{ paddingBottom: '5px', paddingLeft: '30px' }}>Agama</td>
          <td>:</td>
          <td>{selectedUser.religion}</td>
        </tr>
        <tr>
          <td style={{ paddingBottom: '5px', paddingLeft: '30px' }}>Alamat</td>
          <td>:</td>
          <td>{selectedUser.alamat}</td>
        </tr>
        <tr>
          <td style={{ paddingBottom: '5px', paddingLeft: '30px' }}>NIK</td>
          <td>:</td>
          <td>{selectedUser.nik}</td>
        </tr>
        <tr>
          <td style={{ paddingBottom: '5px', paddingLeft: '30px' }}>Nomor Kartu Keluarga</td>
          <td>:</td>
          <td>{selectedUser.kkNumber}</td>
        </tr>
        <tr>
          <td style={{ paddingBottom: '5px', paddingLeft: '30px' }}>Nomor Jamkesmas</td>
          <td>:</td>
          <td>{tmrs.noJamkesmas}</td>
        </tr>
        <tr>
          <td style={{ paddingBottom: '5px', paddingLeft: '30px' }}>Nama Orang Tua/Wali</td>
          <td>:</td>
          <td>{tmrs.namaOrangtua}</td>
        </tr>
        <tr>
          <td style={{ paddingBottom: '5px', paddingLeft: '30px' }}>Nama Rumah Sakit</td>
          <td>:</td>
          <td>{tmrs.namaRs}</td>
        </tr>
        
      </tbody>
    </table>
    <p style={{ margin: '5px 0', fontSize: '11pt', textIndent: '30px', marginRight: '80px', lineHeight: '25px', textAlign: 'justify' }}>
    Berdasarkan Pengakuan yang bersangkutan dan Surat Keterangan dari Ketua RT.01 RW.02 Nomor : /03/2022 tanggal 30 Desember 2022 keadaan ekonominya 
    termasuk masyarakat tidak mampu dan berdasarkan data yang ada keluarga tersebut tidak termasuk dalam kategori Rumah Tangga Miskin.
    </p>
    
      <p style={{ margin: '5px 0', fontSize: '11pt', marginRight: '80px', lineHeight: '25px', textAlign: 'justify', textIndent: '30px' }}>
      Surat Keterangan ini berlaku sampai dengan tanggal 04 Februari 2023 dan diberikan untuk melengkapi persayaratan permohonan pengajuan mendapatkan keringanan biaya pelayanan kesehatan ke Rumah Sakit. Demikian Surat Keterangan ini dibuat untuk dipergunakan sebagaimana mestinya.
      </p>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginTop: '-50px' }}>
      <div>&nbsp;</div>
      <div>&nbsp;</div>
      <div>&nbsp;</div>
      <div style={{ textAlign: 'center', paddingRight: '100px', marginLeft: '67%', position: 'relative' }}>
      <p style={{ margin: '5px 0', fontSize: '11pt' }}>Cibabat, 04 Januari 2023</p>
      <p style={{ margin: '5px 0', fontSize: '11pt' }}>a.n. Lurah Cibabat</p>
      {/* <img src={ttdImage} alt="" style={{ width: '60%', height: '30%', position: 'absolute', top: '70px', left: '0' }} />
      <img src={stempelImage} alt="" style={{ width: '55%', height: '70%', position: 'absolute', top: '60px', left: '30px', opacity: 0.7 }} /> */}
      <p style={{ margin: '5px 0', fontSize: '11pt', marginTop: '40px' }}><u><b>Faisal, S.Si, M.A.P</b></u></p>
      <p style={{ margin: '5px 0', fontSize: '11pt' }}><b>197512032009041001</b></p>
    </div>
    
    </div>
  </div>
  
  </center>
        
        </CModalBody>
        <CModalFooter>
        <Form>
        <Form.Control type="text" name="userId" value={tmrs.userId} onChange={handleInputChangelurah} hidden />
        <Form.Control type="text" name="noJamkesmas" value={tmrs.noJamkesmas} onChange={handleInputChangelurah} hidden />
        <Form.Control type="text" name="namaOrangtua" value={tmrs.namaOrangtua} onChange={handleInputChangelurah} hidden />
        <Form.Control type="text" name="namaRs" value={tmrs.namaRS} onChange={handleInputChangelurah} hidden />
        {/* Hapus baris berikut untuk menghindari input manual */}
        {/* <Form.Control type="text" name="noSurat" value={newKependudukanlurah.noSurat} onChange={handleInputChangelurah} hidden /> */}
        <Button variant="primary" onClick={() => createTmrslurah(newTmrslurah, tmrs)}>Accept</Button>
      </Form>
          <Button variant="secondary" onClick={closeData}>Close</Button>
        </CModalFooter>
        </Form>
      </CModal>

                      </CTableDataCell>
                    </CTableRow>
                  );
                })}
              </CTableBody>

            </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      {/* Edit Data */}
      <CModal visible={showModal} onClose={closeModal}>
        <CModalHeader closeButton>
          <CModalTitle>Edit Data Surat Tidak Mampu RS</CModalTitle>
        </CModalHeader>
        {editingTmrs && (
        <div>
        <Form>
        <CModalBody>
          <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Nama Lengkap
              </Form.Label>
              <Col sm="8.5">
                <Form.Control
                  as="select"
                  name="userId"
                  value={editingTmrs.userId}
                  onChange={handleEditInputChange}
                >
                  <option value="" disabled>Select Name</option>
                  {users.map((user) => (
                    <option key={user.username} value={user.username}>
                      {user.username}
                    </option>
                  ))}
                </Form.Control>
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                No Jamkesmas
              </Form.Label>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="noJamkesmas"
                  value={editingTmrs.noJamkesmas}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Nama Orang Tua / Wali
              </Form.Label>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="namaOrangtua"
                  value={editingTmrs.namaOrangtua}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Nama Rumah Sakit
              </Form.Label>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="namaRs"
                  value={editingTmrs.namaRs}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            
              {/* Add more form inputs for other user fields */}
            <Form.Group as={Row}>
              <Form.Label column sm="3.5" htmlFor="letterNumber">
                Surat Keterangan RT:
              </Form.Label>
              <Col sm="8.5">
                <Form.Control
                  type="file"
                  accept="application/pdf" // Specify the accepted file type to PDF
                  name="letterNumber"
                  onChange={handleEditInputChange}
                  required
                />
                {letterNumberFileName && <p>Selected file Surat Keterangan RT: {letterNumberFileName}</p>}
              </Col>
            </Form.Group>
            
        </CModalBody>
        <CModalFooter>
            <Button variant="primary" onClick={() => updateTmrs(editingTmrs.tmrsId)}>
              Simpan
            </Button>{" "}
          <Button variant="danger" onClick={closeModal}>Cancel</Button>
        </CModalFooter>
        </Form>
        </div>
        )}
      </CModal>

      {/* Tambah Data */}
<CModal visible={showAdd} onClose={closeAdd} centered size='md'>
  <CModalHeader closeButton>
    <CModalTitle>Tambah Data Surat Tidak Mampu RS</CModalTitle>
  </CModalHeader>
  <Form>
    <CModalBody>
      <Form.Group as={Row}>
        <Form.Label column sm="3.5">
          Nama Lengkap
        </Form.Label>
        <Col sm="8.5">
          <Form.Control
            as="select"
            name="userId"
            value={newTmrs.userId}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select Name</option>
            {users.map((user, index) => (
              <option key={user.username} value={user.username}>
                {user.username}
              </option>
            ))}
          </Form.Control>
        </Col>
      </Form.Group>
      <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                No Jamkesmas
              </Form.Label>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="noJamkesmas"
                  value={newTmrs.noJamkesmas}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
        <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Nama Orang Tua / Wali
              </Form.Label>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="namaOrangtua"
                  value={newTmrs.namaOrangtua}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
        <Form.Group as={Row}>
              <Form.Label column sm="3.5">
                Nama Rumah Sakit
              </Form.Label>
              <Col sm="8.5">
                <Form.Control
                  type="text"
                  name="namaRs"
                  value={newTmrs.namaRs}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
      
      {/* Add more form inputs for other user fields */}
      <Form.Group as={Row}>
        <Form.Label column sm="3.5" htmlFor="letterNumber">
          Surat Keterangan RT:
        </Form.Label>
        <Col sm="8.5">
          <Form.Control
            type="file"
            accept="application/pdf" // Specify the accepted file type to PDF
            name="letterNumber"
            onChange={handleInputChange}
            required
          />
          {letterNumberFileName && <p>Selected file Surat Keterangan RT: {letterNumberFileName}</p>}
        </Col>
      </Form.Group>
    </CModalBody>
    <CModalFooter>
        <Button variant="primary" onClick={createTmrs}>
        Tambah
      </Button>{' '}
      <Button variant="danger" onClick={closeAdd}>Cancel</Button>
    </CModalFooter>
  </Form>
</CModal>

    </CRow>
  );
};

export default SuratTmrs;
