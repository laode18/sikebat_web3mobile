import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Row, Col } from 'react-bootstrap';
import contractinformasi from './contracts/contractinformasi';
import Web3 from 'web3';
import axios from 'axios';
import api from './api';
import contract from './contract';

function Informasi() {
  const [informasis, setInformasis] = useState([]);
  const [newInformasi, setNewInformasi] = useState({
    judul: '', // Add default values for all fields
    tanggal: '',
    sumber: '',
    gambar: '',
    isiInformasi: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const web3 = new Web3(window.ethereum);
  const [editingInformasi, setEditingInformasi] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [gambarFileName, setGambarFileName] = useState('');
  const backendURL = 'http://localhost:5000';

  useEffect(() => {
    getInformasis();
  }, []);

  const getInformasis = async () => {
    try {
      setIsLoading(true);
      const totalInformasis = await contractinformasi.methods.totalInformasis().call();
      const informasisArray = [];

      for (let i = 1; i <= totalInformasis; i++) {
        const informasi = await contractinformasi.methods.getInformasi(i).call();
        if (informasi.judul !== '') {
          informasisArray.push(informasi);
        }
      }

      setInformasis(informasisArray);
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
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

  if (!allowedTypes.includes(file.type)) {
    alert('File must be in JPG, JPEG, or PNG format.');
    return;
  }

  // Move file upload logic to a separate function
  uploadFile(name, file);

    } else {
      setNewInformasi((prevState) => ({
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
        if (name === 'gambar') {
          setGambarFileName(response.data.filename);
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
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

  if (!allowedTypes.includes(file.type)) {
    alert('File must be in JPG, JPEG, or PNG format.');
    return;
  }

  // Move file upload logic to a separate function
  uploadFile(name, file);

    } else {
      setEditingInformasi((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  

  const createInformasi = async () => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();
      const informasiCount = await contractinformasi.methods.totalInformasis().call();
      const informasiId = parseInt(informasiCount) + 1;
      const informasiWithId = {
        ...newInformasi,
        informasiId: informasiId.toString(),
        gambar: gambarFileName, // Use the filename for letterNumber
      };
      await contractinformasi.methods.createInformasi(informasiWithId).send({ from: accounts[0] });
      api.post('/api/surat', informasiWithId);
      await getInformasis();
      setNewInformasi({
        judul: '', // Reset the state after successful creation
        tanggal: '',
        sumber: '',
        gambar: null,
        isiInformasi: '', // Reset the letterNumber state after successful creation
      });
      setGambarFileName(null); // Reset the filename state after successful creation
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };  

  const updateInformasi = async (informasiId) => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();

      // If a new file was selected for aktaNotaris or letterNumber, upload it and get the filename
      let updatedInformasi = { ...editingInformasi };

      if (typeof editingInformasi.gambar === 'object') {
        // Save the updated file in the state directly for later use
        const formDataGambar = new FormData();
        formDataGambar.append('gambar', editingInformasi.gambar);
        const responseLetterNumber = await axios.post(`${backendURL}/api/upload`, formDataGambar, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        updatedInformasi.gambar = responseLetterNumber.data.filename; // Use the filename returned from the server
      } else {
        updatedInformasi.gambar = gambarFileName; // Use the existing filename if not changed
      }

      await contractinformasi.methods
        .updateInformasi(informasiId, updatedInformasi)
        .send({ from: accounts[0] });

        setSelectedFile(null);
        setEditingInformasi(null);
      await getInformasis(); // Refresh the user list after updating the user
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteInformasi = async (informasiId) => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();
      await contractinformasi.methods.deleteInformasi(informasis[informasiId].informasiId).send({ from: accounts[0] });
      await getInformasis();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <h1>CRUD Informasi</h1>

      <h2>Tambah Data</h2>
      <Form>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            Judul Informasi
          </Form.Label>
          <Col sm="10">
                <Form.Control
                  type="text"
                  name="judul"
                  value={newInformasi.judul}
                  onChange={handleInputChange}
                />
              </Col>
        </Form.Group>
        <br />
        <Form.Group as={Row}>
              <Form.Label column sm="2">
                Tanggal
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="tanggal"
                  value={newInformasi.tanggal}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
		    <br />
        <Form.Group as={Row}>
              <Form.Label column sm="2">
                Sumber
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="sumber"
                  value={newInformasi.sumber}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
		    <br />
        <Form.Group as={Row}>
              <Form.Label column sm="2">
                Isi Informasi
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="isiInformasi"
                  value={newInformasi.isiInformasi}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>
		    <br />
            
        {/* Add more form inputs for other user fields */}
        <label htmlFor="gambar">Gambar:</label>
        <input
          type="file"
          accept="image/jpeg, image/png, image/jpg" // Specify the accepted file type to PDF
          name="gambar"
          onChange={handleInputChange}
          required
        />
        {gambarFileName && <p>Selected file Surat Keterangan RT: {gambarFileName}</p>}
        <br />

        <Button variant="primary" onClick={createInformasi}>
          Tambah
        </Button>
      </Form>

      <h2>Data Informasi</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Judul</th>
              <th>Tanggal</th>
              <th>Sumber</th>
              <th>Isi Informasi</th>
              <th>Gambar</th>
              {/* Add more table headers for other user fields */}
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
          {informasis.map((informasi, index) => (
                <tr key={index}>
                  <td>{informasi.judul}</td>
                  <td>{informasi.tanggal}</td>
                  <td>{informasi.sumber}</td>
                  <td>{informasi.isiInformasi}</td>
                  <td>{informasi.gambar}</td>
                  {/* Add more table cells for other user fields */}
                  <td>
                  <Button variant="primary" onClick={() => setEditingInformasi(informasi)}>
                      Edit
                    </Button>{' '}
                    <Button variant="danger" onClick={() => deleteInformasi(index)}>
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}

      {editingInformasi && (
        <div>
          <h2>Edit Data</h2>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Judul Informasi
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="judul"
                  value={editingInformasi.judul}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Tanggal
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="tanggal"
                  value={editingInformasi.tanggal}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Sumber
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="sumber"
                  value={editingInformasi.sumber}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Isi Informasi
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="isiInformasi"
                  value={editingInformasi.isiInformasi}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <label htmlFor="gambar">Gambar:</label>
              <input
                type="file"
                accept="image/jpeg, image/png, image/jpg" // Specify the accepted file type to PDF
                name="gambar"
                onChange={handleEditInputChange}
                required
              />
              {gambarFileName && <p>Selected file Surat Keterangan RT: {gambarFileName}</p>}
              <br />

            {/* Add more form inputs for other user fields */}
            <Button variant="primary" onClick={() => updateInformasi(editingInformasi.informasiId)}>
              Simpan
            </Button>{" "}
            <Button variant="danger" onClick={() => setEditingInformasi(null)}>
              Batal
            </Button>
          </Form>
        </div>
      )}
    </Container>
  );
}

export default Informasi;
