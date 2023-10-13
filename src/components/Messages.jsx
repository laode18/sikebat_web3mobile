import React from 'react'

const Usermessage = () => {
  return (
    <div className='messagegg ownergg'>
        <div className="messageInfoUser">
            <img src="https://airnfts.s3.amazonaws.com/nft-images/20211216/Life_after_death_1639702175670.jpeg" alt="" />
            <span>Just Now</span>
        </div>
        <div className="messageContentUser">
            <p>Hello Bro</p>
        </div>
    </div>
  )
}

const Message = () => {
  return (
    <div className='message owner'>
        <div className="messageInfo">
            <img src="https://i.pinimg.com/originals/91/0b/2d/910b2d5c7c3eda2021eae5697a9527e3.jpg" alt="" />
            <span>Just Now</span>
        </div>
        <div className="messageContent">
            <p>Hello</p>
        </div>
    </div>
  )
}

const Messages = () => {
  return (
    <div className='messages'>
        <Usermessage />
        <Message />
    </div>
  )
}

export default Messages