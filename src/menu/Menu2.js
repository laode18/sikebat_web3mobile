/* eslint-disable prettier/prettier */
// Menu2.js
import React from 'react';
import { Card, CardGroup } from 'react-bootstrap';

const menuData = [
  {
    id: 1,
    title: 'Surat Kependudukan',
    imageSrc: 'assets/docs.png',
    link: '/suratkependudukan',
  },
  {
    id: 2,
    title: 'Surat Kelahiran',
    imageSrc: 'assets/docs.png',
    link: '/suratkelahiran',
  },
  {
    id: 3,
    title: 'Surat Kematian',
    imageSrc: 'assets/docs.png',
    link: '/suratkematian',
  },
  // Tambahkan data untuk menu-item berikutnya di sini
];

const menuData1 = [
  {
    id: 1,
    title: 'Surat Belum Nikah',
    imageSrc: 'assets/docs.png',
    link: '/suratbelumnikah',
  },
  {
    id: 2,
    title: 'Surat Andon Nikah',
    imageSrc: 'assets/docs.png',
    link: '/suratandonnikah',
  },
  {
    id: 3,
    title: 'Surat Tidak Mampu Sekolah',
    imageSrc: 'assets/docs.png',
    link: '/surattidakmampusekolah',
  },
  // Tambahkan data untuk menu-item berikutnya di sini
];

const menuData2 = [
  {
    id: 1,
    title: 'Surat Tidak Mampu RS',
    imageSrc: 'assets/docs.png',
    link: '/surattidakmampurs',
  },
  {
    id: 2,
    title: 'Surat Mempunyai Usaha',
    imageSrc: 'assets/docs.png',
    link: '/suratmempunyaiusaha',
  },
  {
    id: 3,
    title: 'Surat SKCK',
    imageSrc: 'assets/docs.png',
    link: '/suratskck',
  },
  // Tambahkan data untuk menu-item berikutnya di sini
];

const menuData3 = [
  {
    id: 1,
    title: 'Surat Bersih Diri',
    imageSrc: 'assets/docs.png',
    link: '/suratbersihdiri',
  },
  {
    id: 2,
    title: 'Surat Domisili Yayasan',
    imageSrc: 'assets/docs.png',
    link: '/suratdomisiliyayasan',
  },
  {
    id: 3,
    title: 'Surat Domisili Perusahaan',
    imageSrc: 'assets/docs.png',
    link: '/suratdomisiliperusahaan',
  },
  // Tambahkan data untuk menu-item berikutnya di sini
];

const menuData4 = [
  {
    id: 1,
  },
  {
    id: 2,
    title: 'Surat Pindah',
    imageSrc: 'assets/docs.png',
    link: '/suratpindah',
  },
  {
    id: 3,
  },
  // Tambahkan data untuk menu-item berikutnya di sini
];

const Menu2 = () => {
  return ( 
    <>
    <h2>Layanan</h2>
    <CardGroup style={{ display: 'flex', overflowX: 'scroll', marginTop: '30px' }}>
      {menuData.map((menu) => (
        <a key={menu.id} href={menu.link} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Card style={{ flex: '1', minWidth: '65px', maxWidth: '65px', margin: '0 22px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: '75px', maxWidth: '75px' }}>
              <Card.Img variant="top" src={menu.imageSrc} />
              <Card.Body>
                <Card.Title style={{ textAlign: 'center' }}>{menu.title}</Card.Title>
              </Card.Body>
            </div>
          </Card>
        </a>
      ))}
    </CardGroup>
    <CardGroup style={{ display: 'flex', overflowX: 'scroll', marginTop: '30px' }}>
      {menuData1.map((menu) => (
        <a key={menu.id} href={menu.link} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Card style={{ flex: '1', minWidth: '65px', maxWidth: '65px', margin: '0 22px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: '75px', maxWidth: '75px' }}>
              <Card.Img variant="top" src={menu.imageSrc} />
              <Card.Body>
                <Card.Title style={{ textAlign: 'center' }}>{menu.title}</Card.Title>
              </Card.Body>
            </div>
          </Card>
        </a>
      ))}
    </CardGroup>
    <CardGroup style={{ display: 'flex', overflowX: 'scroll', marginTop: '30px' }}>
      {menuData2.map((menu) => (
        <a key={menu.id} href={menu.link} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Card style={{ flex: '1', minWidth: '65px', maxWidth: '65px', margin: '0 22px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: '75px', maxWidth: '75px' }}>
              <Card.Img variant="top" src={menu.imageSrc} />
              <Card.Body>
                <Card.Title style={{ textAlign: 'center' }}>{menu.title}</Card.Title>
              </Card.Body>
            </div>
          </Card>
        </a>
      ))}
    </CardGroup>
    <CardGroup style={{ display: 'flex', overflowX: 'scroll', marginTop: '30px' }}>
      {menuData3.map((menu) => (
        <a key={menu.id} href={menu.link} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Card style={{ flex: '1', minWidth: '65px', maxWidth: '65px', margin: '0 22px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: '75px', maxWidth: '75px' }}>
              <Card.Img variant="top" src={menu.imageSrc} />
              <Card.Body>
                <Card.Title style={{ textAlign: 'center' }}>{menu.title}</Card.Title>
              </Card.Body>
            </div>
          </Card>
        </a>
      ))}
    </CardGroup>
    <CardGroup style={{ display: 'flex', overflowX: 'scroll', marginTop: '30px', marginBottom: '80px' }}>
      {menuData4.map((menu) => (
        <a key={menu.id} href={menu.link} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Card style={{ flex: '1', minWidth: '65px', maxWidth: '65px', margin: '0 22px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: '75px', maxWidth: '75px' }}>
              <Card.Img variant="top" src={menu.imageSrc} />
              <Card.Body>
                <Card.Title style={{ textAlign: 'center' }}>{menu.title}</Card.Title>
              </Card.Body>
            </div>
          </Card>
        </a>
      ))}
    </CardGroup>
    </>
  );
};

export default Menu2;
