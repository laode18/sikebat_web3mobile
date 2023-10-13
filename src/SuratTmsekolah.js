import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Row, Col } from 'react-bootstrap';
import contracttmsekolah from './contracts/contracttmsekolah';
import Web3 from 'web3';
import axios from 'axios';
import api from './api';
import contract from './contract';

function SuratTmsekolah() {
  const [users, setUsers] = useState([]);
  const [tmsekolahs, setTmsekolahs] = useState([]);
  const [newTmsekolah, setNewTmsekolah] = useState({
    userId: '', // Add default values for all fields
    noKIP: '',
    namaOrangtua: '',
    namaSekolah: '',
    letterNumber: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const web3 = new Web3(window.ethereum);
  const [fileName, setFileName] = useState('');
  const [editingTmsekolah, setEditingTmsekolah] = useState(null);
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
    getTmsekolahs();
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

  const getTmsekolahs = async () => {
    try {
      setIsLoading(true);
      const totalTmsekolahs = await contracttmsekolah.methods.totalTmsekolahs().call();
      const tmsekolahsArray = [];

      for (let i = 1; i <= totalTmsekolahs; i++) {
        const tmsekolah = await contracttmsekolah.methods.getTmsekolah(i).call();
        if (tmsekolah.userId !== '') {
          tmsekolahsArray.push(tmsekolah);
        }
      }

      setTmsekolahs(tmsekolahsArray);
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
        setNewTmsekolah({
          ...newTmsekolah,
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
      setNewTmsekolah((prevState) => ({
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
        setEditingTmsekolah({
          ...editingTmsekolah,
          userId: value, // You can set the letterNumber to the userId if needed
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
      setEditingTmsekolah((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  

  const createTmsekolah = async () => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();
      const tmsekolahCount = await contracttmsekolah.methods.totalTmsekolahs().call();
      const tmsekolahId = parseInt(tmsekolahCount) + 1;
      const tmsekolahWithId = {
        ...newTmsekolah,
        tmsekolahId: tmsekolahId.toString(),
        letterNumber: letterNumberFileName, // Use the filename for letterNumber
      };
      await contracttmsekolah.methods.createTmsekolah(tmsekolahWithId).send({ from: accounts[0] });
      api.post('/api/surat', tmsekolahWithId);
      await getTmsekolahs();
      setNewTmsekolah({
        userId: '', // Reset the state after successful creation
        noKIP: '',
        namaOrangtua: '',
        namaSekolah: '',
        letterNumber: null, // Reset the letterNumber state after successful creation
      });
      setLetterNumberFileName(null); // Reset the filename state after successful creation
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };  

  const updateTmsekolah = async (tmsekolahId) => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();

      // If a new file was selected for aktaNotaris or letterNumber, upload it and get the filename
      let updatedTmsekolah = { ...editingTmsekolah };

      if (typeof editingTmsekolah.letterNumber === 'object') {
        // Save the updated file in the state directly for later use
        const formDataLetterNumber = new FormData();
        formDataLetterNumber.append('letterNumber', editingTmsekolah.letterNumber);
        const responseLetterNumber = await axios.post(`${backendURL}/api/upload`, formDataLetterNumber, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        updatedTmsekolah.letterNumber = responseLetterNumber.data.filename; // Use the filename returned from the server
      } else {
        updatedTmsekolah.letterNumber = letterNumberFileName; // Use the existing filename if not changed
      }

      await contracttmsekolah.methods
        .updateTmsekolah(tmsekolahId, updatedTmsekolah)
        .send({ from: accounts[0] });

        setSelectedFile(null);
        setEditingTmsekolah(null);
      await getTmsekolahs(); // Refresh the user list after updating the user
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTmsekolah = async (tmsekolahId) => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();
      await contracttmsekolah.methods.deleteTmsekolah(tmsekolahs[tmsekolahId].tmsekolahId).send({ from: accounts[0] });
      await getTmsekolahs();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <h1>CRUD Surat Keterangan Tidak Mampu Sekolah</h1>

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
              value={newTmsekolah.userId}
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
                No KIP
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="noKIP"
                  value={newTmsekolah.noKIP}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
		    <br />
        <Form.Group as={Row}>
              <Form.Label column sm="2">
                Nama Orang Tua / Wali
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="namaOrangtua"
                  value={newTmsekolah.namaOrangtua}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
		    <br />
        <Form.Group as={Row}>
              <Form.Label column sm="2">
                Nama Sekolah
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="namaSekolah"
                  value={newTmsekolah.namaSekolah}
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

        <Button variant="primary" onClick={createTmsekolah}>
          Tambah
        </Button>
      </Form>

      <h2>Data Surat Keterangan Tidak Mampu Sekolah</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID Pengguna</th>
              <th>No KIP</th>
              <th>Nama Orang Tua / Wali</th>
              <th>Nama Sekolah</th>
              <th>Surat Keterangan RT</th>
              {/* Add more table headers for other user fields */}
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
          {tmsekolahs.map((tmsekolah, index) => (
                <tr key={index}>
                  <td>{tmsekolah.userId}</td>
                  <td>{tmsekolah.noKIP}</td>
                  <td>{tmsekolah.namaOrangtua}</td>
                  <td>{tmsekolah.namaSekolah}</td>
                  <td>{tmsekolah.letterNumber}</td>
                  {/* Add more table cells for other user fields */}
                  <td>
                  <Button variant="primary" onClick={() => setEditingTmsekolah(tmsekolah)}>
                      Edit
                    </Button>{' '}
                    <Button variant="danger" onClick={() => deleteTmsekolah(index)}>
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}

      {editingTmsekolah && (
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
                  value={editingTmsekolah.userId}
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
                No KIP
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="noKIP"
                  value={editingTmsekolah.noKIP}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Nama Orang Tua / Wali
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="namaOrangtua"
                  value={editingTmsekolah.namaOrangtua}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Nama Sekolah
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="namaSekolah"
                  value={editingTmsekolah.namaSekolah}
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
            <Button variant="primary" onClick={() => updateTmsekolah(editingTmsekolah.tmsekolahId)}>
              Simpan
            </Button>{" "}
            <Button variant="danger" onClick={() => setEditingTmsekolah(null)}>
              Batal
            </Button>
          </Form>
        </div>
      )}
    </Container>
  );
}

export default SuratTmsekolah;
