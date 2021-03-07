import React, { useState, useEffect, useRef } from 'react'
import './Profile.css'
import ReactLoading from 'react-loading'
import 'react-toastify/dist/ReactToastify.css'
import firebase from '../../Services/firebase'
import images from '../../ProjectImages/ProjectImages'
import LoginString from '../Login/LoginStrings'

const Profile = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [documentKey, setDocumentKey] = useState(
    localStorage.getItem(LoginString.FirebaseDocumentId)
  )
  const [id, setId] = useState(localStorage.getItem(LoginString.ID))
  const [name, setName] = useState(localStorage.getItem(LoginString.Name))
  const [aboutMe, setAboutMe] = useState(
    localStorage.getItem(LoginString.Description)
  )
  const [photoUrl, setPhotoUrl] = useState(
    localStorage.getItem(LoginString.PhotoURL)
  )
  const [newPhoto, setNewPhoto] = useState(null)
  let refInput = useRef(false)

  useEffect(() => {
    if (!localStorage.getItem(LoginString.ID)) {
      props.history.push('/')
    }
  }, [])

  const onChangeAvatar = (event) => {
    if (event.target.files && event.target.files[0]) {
      const prefixFiletype = event.target.files[0].type.toString()
      if (prefixFiletype.indexOf(LoginString.PREFIX_IMAGE) !== 0) {
        props.showToast(0, 'This file is not an image')
        return
      }
      setNewPhoto(event.target.files[0])
      setPhotoUrl(URL.createObjectURL(event.target.files[0]))
    } else {
      props.showToast(0, 'Something wrong with input file')
    }
  }
  const uploadAvatar = () => {
    setIsLoading(true)
    if (newPhoto) {
      const uploadTask = firebase.storage().ref().child(id).put(newPhoto)
      uploadTask.on(
        LoginString.UPLOAD_CHANGED,
        null,
        (err) => {
          props.showToast(0, err.message)
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            updateUserInfo(true, downloadURL)
          })
        }
      )
    } else {
      updateUserInfo(false, null)
    }
  }
  const updateUserInfo = (isUpdatedPhotoURL, downloadURL) => {
    let newInfo
    if (isUpdatedPhotoURL) {
      newInfo = {
        name: name,
        Description: aboutMe,
        URL: downloadURL,
      }
    } else {
      newInfo = {
        name: name,
        Description: aboutMe,
      }
    }
    firebase
      .firestore()
      .collection('users')
      .doc(documentKey)
      .update(newInfo)
      .then((data) => {
        localStorage.setItem(LoginString.Name, name)
        localStorage.setItem(LoginString.Description, aboutMe)
        if (isUpdatedPhotoURL) {
          localStorage.setItem(LoginString.PhotoURL, downloadURL)
        }
        setIsLoading(false)
        props.showToast(1, 'Update info success')
      })
  }
  return (
    <div className='profileroot'>
      <div className='headerprofile'>
        <span>Profile</span>
      </div>
      <img className='avatar' alt='' src={photoUrl ? photoUrl : images.nopic} />
      <div className='viewWrapInputFile'>
        <img
          className='imgInputFile'
          alt='icon gallery'
          src={images.choosefile}
          onClick={() => {
            refInput.click()
          }}
        />
        <input
          ref={(el) => {
            refInput = el
          }}
          accept='image/*'
          className='viewInputFile'
          type='file'
          onChange={onChangeAvatar}
        />
      </div>
      <span className='textLabel'>Name</span>
      <input
        className='textInput'
        value={name ? name : ''}
        placeholder='Your nickname...'
        onChange={(e) => {
          setName(e.target.value)
        }}
      />
      <span className='textLabel'>About Me</span>
      <input
        className='textInput'
        value={aboutMe ? aboutMe : ''}
        placeholder='Tell about yourself...'
        onChange={(e) => {
          setAboutMe(e.target.value)
        }}
      />
      <div>
        <button className='btnUpdate' onClick={uploadAvatar}>
          SAVE
        </button>
        <button
          className='btnback'
          onClick={() => {
            props.history.push('/chat')
          }}>
          BACK
        </button>
      </div>
      {isLoading ? (
        <div>
          <ReactLoading
            type={'spin'}
            color={'#203152'}
            height={'3%'}
            width={'3%'}
          />
        </div>
      ) : null}
    </div>
  )
}

export default Profile
