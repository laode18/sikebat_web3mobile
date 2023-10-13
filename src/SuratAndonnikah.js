/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Row, Col } from 'react-bootstrap';
import contractandonnikah from './contracts/contractandonnikah';
import Web3 from 'web3';
import axios from 'axios';
import api from './api';
import contract from './contract';

function SuratAndonnikah() {
  const [users, setUsers] = useState([]);
  const [andonnikahs, setAndonnikahs] = useState([]);
  const [newAndonnikah, setNewAndonnikah] = useState({
    userId: '', // Add default values for all fields
    namaPasangan: '',
    alamatPasangan: '',
    letterNumber: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const web3 = new Web3(window.ethereum);
  const [fileName, setFileName] = useState('');
  const [editingAndonnikah, setEditingAndonnikah] = useState(null);
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
  const [letterNumberFileName, setLetterNumberFileName] = useState('');
  const backendURL = 'http://localhost:5000';

  useEffect(() => {
    getUsers();
    getAndonnikahs();
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

  const getAndonnikahs = async () => {
    try {
      setIsLoading(true);
      const totalAndonnikahs = await contractandonnikah.methods.totalAndonnikahs().call();
      const andonnikahsArray = [];

      for (let i = 1; i <= totalAndonnikahs; i++) {
        const andonnikah = await contractandonnikah.methods.getAndonnikah(i).call();
        if (andonnikah.userId !== '') {
          andonnikahsArray.push(andonnikah);
        }
      }

      setAndonnikahs(andonnikahsArray);
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
        setNewAndonnikah({
          ...newAndonnikah,
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
        setEditingAndonnikah({
          ...editingAndonnikah,
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
      setEditingAndonnikah((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  

  const createAndonnikah = async () => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();
      const andonnikahCount = await contractandonnikah.methods.totalAndonnikahs().call();
      const andonnikahId = parseInt(andonnikahCount) + 1;
      const andonnikahWithId = {
        ...newAndonnikah,
        andonnikahId: andonnikahId.toString(),
        letterNumber: letterNumberFileName, // Use the filename for letterNumber
      };
      await contractandonnikah.methods.createAndonnikah(andonnikahWithId).send({ from: accounts[0] });
      api.post('/api/surat', andonnikahWithId);
      await getAndonnikahs();
      setNewAndonnikah({
        userId: '', // Reset the state after successful creation
        namaPasangan: '',
        alamatPasangan: '',
        letterNumber: null, // Reset the letterNumber state after successful creation
      });
      setLetterNumberFileName(null); // Reset the filename state after successful creation
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };  

  const updateAndonnikah = async (andonnikahId) => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();

      // If a new file was selected for aktaNotaris or letterNumber, upload it and get the filename
      let updatedAndonnikah = { ...editingAndonnikah };

      if (typeof editingAndonnikah.letterNumber === 'object') {
        // Save the updated file in the state directly for later use
        const formDataLetterNumber = new FormData();
        formDataLetterNumber.append('letterNumber', editingAndonnikah.letterNumber);
        const responseLetterNumber = await axios.post(`${backendURL}/api/upload`, formDataLetterNumber, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        updatedAndonnikah.letterNumber = responseLetterNumber.data.filename; // Use the filename returned from the server
      } else {
        updatedAndonnikah.letterNumber = letterNumberFileName; // Use the existing filename if not changed
      }

      await contractandonnikah.methods
        .updateAndonnikah(andonnikahId, updatedAndonnikah)
        .send({ from: accounts[0] });

        setSelectedFile(null);
        setEditingAndonnikah(null);
      await getAndonnikahs(); // Refresh the user list after updating the user
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAndonnikah = async (andonnikahId) => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();
      await contractandonnikah.methods.deleteAndonnikah(andonnikahs[andonnikahId].andonnikahId).send({ from: accounts[0] });
      await getAndonnikahs();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <h1>CRUD Surat Andon Nikah</h1>

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
              value={newAndonnikah.userId}
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
                Nama Pasangan
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="namaPasangan"
                  value={newAndonnikah.namaPasangan}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
		<br />
        <Form.Group as={Row}>
              <Form.Label column sm="2">
                Alamat Pasangan
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="alamatPasangan"
                  value={newAndonnikah.alamatPasangan}
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
        <label htmlFor="letterNumber">Surat Keterangan RT:</label>
        <input
          type="file"
          accept="application/pdf" // Specify the accepted file type to PDF
          name="letterNumber"
          onChange={handleInputChange}
          required
        />
        {letterNumberFileName && <p>Selected file Surat Keterangan RT: {letterNumberFileName}</p>}
        <br />

        <Button variant="primary" onClick={createAndonnikah}>
          Tambah
        </Button>
      </Form>

      <h2>Data Surat Belum Nikah</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID Pengguna</th>
              <th>Nama Pasangan</th>
              <th>Alamat Pasangan</th>
              <th>Surat Keterangan RT</th>
              {/* Add more table headers for other user fields */}
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
          {andonnikahs.map((andonnikah, index) => (
                <tr key={index}>
                  <td>{andonnikah.userId}</td>
                  <td>{andonnikah.namaPasangan}</td>
                  <td>{andonnikah.alamatPasangan}</td>
                  <td>{andonnikah.letterNumber}</td>
                  {/* Add more table cells for other user fields */}
                  <td>
                  <Button variant="primary" onClick={() => setEditingAndonnikah(andonnikah)}>
                      Edit
                    </Button>{' '}
                    <Button variant="danger" onClick={() => deleteAndonnikah(index)}>
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}

      {editingAndonnikah && (
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
                  value={editingAndonnikah.userId}
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
                Nama Pasangan
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="namaPasangan"
                  value={editingAndonnikah.namaPasangan}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Alamat Pasangan
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="alamatPasangan"
                  value={editingAndonnikah.alamatPasangan}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
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
            <Button variant="primary" onClick={() => updateAndonnikah(editingAndonnikah.andonnikahId)}>
              Simpan
            </Button>{" "}
            <Button variant="danger" onClick={() => setEditingAndonnikah(null)}>
              Batal
            </Button>
          </Form>
        </div>
      )}
    </Container>
  );
}

export default SuratAndonnikah;
