/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import './css/Menu3.css';
import contractpesan from './contracts/contractpesan';
import contract from './contracts/contract';
import contractpesanuser from './contracts/contractpesanuser';
import Web3 from 'web3';

const Menu3 = () => {
  const [pesans, setPesans] = useState([]);
  const [pesanusers, setPesanusers] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const walletId = localStorage.getItem('walletId');
  const [isLoading, setIsLoading] = useState(false);
  const [newPesan, setNewPesan] = useState({
    userId:'', // Add default values for all fields
    tanggal: new Date().toLocaleString(),
    isiPesan: '',
  });
  const web3 = new Web3(window.ethereum);

  useEffect(() => {
    // Panggil fungsi getPesans() dan getUsers()
    getPesans();
    getPesanusers();
    getUsers();
  }, []);

  const getPesans = async () => {
    try {
      setIsLoading(true); // Anda mungkin perlu menambahkan state isLoading
      const totalPesans = await contractpesan.methods.totalPesans().call();
      const pesansArray = [];

      for (let i = 1; i <= totalPesans; i++) {
        const pesan = await contractpesan.methods.getPesan(i).call();
        if (pesan.userId !== '') {
          pesansArray.push({ ...pesan, type: 'bot' });
        }
      }

      setPesans(pesansArray);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const getPesanusers = async () => {
    try {
      setIsLoading(true); // Anda mungkin perlu menambahkan state isLoading
      const totalPesanusers = await contractpesanuser.methods.totalPesanusers().call();
      const pesanusersArray = [];

      for (let i = 1; i <= totalPesanusers; i++) {
        const pesanuser = await contractpesanuser.methods.getPesanuser(i).call();
        if (pesanuser.userId !== '') {
          pesanusersArray.push({ ...pesanuser, type: 'user' });
        }
      }

      setPesanusers(pesanusersArray);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

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

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      const currentUser = users.find(user => user.walletId === walletId);
      if (currentUser) {
        setPesans(prevPesans => [
          ...prevPesans,
          {
            isiPesan: newMessage,
            tanggal: new Date().getTime(),
            sender: 'user',
            userId: currentUser.username,
          },
        ]);
      }
      setNewMessage('');
    }
  };

   // eslint-disable-next-line no-lone-blocks
   {
    users
      .filter((user) => user.walletId === walletId)
      .map((user) => {
        const userId = user.username;
        return (
          // Tambahkan elemen JSX yang sesuai di sini
          <div key={userId}>{userId}</div>
        );
      })
  }

  const user = users.find((user) => user.walletId === walletId);
  const userId = user?.username;

  const calculateTimeDifference = (sentTimestamp) => {
    const currentTime = new Date().getTime();
    const sentTime = new Date(sentTimestamp).getTime();
    const differenceInMinutes = Math.floor((currentTime - sentTime) / (1000 * 60));
  
    if (differenceInMinutes >= 60 && differenceInMinutes < 180) {
      // Lebih dari 60 menit dan kurang dari 180 menit (3 jam)
      const differenceInHours = Math.floor(differenceInMinutes / 60);
      return `${differenceInHours} jam yang lalu`;
    } else if (differenceInMinutes >= 180 && differenceInMinutes < 1440) {
      // Lebih dari 3 jam dan kurang dari 24 jam
      return `${Math.floor(differenceInMinutes / 60)} jam yang lalu`;
    } else if (differenceInMinutes >= 1440) {
      // Lebih dari 24 jam (1 hari)
      return "kemarin";
    } else {
      // Kurang dari 60 menit
      return `${differenceInMinutes} menit yang lalu`;
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewPesan((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const createPesanuser = async () => {
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();
      const pesanuserCount = await contractpesanuser.methods.totalPesanusers().call();
      const pesanuserId = parseInt(pesanuserCount) + 1;
      const user = users.find((user) => user.walletId === walletId);
      const pesanuserWithId = {
        ...newPesan,
        pesanuserId: pesanuserId.toString(),
        userId: user.walletId.toString(),
      };
      await contractpesanuser.methods.createPesanuser(pesanuserWithId).send({ from: accounts[0] });
      setNewPesan({});
      await getPesanusers(); // Refresh the message list after creating a new message
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const sortedMessages = [...pesans, ...pesanusers].sort((a, b) => b.tanggal - a.tanggal).reverse();;

  return (
    <div className="chat-container" style={{ marginBottom: '50px' }}>
       <div className="chat-messages">
        {sortedMessages
          .filter((pesan) => pesan.userId === userId || pesan.userId === walletId)
          .map((pesan) => (
            <div
              key={pesan.tanggal}
              className={`message ${pesan.type}`}
            >
              <div className='messageContent'>
                <p>{pesan.isiPesan}</p>
              </div>
            </div>
          ))}
      </div>
      <form>
        <input type="text" name="tanggal" value={newPesan.tanggal || ''} onChange={handleInputChange} hidden/>
        <div className="chat-input">
          <input
            type="text"
            name="isiPesan"
            value={newPesan.isiPesan || ''}
            onChange={handleInputChange}
            placeholder="Type a message..."
          />
          <button type="button" onClick={createPesanuser}>Send</button>
        </div>
      </form>
    </div>
  );
};

export default Menu3;
