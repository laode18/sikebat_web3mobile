import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Row, Col } from 'react-bootstrap';
import contractdomisiliperusahaan from './contracts/contractdomisiliperusahaan';
import Web3 from 'web3';
import axios from 'axios';
import api from './api';
import contract from './contract';

function SuratDomisiliperusahaan() {
  const backendURL = 'http://localhost:5000';
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
  const [isLoading, setIsLoading] = useState(false);
  const web3 = new Web3(window.ethereum);
  const [fileName, setFileName] = useState('');
  const [editingDomisiliperusahaan, setEditingDomisiliperusahaan] = useState(null);
  const [nik, setNIK] = useState(''); // State untuk menyimpan NIK
  const [kkNumber, setKKNumber] = useState(''); // State untuk menyimpan KK Number
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [religion, setReligion] = useState('');
  const [nationality, setNationality] = useState('');
  const [educationStatus, setEducationStatus] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [occupation, setOccupation] = useState('');
  const [alamat, setAlamat] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [aktaNotarisFileName, setAktaNotarisFileName] = useState('');
  const [letterNumberFileName, setLetterNumberFileName] = useState('');


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
      const selectedUser = users.find((user) => user.userId === value);
      if (selectedUser) {
        setNewDomisiliperusahaan({
          ...newDomisiliperusahaan,
          [name]: value,
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
      const selectedUser = users.find((user) => user.userId === value);
      if (selectedUser) {
        setEditingDomisiliperusahaan({
          ...editingDomisiliperusahaan,
          userId: value,
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
      setEditingDomisiliperusahaan((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  
  const createDomisiliperusahaan = async () => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();
      const domisiliperusahaanCount = await contractdomisiliperusahaan.methods.totalDomisiliperusahaans().call();
      const domisiliperusahaanId = parseInt(domisiliperusahaanCount) + 1;
  
      const domisiliperusahaanWithId = {
        ...newDomisiliperusahaan,
        domisiliperusahaanId: domisiliperusahaanId.toString(),
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
    <Container>
      <h1>CRUD Surat Domisili Perusahaan</h1>

      <h2>Tambah Data</h2>
      <Form>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            Nama Lengkap
          </Form.Label>
          <Col sm="10">
            <Form.Control
              as="select"
              name="userId"
              value={newDomisiliperusahaan.userId}
              onChange={handleInputChange}
            >
              <option value="" disabled>Select Name</option>
              {users.map((user, index) => (
                <option key={user.userId} value={user.userId}>
                  {user.username}
                </option>
              ))}
            </Form.Control>
          </Col>
        </Form.Group>
        <br />
        <Form.Group as={Row}>
              <Form.Label column sm="2">
                Nama Perusahaan
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="namaPerusahaan"
                  value={newDomisiliperusahaan.namaPerusahaan}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
		    <br />
        <Form.Group as={Row}>
              <Form.Label column sm="2">
                Jenis Perusahaan
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="jenisPerusahaan"
                  value={newDomisiliperusahaan.jenisPerusahaan}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
		    <br />
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Jam Kerja
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="jamKerja"
                  value={newDomisiliperusahaan.jamKerja}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
		    <br />
        <Form.Group as={Row}>
              <Form.Label column sm="2">
                Alamat Perusahaan
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="alamatPerusahaan"
                  value={newDomisiliperusahaan.alamatPerusahaan}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
		    <br />

        <Form.Group as={Row}>
              <Form.Label column sm="2">
                NIK
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="nik"
                  value={nik} 
                  readOnly // NIK field should be read-only and automatically populated
                />
              </Col>
            </Form.Group>
		<br />
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                No. KK
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="kkNumber"
                  value={kkNumber}
                  readOnly // No. KK field should be read-only and automatically populated
                />
              </Col>
            </Form.Group>
            <br />
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Nama Lengkap
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="fullName"
                  value={fullName}
                  readOnly // No. KK field should be read-only and automatically populated
                />
              </Col>
            </Form.Group>
            <br />
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Tanggal Lahir
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="birthDate"
                  value={birthDate}
                  readOnly // No. KK field should be read-only and automatically populated
                />
              </Col>
            </Form.Group>
            <br />
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Jenis Kelamin
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="gender"
                  value={gender}
                  readOnly // No. KK field should be read-only and automatically populated
                />
              </Col>
            </Form.Group>
            <br />
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Agama
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="religion"
                  value={religion}
                  readOnly // No. KK field should be read-only and automatically populated
                />
              </Col>
            </Form.Group>
            <br />
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Kewarganegaraan
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="nationality"
                  value={nationality}
                  readOnly // No. KK field should be read-only and automatically populated
                />
              </Col>
            </Form.Group>
            <br />
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Status Pendidikan
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="educationStatus"
                  value={educationStatus}
                  readOnly // No. KK field should be read-only and automatically populated
                />
              </Col>
            </Form.Group>
            <br />
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Status Perkawinan
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="maritalStatus"
                  value={maritalStatus}
                  readOnly // No. KK field should be read-only and automatically populated
                />
              </Col>
            </Form.Group>
            <br />
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Pekerjaan
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="occupation"
                  value={occupation}
                  readOnly // No. KK field should be read-only and automatically populated
                />
              </Col>
            </Form.Group>
            <br />
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Alamat
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="alamat"
                  value={alamat}
                  readOnly // No. KK field should be read-only and automatically populated
                />
              </Col>
            </Form.Group>
        {/* Add more form inputs for other user fields */}
        <label htmlFor="aktaNotaris">Akta Notaris:</label>
        <input
          type="file"
          accept="application/pdf"
          name="aktaNotaris"
          onChange={handleInputChange}
          required
        />
        {aktaNotarisFileName && <p>Selected file Akta Notaris: {aktaNotarisFileName}</p>}
        <br /><br />

        <label htmlFor="letterNumber">Surat Keterangan RT:</label>
        <input
          type="file"
          accept="application/pdf"
          name="letterNumber"
          onChange={handleInputChange}
          required
        />
        {letterNumberFileName && <p>Selected file Surat Keterangan RT: {letterNumberFileName}</p>}
        <br />


        <Button variant="primary" onClick={createDomisiliperusahaan}>
          Tambah
        </Button>
      </Form>

      <h2>Data Surat Domisili Perusahaan</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID Pengguna</th>
              <th>Nama Perusahaan</th>
              <th>Jenis Perusahaan</th>
              <th>Jam Kerja</th>
              <th>Alamat Perusahaan</th>
              <th>Akta Notaris</th>
              <th>Surat Keterangan RT</th>
              {/* Add more table headers for other user fields */}
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
          {domisiliperusahaans.map((domisiliperusahaan, index) => (
                <tr key={index}>
                  <td>{domisiliperusahaan.userId}</td>
                  <td>{domisiliperusahaan.namaPerusahaan}</td>
                  <td>{domisiliperusahaan.jenisPerusahaan}</td>
                  <td>{domisiliperusahaan.jamKerja}</td>
                  <td>{domisiliperusahaan.alamatPerusahaan}</td>
                  <td>{domisiliperusahaan.aktaNotaris}</td>
                  <td>{domisiliperusahaan.letterNumber}</td>
                  {/* Add more table cells for other user fields */}
                  <td>
                  <Button variant="primary" onClick={() => setEditingDomisiliperusahaan(domisiliperusahaan)}>
                      Edit
                    </Button>{' '}
                    <Button variant="danger" onClick={() => deleteDomisiliperusahaan(index)}>
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}

      {editingDomisiliperusahaan && (
        <div>
          <h2>Edit Data</h2>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Nama Lengkap
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  as="select"
                  name="userId"
                  value={editingDomisiliperusahaan.userId}
                  onChange={handleEditInputChange}
                >
                  <option value="" disabled>Select Name</option>
                  {users.map((user) => (
                    <option key={user.userId} value={user.userId}>
                      {user.username}
                    </option>
                  ))}
                </Form.Control>
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Nama Perusahaan
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="namaPerusahaan"
                  value={editingDomisiliperusahaan.namaPerusahaan}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Jenis Perusahaan
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="jenisPerusahaan"
                  value={editingDomisiliperusahaan.jenisPerusahaan}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Jam Kerja
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="jamKerja"
                  value={editingDomisiliperusahaan.jamKerja}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Alamat Perusahaan
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="alamatPerusahaan"
                  value={editingDomisiliperusahaan.alamatPerusahaan}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <label htmlFor="aktaNotaris">Akta Notaris:</label>
              <input
                type="file"
                accept="application/pdf" // Specify the accepted file type to PDF
                name="aktaNotaris"
                onChange={handleEditInputChange}
                required
              />
              {aktaNotarisFileName && <p>Selected file Akta Notaris: {aktaNotarisFileName}</p>}
              <br /><br />

            <label htmlFor="letterNumber">Surat Keterangan RT:</label>
              <input
                type="file"
                accept="application/pdf" // Specify the accepted file type to PDF
                name="letterNumber"
                onChange={handleEditInputChange}
                required
              />
              {letterNumberFileName && <p>Selected file Surat Keterangan RT: {letterNumberFileName}</p>}
              <br />

            {/* Add more form inputs for other user fields */}
            <Button variant="primary" onClick={() => updateDomisiliperusahaan(editingDomisiliperusahaan.domisiliperusahaanId)}>
              Simpan
            </Button>{" "}
            <Button variant="danger" onClick={() => setEditingDomisiliperusahaan(null)}>
              Batal
            </Button>
          </Form>
        </div>
      )}
    </Container>
  );
}

export default SuratDomisiliperusahaan;
