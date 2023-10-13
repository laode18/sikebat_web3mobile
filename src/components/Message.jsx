import React from 'react'

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

export default Message