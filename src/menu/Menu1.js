/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './css/Menu1.css'; // Import stylesheet for custom styling
import { Card, CardGroup } from 'react-bootstrap';
import { CardContent, CardMedia, Typography, Container, Grid, Button } from '@mui/material';
import contractinformasi from './contracts/contractinformasi';
import axios from 'axios';
import api from 'src/api';
import Web3 from 'web3';
import Modal from 'react-modal';

const modalStyle = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#fff',
    maxWidth: '500px',
  },
};

const menuData = [
  {
    id: 1,
    title: 'Total Penduduk',
    imageSrc: 'assets/icon1.png',
    description: '12 Orang',
  },
  {
    id: 2,
    title: 'Total Keluarga',
    imageSrc: 'assets/icon2.png',
    description: '15 Keluarga',
  },
  {
    id: 3,
    title: 'Total Laki-Laki',
    imageSrc: 'assets/icon4.png',
    description: '12 Orang',
  },
  {
    id: 4,
    title: 'Total Perempuan',
    imageSrc: 'assets/icon3.png',
    description: '15 Keluarga',
  },
  // Tambahkan data untuk menu-item berikutnya di sini
];

const menuItems = [
  {
    image: 'assets/berita1.jpg', // Ganti dengan URL atau path gambar pertama
    text: 'Menu 1 Content 1',
  },
  {
    image: 'assets/berita2.jpg', // Ganti dengan URL atau path gambar kedua
    text: 'Menu 1 Content 2',
  },
  // ... Lanjutkan untuk item lainnya
];

const Menu1 = () => {
  const [informasis, setInformasis] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const web3 = new Web3(window.ethereum);
  const [editingInformasi, setEditingInformasi] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [gambarFileName, setGambarFileName] = useState('');
  const backendURL = 'http://localhost:5000';
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

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

  return (
    <div className="menu1-container">
      
      <Carousel autoPlay interval={3000} infiniteLoop showThumbs={false} showStatus={true}>
        <div>
          <img src="assets/berita1.jpg" alt="Image 1" />
        </div>
        <div>
          <img src="assets/berita2.jpg" alt="Image 2" />
        </div>
        <div>
          <img src="assets/berita3.jpg" alt="Image 3" />
        </div>
        <div>
          <img src="assets/berita1.jpg" alt="Image 4" />
        </div>
      </Carousel>

      <h2 style={{ textAlign: 'left', paddingTop: '5px' }}>Informasi</h2>
      <CardGroup style={{ display: 'flex', overflowX: 'scroll', scrollSnapType: 'x mandatory' }}>
        {menuData.map((menu) => (
          <Card key={menu.id} style={{ flex: '1', minWidth: '120px', maxWidth: '150px', margin: '0 20px', scrollSnapAlign: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: '120px', maxWidth: '120px' }}>
              <Card.Img variant="top" src={menu.imageSrc} />
              <Card.Body>
                <Card.Title>{menu.title}</Card.Title>
                <Card.Text>{menu.description}</Card.Text>
              </Card.Body>
            </div>
          </Card>
        ))}
      </CardGroup>

      <h2 style={{ textAlign: 'left', paddingTop: '5px' }}>Berita</h2>
      <Container style={{ marginBottom: '40px' }}>
      <Grid container spacing={2}>
      {informasis.map((informasi, index) => {
        return (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={`http://localhost:5000/api/uploads/${informasi.gambar}`}
                alt={`Menu ${index + 1}`}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {informasi.judul}
                </Typography>
                <Button style={{ backgroundColor: 'blue', color: 'white' }} onClick={() => {
            openModal();
            setEditingInformasi(informasi);
        }}>Lihat</Button>
              </CardContent>
            </Card>
          </Grid>
          );
        })}
      </Grid>
    </Container>
    {editingInformasi && (
    <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyle}
        contentLabel="Contoh Modal"
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={closeModal}>X</button>
        </div>
        <h2 style={{ textAlign: 'center' }}>Informasi</h2>
        <center>
        <img
          className="img"
          src={`http://localhost:5000/api/uploads/${editingInformasi.gambar}`}
          alt=""
          style={{ width: '250px', height: '150px' }}
        />
        </center>
        <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '13pt' }}>{editingInformasi.judul}</p>
        <div style={{ paddingLeft: '20px', paddingRight: '30px' }}>
        <tr>
          <td>Tanggal</td>
          <td>:</td>
          <td>{editingInformasi.tanggal}</td>
        </tr>
        <tr>
          <td>Sumber</td>
          <td>:</td>
          <td>{editingInformasi.sumber}</td>
        </tr>
        <tr>
          <td>Informasi</td>
          <td>:</td>
          <td style={{ width: '70%', textAlign: 'justify' }}>{editingInformasi.isiInformasi}</td>
        </tr>
        </div>
      </Modal>
    )}
    </div>
  );
};

export default Menu1;
