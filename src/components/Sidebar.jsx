import React, { useState, useEffect } from 'react';
import contract from '../contract';
import Web3 from 'web3';

const Navbar = () => {
  return (
    <div className='navbar'>
      <span className='logo'>SIM Cibabat</span>
      <div className='user'>
        <img
          className='img'
          src='https://i.pinimg.com/originals/91/0b/2d/910b2d5c7c3eda2021eae5697a9527e3.jpg'
          alt=''
        />
        <span>Admin</span>
      </div>
    </div>
  );
};

const Search = () => {
  return (
    <div className='search'>
      <div className='searchForm'>
        <input className='inputs' type='text' placeholder='Find a user' />
      </div>
      {/* <div className="userChat">
          <img src="https://airnfts.s3.amazonaws.com/nft-images/20211216/Life_after_death_1639702175670.jpeg" alt="" />
          <div className="userChatInfo">
              <span>Jane</span>
          </div>
      </div> */}
    </div>
  );
};

const Chats = () => {
  const [users, setUsers] = useState([]);
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

  return (
    <div className='chats'>
      {users.map((user, index) => (
        <div className='userChat' key={index}>
          <img src='https://airnfts.s3.amazonaws.com/nft-images/20211216/Life_after_death_1639702175670.jpeg' alt='' />
          <div className='userChatInfo'>
            <span>{user.fullName}</span>
            <p>Hello</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <Navbar />
      <Search />
      <Chats />
    </div>
  );
};

export default Sidebar;
