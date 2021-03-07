import React, { Component, useState } from 'react'
import { Link } from 'react-router-dom'
import './Signup.css'
import firebase from '../../Services/firebase'
import { Card } from 'react-bootstrap'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { red } from '@material-ui/core/colors'
import LoginString from '../Login/LoginStrings'

const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState(null)

  async function handleSubmit(event) {
    // const { name, password, email } = this.state
    event.preventDefault()
    try {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async (result) => {
          firebase
            .firestore()
            .collection('users')
            .add({
              name,
              id: result.user.uid,
              email,
              password,
              URL: '',
              description: '',
              messages: [{ notificationId: '', number: 0 }],
            })
            .then((docRef) => {
              localStorage.setItem(LoginString.ID, result.user.uid)
              localStorage.setItem(LoginString.Name, name)
              localStorage.setItem(LoginString.Email, email)
              localStorage.setItem(LoginString.Password, password)
              localStorage.setItem(LoginString.PhotoURL, '')
              localStorage.setItem(LoginString.UPLOAD_CHANGED, 'state_changed')
              localStorage.setItem(LoginString.Description, '')
              localStorage.setItem(LoginString.FirebaseDocumentId, docRef.id)
              this.setState({
                name: '',
                password: '',
                email: '',
              })
              this.props.history.push('/chat')
            })
            .catch((error) => {
              console.error('Error adding document', error)
            })
        })
    } catch (error) {
      document.getElementById('1').innerHTML =
        'Error in signing up please try again'
    }
  }

  const Signinsee = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#ffffff',
    backgroundColor: '#1ebea5',
    width: '100%',
    boxShadow: '0 5px 5px #808888',
    height: '10rem',
    paddingTop: '48px',
    opacity: '.5',
    borderBottom: '5px solid green',
  }
  return (
    <>
      <CssBaseline />
      <Card style={Signinsee}>
        <div>
          <Typography component='h1' variant='h5'>
            Sign Up To
          </Typography>
        </div>
        <div>
          <Link to='/'>
            <button className='btn'>
              <i className='fa fa-home'></i>React-Chat
            </button>
          </Link>
        </div>
      </Card>

      <Card className='formacontrooutside'>
        <form className='customform' noValidate onSubmit={handleSubmit}>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address-example:abc@gmail.com'
            name='email'
            autoComplete='email'
            autoFocus
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            value={email}
          />

          <div>
            <p style={{ color: 'gray', fontSize: '15px', marginLeft: '0' }}>
              Password :length Greater than 6
            </p>
          </div>

          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='password'
            label='Password'
            name='password'
            type='password'
            autoComplete='current-password'
            autoFocus
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            value={password}
          />

          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='name'
            label='Your Name'
            name='name'
            autoComplete='name'
            autoFocus
            onChange={(e) => {
              setName(e.target.value)
            }}
            value={name}
          />

          <div className='CenterAliningItems mt-5'>
            <button className='button1' type='submit'>
              <span>Sign Up</span>
            </button>
          </div>
          <div>
            <p style={{ color: 'grey' }}>Already have and account?</p>
            <Link to='/login'>Login In</Link>
          </div>
          <div className='error'>
            <p id='1' style={{ color: red }}></p>
          </div>
        </form>
      </Card>
    </>
  )
}
export default SignUp
