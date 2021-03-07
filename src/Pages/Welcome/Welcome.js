import React, { useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import './Welcome.css'
import images from '../../ProjectImages/ProjectImages'
import LoginString from '../Login/LoginStrings'

const WelocomeBoard = () => {
  const currentUserName = localStorage.getItem(LoginString.Name)
  const currentUserPhoto = localStorage.getItem(LoginString.PhotoURL)
  return (
    <div className='viewWelcomeBoard'>
      <img
        className='avatarWelcome'
        src={currentUserPhoto ? currentUserPhoto : images.nopic}
        alt=''
      />
      <span className='textTitleWelcome'>{`Welcome, ${currentUserName}`}</span>
      <span className='textDesciptionWelcome'>Let's connent the World</span>
    </div>
  )
}

export default WelocomeBoard
