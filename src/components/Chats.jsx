import React, { useState, useEffect } from 'react';
import contract from '../contract';
import Web3 from 'web3';

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
        <div className="userChat">
            <img src="https://airnfts.s3.amazonaws.com/nft-images/20211216/Life_after_death_1639702175670.jpeg" alt="" />
            <div className="userChatInfo">
                <span>{user.fullName}</span>
                <p>Hello</p>
            </div>
        </div>
        ))}
    </div>
  )
}

export default Chats