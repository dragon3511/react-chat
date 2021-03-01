import React from 'react'
import 'react-toastify/dist/ReactToastify.css'
import './Welcome.css'
import images from '../../ProjectImages/ProjectImages'

export default class WelocomeCard extends React.Component {
  render() {
    return (
      <div className='viewWelcomeBoard'>
        <img
          className='avatarWelcome'
          src={
            this.props.currentUserPhoto
              ? this.props.currentUserPhoto
              : images.nopic
          }
          alt=''
        />
        <span className='textTitleWelcome'>{`Welcome, ${this.props.currentUserName}`}</span>
        <span className='textDesciptionWelcome'>Let's connent the World</span>
      </div>
    )
  }
}
