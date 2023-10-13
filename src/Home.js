import React from 'react';

const Home = () => {
  const now = new Date();
  const timestamp = now.getTime();
  return (
    <h2>Ini adalah halaman Home {timestamp}</h2>
  );
};

export default Home;
