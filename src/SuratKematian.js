import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Row, Col } from 'react-bootstrap';
import contractkematian from './contracts/contractkematian';
import Web3 from 'web3';
import axios from 'axios';
import api from './api';
import contract from './contract';

function SuratKematian() {
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
  const [isLoading, setIsLoading] = useState(false);
  const web3 = new Web3(window.ethereum);
  const [fileName, setFileName] = useState('');
  const [editingKematian, setEditingKematian] = useState(null);
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
      const selectedUser = users.find((user) => user.userId === value);
      if (selectedUser) {
        setNewKematian({
          ...newKematian,
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
      const selectedUser = users.find((user) => user.userId === value);
      if (selectedUser) {
        setEditingKematian({
          ...editingKematian,
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
      setEditingKematian((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  

  const createKematian = async () => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();
      const kematianCount = await contractkematian.methods.totalKematians().call();
      const kematianId = parseInt(kematianCount) + 1;
      const kematianWithId = {
        ...newKematian,
        kematianId: kematianId.toString(),
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
    <Container>
      <h1>CRUD Surat Kematian</h1>

      <h2>Tambah Data</h2>
      <Form>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            Nama Akun
          </Form.Label>
          <Col sm="10">
            <Form.Control
              as="select"
              name="userId"
              value={newKematian.userId}
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
                Nama Almarhum
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="namaAlmarhum"
                  value={newKematian.namaAlmarhum}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
		    <br />
        <Form.Group as={Row}>
              <Form.Label column sm="2">
                Tanggal Meninggal
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="tanggalMeninggal"
                  value={newKematian.tanggalMeninggal}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
		    <br />
        <Form.Group as={Row}>
              <Form.Label column sm="2">
                Jam Meninggal
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="jamMeninggal"
                  value={newKematian.jamMeninggal}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
		    <br />
        <Form.Group as={Row}>
              <Form.Label column sm="2">
                Lokasi Meninggal
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="lokasiMeninggal"
                  value={newKematian.lokasiMeninggal}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
		    <br />
        <Form.Group as={Row}>
              <Form.Label column sm="2">
                Penyebab Meninggal
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="penyebabMeninggal"
                  value={newKematian.penyebabMeninggal}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
		    <br />
        <Form.Group as={Row}>
              <Form.Label column sm="2">
                Usia Saat Meninggal
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="usia"
                  value={newKematian.usia}
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

        <Button variant="primary" onClick={createKematian}>
          Tambah
        </Button>
      </Form>

      <h2>Data Surat Kematian</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID Pengguna</th>
              <th>Nama Almarhum</th>
              <th>Tanggal Meninggal</th>
              <th>Jam Meninggal</th>
              <th>Lokasi Meninggal</th>
              <th>Penyebab Meninggal</th>
              <th>Usia Saat Meninggal</th>
              <th>Surat Keterangan RT</th>
              {/* Add more table headers for other user fields */}
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
          {kematians.map((kematian, index) => (
                <tr key={index}>
                  <td>{kematian.userId}</td>
                  <td>{kematian.namaAlmarhum}</td>
                  <td>{kematian.tanggalMeninggal}</td>
                  <td>{kematian.jamMeninggal}</td>
                  <td>{kematian.lokasiMeninggal}</td>
                  <td>{kematian.penyebabMeninggal}</td>
                  <td>{kematian.usia}</td>
                  <td>{kematian.letterNumber}</td>
                  {/* Add more table cells for other user fields */}
                  <td>
                  <Button variant="primary" onClick={() => setEditingKematian(kematian)}>
                      Edit
                    </Button>{' '}
                    <Button variant="danger" onClick={() => deleteKematian(index)}>
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}

      {editingKematian && (
        <div>
          <h2>Edit Data</h2>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Nama Akun
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  as="select"
                  name="userId"
                  value={editingKematian.userId}
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
                Nama Almarhum
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="namaAlmarhum"
                  value={editingKematian.namaAlmarhum}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Tanggal Meninggal
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="tanggalMeninggal"
                  value={editingKematian.tanggalMeninggal}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Jam Meninggal
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="jamMeninggal"
                  value={editingKematian.jamMeninggal}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Lokasi Meninggal
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="lokasiMeninggal"
                  value={editingKematian.lokasiMeninggal}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Penyebab Meninggal
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="penyebabMeninggal"
                  value={editingKematian.penyebabMeninggal}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Usia Saat Meninggal
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="usia"
                  value={editingKematian.usia}
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
            <Button variant="primary" onClick={() => updateKematian(editingKematian.kematianId)}>
              Simpan
            </Button>{" "}
            <Button variant="danger" onClick={() => setEditingKematian(null)}>
              Batal
            </Button>
          </Form>
        </div>
      )}
    </Container>
  );
}

export default SuratKematian;
