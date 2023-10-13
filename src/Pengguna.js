import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Row, Col } from 'react-bootstrap';
import contract from './contract';
import Web3 from 'web3';

function Pengguna() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({});
  const [editingUser, setEditingUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const web3 = new Web3(window.ethereum);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      setIsLoading(true);
      const totalUsers = await contract.methods.totalUsers().call();
      const usersArray = [];

      for (let i = 1; i <= totalUsers; i++) {
        const user = await contract.methods.getUser(i).call();
        if (user.username !== "") {
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditingUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const createUser = async () => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();

      const usernameExists = users.some(user => user.username === newUser.username);
      if (usernameExists) {
        console.error("Username already exists");
        setIsLoading(false);
        return;
      }

      const userCount = await contract.methods.totalUsers().call();
      const userId = parseInt(userCount) + 1;
      const userWithId = { ...newUser, userId: userId.toString() };
      await contract.methods.createUser(userWithId).send({ from: accounts[0] });
      setNewUser({});
      await getUsers(); // Refresh the user list after creating a new user
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateUser = async (userId) => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();
      const userToUpdate = users.find((user) => user.userId === userId.toString());

      const usernameExists = users.some(user => user.username === editingUser.username);
      if (usernameExists && userToUpdate.username !== editingUser.username) {
        console.error("Username already exists");
        setIsLoading(false);
        return;
      }

      
      const updatedUser = {
        ...userToUpdate,
        ...editingUser
      };
  
      await contract.methods.updateUser(userId, updatedUser).send({ from: accounts[0] });
      setEditingUser({});
      await getUsers(); // Refresh the user list after updating the user
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const deleteUser = async (userId) => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();
      await contract.methods.deleteUser(users[userId].userId).send({ from: accounts[0] }); // Menggunakan akun pertama sebagai pengirim transaksi
      await getUsers();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container style={{ width: '3000px' }}>
      <h1>CRUD Pengguna</h1>

      <h2>Tambah Pengguna</h2>
      <Form>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            Username
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" name="username" value={newUser.username || ''} onChange={handleInputChange} />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            Password
          </Form.Label>
          <Col sm="10">
            <Form.Control type="password" name="password" value={newUser.password || ''} onChange={handleInputChange} />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            ID Wallet
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" name="walletId" value={newUser.walletId || ''} onChange={handleInputChange} />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            Nomor Induk Kependudukan
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" name="nik" value={newUser.nik || ''} onChange={handleInputChange} />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            Nomor Kartu Keluarga
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" name="kkNumber" value={newUser.kkNumber || ''} onChange={handleInputChange} />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            Nama Lengkap
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" name="fullName" value={newUser.fullName || ''} onChange={handleInputChange} />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            Tanggal Lahir
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" name="birthDate" value={newUser.birthDate || ''} onChange={handleInputChange} />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            Jenis Kelamin
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" name="gender" value={newUser.gender || ''} onChange={handleInputChange} />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            Agama
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" name="religion" value={newUser.religion || ''} onChange={handleInputChange} />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            Kewarganegaraan
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" name="nationality" value={newUser.nationality || ''} onChange={handleInputChange} />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            Status Pendidikan
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" name="educationStatus" value={newUser.educationStatus || ''} onChange={handleInputChange} />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            Status Perkawinan
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" name="maritalStatus" value={newUser.maritalStatus || ''} onChange={handleInputChange} />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            Pekerjaan
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" name="occupation" value={newUser.occupation || ''} onChange={handleInputChange} />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            Alamat
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" name="alamat" value={newUser.alamat || ''} onChange={handleInputChange} />
          </Col>
        </Form.Group>
        {/* Add more form inputs for other user fields */}
        <Button variant="primary" onClick={createUser}>
          Tambah
        </Button>
      </Form>

      <h2>Daftar Pengguna</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Username</th>
              <th>Password</th>
              <th>ID Wallet</th>
              <th>NIK</th>
              <th>No KK</th>
              <th>Nama Lengkap</th>
              <th>Tanggal Lahir</th>
              <th>Jenis Kelamin</th>
              <th>Agama</th>
              <th>Kewarganegaraan</th>
              <th>Status Pendidikan</th>
              <th>Status Perkawinan</th>
              <th>Pekerjaan</th>
              <th>Alamat</th>
              {/* Add more table headers for other user fields */}
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.username}</td>
                <td>{user.password}</td>
                <td>{user.walletId}</td>
                <td>{user.nik}</td>
                <td>{user.kkNumber}</td>
                <td>{user.fullName}</td>
                <td>{user.birthDate}</td>
                <td>{user.gender}</td>
                <td>{user.religion}</td>
                <td>{user.nationality}</td>
                <td>{user.educationStatus}</td>
                <td>{user.maritalStatus}</td>
                <td>{user.occupation}</td>
                <td>{user.alamat}</td>
                {/* Add more table cells for other user fields */}
                <td>
                  <Button variant="primary" onClick={() => setEditingUser(user)}>
                    Edit
                  </Button>{' '}
                  <Button variant="danger" onClick={() => deleteUser(index)}>
                    Hapus
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {editingUser.username && (
        <div>
          <h2>Edit Pengguna</h2>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Username
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="username"
                  value={editingUser.username}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Password
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="password"
                  name="password"
                  value={editingUser.password}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                ID Wallet
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="walletId"
                  value={editingUser.walletId}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Nomor Induk Kependudukan
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="nik"
                  value={editingUser.nik}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Nomor Kartu Keluarga
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="kkNumber"
                  value={editingUser.kkNumber}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Nama Lengkap
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="fullName"
                  value={editingUser.fullName}
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
                  name="birthDate"
                  value={editingUser.birthDate}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Jenis Kelamin
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="gender"
                  value={editingUser.gender}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Agama
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="religion"
                  value={editingUser.religion}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Kewarganegaraan
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="nationality"
                  value={editingUser.nationality}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Status Pendidikan
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="educationStatus"
                  value={editingUser.educationStatus}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Status Perkawinan
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="maritalStatus"
                  value={editingUser.maritalStatus}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Pekerjaan
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="occupation"
                  value={editingUser.occupation}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Alamat
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="alamat"
                  value={editingUser.alamat}
                  onChange={handleEditInputChange}
                />
              </Col>
            </Form.Group>
            {/* Add more form inputs for other user fields */}
            <Button variant="primary" onClick={() => updateUser(editingUser.userId)}>
              Simpan
            </Button>
          </Form>
        </div>
      )}
    </Container>
  );
}

export default Pengguna;
