import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Row, Col } from 'react-bootstrap';
import contractpindah from './contracts/contractpindah';
import Web3 from 'web3';
import axios from 'axios';
import api from './api';
import contract from './contract';

function SuratPindah() {
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
  const [isLoading, setIsLoading] = useState(false);
  const web3 = new Web3(window.ethereum);
  const [fileName, setFileName] = useState('');
  const [editingPindah, setEditingPindah] = useState(null);
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
      const selectedUser = users.find((user) => user.userId === value);
      if (selectedUser) {
        setNewPindah({
          ...newPindah,
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
      const selectedUser = users.find((user) => user.userId === value);
      if (selectedUser) {
        setEditingPindah({
          ...editingPindah,
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
      setEditingPindah((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  

  const createPindah = async () => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();
      const pindahCount = await contractpindah.methods.totalPindahs().call();
      const pindahId = parseInt(pindahCount) + 1;
      const pindahWithId = {
        ...newPindah,
        pindahId: pindahId.toString(),
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
    <Container>
      <h1>CRUD Surat Pindah</h1>

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
              value={newPindah.userId}
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
                Kota Tujuan
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="kotaTujuan"
                  value={newPindah.kotaTujuan}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
		    <br />
        <Form.Group as={Row}>
              <Form.Label column sm="2">
                Kelurahan Tujuan
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="kelurahanTujuan"
                  value={newPindah.kelurahanTujuan}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
		    <br />
        <Form.Group as={Row}>
              <Form.Label column sm="2">
                Alamat Tujuan
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="alamatTujuan"
                  value={newPindah.alamatTujuan}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
		    <br />
        <Form.Group as={Row}>
              <Form.Label column sm="2">
                RT Tujuan
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="rtTujuan"
                  value={newPindah.rtTujuan}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
		    <br />
        <Form.Group as={Row}>
              <Form.Label column sm="2">
                RW Tujuan
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="rwTujuan"
                  value={newPindah.rwTujuan}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
		    <br />
        <Form.Group as={Row}>
              <Form.Label column sm="2">
                Alasan Pindah
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="alasanPindah"
                  value={newPindah.alasanPindah}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
		    <br />
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Tanggal Pindah
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="tanggalPindah"
                  value={newPindah.tanggalPindah}
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

        <Button variant="primary" onClick={createPindah}>
          Tambah
        </Button>
      </Form>

      <h2>Data Surat Pindah</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID Pengguna</th>
              <th>Kota Tujuan</th>
              <th>Kelurahan Tujuan</th>
              <th>Alamat Tujuan</th>
              <th>RT Tujuan</th>
              <th>RW Tujuan</th>
              <th>Alasan Pindah</th>
              <th>Tanggal Pindah</th>
              <th>Surat Keterangan RT</th>
              {/* Add more table headers for other user fields */}
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
          {pindahs.map((pindah, index) => (
                <tr key={index}>
                  <td>{pindah.userId}</td>
                  <td>{pindah.kotaTujuan}</td>
                  <td>{pindah.kelurahanTujuan}</td>
                  <td>{pindah.alamatTujuan}</td>
                  <td>{pindah.rtTujuan}</td>
                  <td>{pindah.rwTujuan}</td>
                  <td>{pindah.alasanPindah}</td>
                  <td>{pindah.tanggalPindah}</td>
                  <td>{pindah.letterNumber}</td>
                  {/* Add more table cells for other user fields */}
                  <td>
                  <Button variant="primary" onClick={() => setEditingPindah(pindah)}>
                      Edit
                    </Button>{' '}
                    <Button variant="danger" onClick={() => deletePindah(index)}>
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}

      {editingPindah && (
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
                  value={editingPindah.userId}
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
                Kota Tujuan
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="kotaTujuan"
                  value={editingPindah.kotaTujuan}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Kelurahan Tujuan
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="kelurahanTujuan"
                  value={editingPindah.kelurahanTujuan}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Alamat Tujuan
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="alamatTujuan"
                  value={editingPindah.alamatTujuan}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                RT Tujuan
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="rtTujuan"
                  value={editingPindah.rtTujuan}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                RW Tujuan
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="rwTujuan"
                  value={editingPindah.rwTujuan}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Alasan Pindah
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="alasanPindah"
                  value={editingPindah.alasanPindah}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Tanggal Pindah
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="tanggalPindah"
                  value={editingPindah.tanggalPindah}
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
            <Button variant="primary" onClick={() => updatePindah(editingPindah.pindahId)}>
              Simpan
            </Button>{" "}
            <Button variant="danger" onClick={() => setEditingPindah(null)}>
              Batal
            </Button>
          </Form>
        </div>
      )}
    </Container>
  );
}

export default SuratPindah;
