import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Row, Col } from 'react-bootstrap';
import contractkelahiran from './contracts/contractkelahiran';
import Web3 from 'web3';
import axios from 'axios';
import api from './api';
import contract from './contract';

function SuratKelahiran() {
  const [users, setUsers] = useState([]);
  const [kelahirans, setKelahirans] = useState([]);
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
  const [isLoading, setIsLoading] = useState(false);
  const web3 = new Web3(window.ethereum);
  const [fileName, setFileName] = useState('');
  const [editingKelahiran, setEditingKelahiran] = useState(null);
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
      const selectedUser = users.find((user) => user.userId === value);
      if (selectedUser) {
        setNewKelahiran({
          ...newKelahiran,
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
      const selectedUser = users.find((user) => user.userId === value);
      if (selectedUser) {
        setEditingKelahiran({
          ...editingKelahiran,
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
      setEditingKelahiran((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  

  const createKelahiran = async () => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();
      const kelahiranCount = await contractkelahiran.methods.totalKelahirans().call();
      const kelahiranId = parseInt(kelahiranCount) + 1;
      const kelahiranWithId = {
        ...newKelahiran,
        kelahiranId: kelahiranId.toString(),
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
    <Container>
      <h1>CRUD Surat Kelahiran</h1>

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
              value={newKelahiran.userId}
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
                Nama Ayah
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="namaAyah"
                  value={newKelahiran.namaAyah}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
		    <br />
        <Form.Group as={Row}>
              <Form.Label column sm="2">
                Nama Ibu
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="namaIbu"
                  value={newKelahiran.namaIbu}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
		    <br />
        <Form.Group as={Row}>
              <Form.Label column sm="2">
                Nama Anak
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="namaAnak"
                  value={newKelahiran.namaAnak}
                  onChange={handleInputChange}
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
                  name="tanggalLahir"
                  value={newKelahiran.tanggalLahir}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
		    <br />
        <Form.Group as={Row}>
              <Form.Label column sm="2">
                Jenis Kelamin Anak
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="jenisKelamin"
                  value={newKelahiran.jenisKelamin}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
		    <br />
        <Form.Group as={Row}>
              <Form.Label column sm="2">
                Anak Ke
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="anakKe"
                  value={newKelahiran.anakKe}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
		    <br />
        <Form.Group as={Row}>
              <Form.Label column sm="2">
                Jam Lahir
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="jamLahir"
                  value={newKelahiran.jamLahir}
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

        <Button variant="primary" onClick={createKelahiran}>
          Tambah
        </Button>
      </Form>

      <h2>Data Surat Kelahiran</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID Pengguna</th>
              <th>Nama Ayah</th>
              <th>Nama Ibu</th>
              <th>Nama Anak</th>
              <th>Tanggal Lahir</th>
              <th>Jenis Kelamin Anak</th>
              <th>Anak Ke</th>
              <th>Jam Lahir</th>
              <th>Surat Keterangan RT</th>
              {/* Add more table headers for other user fields */}
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
          {kelahirans.map((kelahiran, index) => (
                <tr key={index}>
                  <td>{kelahiran.userId}</td>
                  <td>{kelahiran.namaAyah}</td>
                  <td>{kelahiran.namaIbu}</td>
                  <td>{kelahiran.namaAnak}</td>
                  <td>{kelahiran.tanggalLahir}</td>
                  <td>{kelahiran.jenisKelamin}</td>
                  <td>{kelahiran.anakKe}</td>
                  <td>{kelahiran.jamLahir}</td>
                  <td>{kelahiran.letterNumber}</td>
                  {/* Add more table cells for other user fields */}
                  <td>
                  <Button variant="primary" onClick={() => setEditingKelahiran(kelahiran)}>
                      Edit
                    </Button>{' '}
                    <Button variant="danger" onClick={() => deleteKelahiran(index)}>
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}

      {editingKelahiran && (
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
                  value={editingKelahiran.userId}
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
                Nama Ayah
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="namaAyah"
                  value={editingKelahiran.namaAyah}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Nama Ibu
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="namaIbu"
                  value={editingKelahiran.namaIbu}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Nama Anak
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="namaAnak"
                  value={editingKelahiran.namaAnak}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Tanggal Lahir
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="tanggalLahir"
                  value={editingKelahiran.tanggalLahir}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Jenis Kelamin Anak
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="jenisKelamin"
                  value={editingKelahiran.jenisKelamin}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Anak Ke
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="anakKe"
                  value={editingKelahiran.anakKe}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Jam Lahir
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="jamLahir"
                  value={editingKelahiran.jamLahir}
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
            <Button variant="primary" onClick={() => updateKelahiran(editingKelahiran.kelahiranId)}>
              Simpan
            </Button>{" "}
            <Button variant="danger" onClick={() => setEditingKelahiran(null)}>
              Batal
            </Button>
          </Form>
        </div>
      )}
    </Container>
  );
}

export default SuratKelahiran;
