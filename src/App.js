/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';
import Layout from './Layout';
import Register from './register/Register';
import Registernext from './register/Registernext';
import Suratkependudukan from './surat/suratkependudukan/Suratkependudukan';
import Suratkelahiran from './surat/suratkelahiran/Suratkelahiran';
import Suratkematian from './surat/suratkematian/Suratkematian';
import Suratbelumnikah from './surat/suratbelumnikah/Suratbelumnikah';
import Suratandonnikah from './surat/suratandonnikah/Suratandonnikah';
import Suratpindah from './surat/suratpindah/Suratpindah';
import Surattmsekolah from './surat/surattidakmampusekolah/Surattmsekolah';
import Surattmrs from './surat/surattidakmampurs/Surattmrs';
import Suratmempunyaiusaha from './surat/suratmempunyaiusaha/Suratmempunyaiusaha';
import Suratskck from './surat/suratskck/Suratskck';
import Suratbersihdiri from './surat/suratbersihdiri/Suratbersihdiri';
import Suratdomisiliyayasan from './surat/suratdomisiliyayasan/Suratdomisiliyayasan';
import Suratdomisiliperusahaan from './surat/suratdomisiliperusahaan/Suratdomisiliperusahaan';
import Editprofile from './surat/editprofile/editprofile';

const Loginuser = React.lazy(() => import('./loginuser/Loginuser'))

const App = () => {
  const [activeMenu, setActiveMenu] = useState('menu1');

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="/login" element={<Loginuser />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registernext" element={<Registernext />} />
          <Route path="/suratkependudukan" element={<Suratkependudukan />} />
          <Route path="/suratkelahiran" element={<Suratkelahiran />} />
          <Route path="/suratkematian" element={<Suratkematian />} />
          <Route path="/suratbelumnikah" element={<Suratbelumnikah />} />
          <Route path="/suratandonnikah" element={<Suratandonnikah />} />
          <Route path="/suratpindah" element={<Suratpindah />} />
          <Route path="/surattidakmampusekolah" element={<Surattmsekolah />} />
          <Route path="/surattidakmampurs" element={<Surattmrs />} />
          <Route path="/suratmempunyaiusaha" element={<Suratmempunyaiusaha />} />
          <Route path="/suratskck" element={<Suratskck />} />
          <Route path="/suratbersihdiri" element={<Suratbersihdiri />} />
          <Route path="/suratdomisiliyayasan" element={<Suratdomisiliyayasan />} />
          <Route path="/suratdomisiliperusahaan" element={<Suratdomisiliperusahaan />} />
          <Route path="/editprofile" element={<Editprofile />} />
        </Routes>
    </Router>
    </div>
  );
};

export default App;