import React, { Component, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import firebase from '../../Services/firebase'

import LoginString from '../Login/LoginStrings'
import './Login.css'
import { Card } from 'react-bootstrap'

import Avatar from '@material-ui/core/Avatar'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOpenOutlined'
import Typography from '@material-ui/core/Typography'
import { findByLabelText } from '@testing-library/react'

const Login = (props) => {
  const [isLoading, setIsLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    if (localStorage.getItem(LoginString.ID)) {
      setIsLoading(false)
      props.showToast(1, 'Login succes')
      props.history.push('./chat')
    } else {
      setIsLoading(false)
    }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async (result) => {
        let user = result.user
        if (user) {
          await firebase
            .firestore()
            .collection('users')
            .where('id', '==', user.uid)
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                const currentdata = doc.data()
                localStorage.setItem(LoginString.FirebaseDocumentId, doc.id)
                localStorage.setItem(LoginString.ID, currentdata.id)
                localStorage.setItem(LoginString.Name, currentdata.name)
                localStorage.setItem(LoginString.Email, currentdata.email)
                localStorage.setItem(LoginString.Password, currentdata.password)
                localStorage.setItem(LoginString.PhotoURL, currentdata.URL)
                localStorage.setItem(
                  LoginString.Description,
                  currentdata.description
                )
              })
            })
        }
        props.history.push('/chat')
      })
      .catch(function (error) {
        document.getElementById('1').innerHTML =
          'incorrect email/password or poor internet'
      })
  }
  const paper = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingLeft: '10px',
    paddingRight: '10px',
  }
  const rightComponent = {
    boxShadow: '0 80px 80px #808888',
    backgroundColor: 'smokegrey',
  }
  const root = {
    height: '100vh',
    background: 'linear-gradient(90deg, #e3ffe7, 0%, #d9e7ff, 100% ) ',
    marginBottom: '50px',
  }
  const SignInSee = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'White',
    marginBottom: '20px',
    backgroundColor: '#1ebea5',
    width: '100%',
    boxShadow: '0 5px 5px #808888',
    height: '10rem',
    paddingTop: '48px',
    opacity: '.5',
    borderBottom: '5px solid green',
  }
  const form = {
    width: '100%',
    marginTop: '50px',
  }
  const avatar = {
    backgroundColor: 'green',
  }
  return (
    <>
      <Grid container component='main' style={root}>
        <CssBaseline />
        <Grid item xs={1} sm={4} md={7} className='image'>
          <div className='image1'></div>
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          style={rightComponent}
          elevation={6}
          square>
          <Card style={SignInSee}>
            <div>
              <Avatar style={avatar}>
                <LockOutlinedIcon width='50px' height='50px' />
              </Avatar>
            </div>
            <div>
              <Typography component='h1' variant='h5' Sign in To />
            </div>
            <div>
              <Link to='/'>
                <button className='btn'>
                  <i className='fa fa-home'></i>
                  React-Chat
                </button>
              </Link>
            </div>
          </Card>
          <div style={paper}>
            <form style={form} noValidate onSubmit={handleSubmit}>
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                autoFocus
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                value={email}
              />
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
              {/* just decoration */}
              <FormControlLabel
                control={<Checkbox value='remember' color='promary' />}
                label='Remember me'
              />
              <Typography component='h6' variant='h5'>
                {error ? <p className='text-danger'>{error}</p> : null}
              </Typography>
              <div className='CenterAliningItems'>
                <button class='button1' type='submit'>
                  <span>Login In</span>
                </button>
              </div>

              <div className='CenterAliningItems'>
                <p>Don't have and account?</p>
                <Link to='/signup' variant='body2'>
                  Sign Up
                </Link>
              </div>
              <div>
                <p className='text-center' id='1' style={{ color: 'red' }}></p>
              </div>
            </form>
          </div>
        </Grid>
      </Grid>
    </>
  )
}
export default Login
