import React from 'react'
import LoginString from '../Login/LoginStrings'
import firebase from '../../Services/firebase'
import ReactLoading from 'react-loading'
import images from '../../ProjectImages/ProjectImages'
import ChatBox from '../ChatBox/ChatBox'
import WelcomeBoard from '../Welcome/Welcome'
import './Chat.css'
export default class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      isOpenDialogConfirmLogout: false,
      currentPeerUser: null,
      displayedContactSwitchedNotification: [],
      displayedContacts: [],
    }
    this.currentUserName = localStorage.getItem(LoginString.Name)
    this.currentUserId = localStorage.getItem(LoginString.ID)
    this.currentUserPhoto = localStorage.getItem(LoginString.PhotoURL)
    this.currentUserDocumentId = localStorage.getItem(
      LoginString.FirebaseDocumentId
    )
    this.currentUserMessages = []
    this.searchUsers = []
    this.notificationMessageErase = []

    this.onProfileClick = this.onProfileClick.bind(this)
    this.getListUser = this.getListUser.bind(this)
    this.renderListUser = this.renderListUser.bind(this)
    this.getClassnameforUserandNotification = this.getClassnameforUserandNotification.bind(
      this
    )
    this.notificationErase = this.notificationErase.bind(this)
    this.updateRenderList = this.updateRenderList.bind(this)
  }

  logout = () => {
    firebase.auth().signOut()
    this.props.history.push('/')
    localStorage.clear()
  }
  onProfileClick = () => {
    this.props.history.push('/profile')
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection('users')
      .doc(this.currentUserDocumentId)
      .get()
      .then((doc) => {
        doc.data().messages.map((item) => {
          this.currentUserMessages.push({
            notificationId: item.notificationId,
            number: item.number,
          })
        })
        this.setState({
          displayedContactSwitchedNotification: this.currentUserMessages,
        })
      })
    this.getListUser()
  }
  getListUser = async () => {
    const result = await firebase.firestore().collection('users').get()
    if (result.docs.length > 0) {
      let listUser = []
      listUser = [...result.docs]
      listUser.forEach((item, index) => {
        this.searchUsers.push({
          key: index,
          documentkey: item.id,
          id: item.data().id,
          name: item.data().name,
          messages: item.data().messages,
          URL: item.data().URL,
          description: item.data().description,
        })
      })
      this.setState({
        isLoading: false,
      })
    }
    this.renderListUser()
  }

  getClassnameforUserandNotification = (itemId) => {
    let number = 0
    let className = ''
    let check = false
    if (
      this.state.currentPeerUser &&
      this.state.currentPeerUser.id === itemId
    ) {
      className = 'viewWrapItemFocused'
    } else {
      this.state.displayedContactSwitchedNotification.forEach((item) => {
        if (item.notificationId.length > 0) {
          if (item.notificationId === itemId) {
            check = true
            number = item.number
          }
        }
      })
      if (check === true) {
        className = 'viewWrapItemNotification'
      } else {
        className = 'viewWrapItem'
      }
    }
    return className
  }
  notificationErase = (itemId) => {
    this.state.displayedContactSwitchedNotification.forEach((el) => {
      if (el.notificationId.length > 0) {
        if (el.notificationId != itemId) {
          this.notificationMessageErase.push({
            notificationId: el.notificationId,
            number: el.number,
          })
        }
      }
    })
    this.updateRenderList()
  }

  updateRenderList = () => {
    firebase
      .firestore()
      .collection('users')
      .doc(this.currentUserDocumentId)
      .update({
        messages: this.notificationMessageErase,
      })
    this.setState({
      displayedContactSwitchedNotification: this.notificationMessageErase,
    })
  }

  renderListUser = () => {
    if (this.searchUsers.length > 0) {
      let viewListUser = []
      let classname = ''
      this.searchUsers.map((item) => {
        if (item.id != this.currentUserId) {
          classname = this.getClassnameforUserandNotification(item.id)
          viewListUser.push(
            <button
              id={item.key}
              className={classname}
              onClick={() => {
                this.notificationErase(item.id)
                this.setState({
                  currentPeerUser: item,
                  displayedContactswithNotification: this
                    .notificationMessagesErase,
                })
                document.getElementById(item.key).style.backgroundColor = '#fff'
                if (document.getElementById(item.key)) {
                  document.getElementById(item.key).style.color = '#fff'
                }
              }}>
              <img
                className='viewAvatarItem'
                src={item.URL ? item.URL : images.nopic}
                alt=''
              />

              <div className='viewWrapContentItem'>
                <span className='textItem'>{`Name: ${item.name}`}</span>
              </div>
              {classname === 'viewWrapItemNotification' ? (
                <div className='notificationpragraph'>
                  <p id={item.key} className='newmessages'>
                    New messages
                  </p>
                </div>
              ) : null}
            </button>
          )
        }
      })
      this.setState({
        displayedContacts: viewListUser,
      })
    } else {
      console.log('No user is Present')
    }
  }
  searchHandler = (event) => {
    let searchQuery = event.target.value.toLowerCase(),
      displayedContacts = this.searchUsers.filter((el) => {
        let SearchValue = el.name.toLowerCase()
        return SearchValue.indexOf(searchQuery) !== -1
      })
    this.displayedContacts = displayedContacts
    this.displaySearchedContacts()
  }
  displaySearchedContacts = () => {
    if (this.searchUsers.length > 0) {
      let viewListUser = []
      let classname = ''
      this.displayedContacts.map((item) => {
        if (item.id != this.currentUserId) {
          classname = this.getClassnameforUserandNotification(item.id)
          viewListUser.push(
            <button
              id={item.key}
              className={classname}
              onClick={() => {
                this.notificationErase(item.id)
                this.setState({
                  currentPeerUser: item,
                  displayedContactswithNotification: this
                    .notificationMessagesErase,
                })
                document.getElementById(item.key).style.backgroundColor = '#fff'
                if (document.getElementById(item.key)) {
                  document.getElementById(item.key).style.color = '#fff'
                }
              }}>
              <img
                className='viewAvatarItem'
                src={item.URL ? item.URL : images.nopic}
                alt=''
              />

              <div className='viewWrapContentItem'>
                <span className='textItem'>{`Name: ${item.name}`}</span>
              </div>
              {classname === 'viewWrapItemNotification' ? (
                <div className='notificationpragraph'>
                  <p id={item.key} className='newmessages'>
                    New messages
                  </p>
                </div>
              ) : null}
            </button>
          )
        }
      })
      this.setState({
        displayedContacts: viewListUser,
      })
    } else {
      console.log('No user is Present')
    }
  }
  render() {
    return (
      <div className='root'>
        <div className='body'>
          <div className='viewListUser'>
            <div className='profileviewleftside'>
              <img
                className='ProfilePicture'
                alt=''
                src={
                  this.currentUserPhoto ? this.currentUserPhoto : images.nopic
                }
                onClick={this.onProfileClick}
              />
              <button className='Logout' onClick={this.logout}>
                Logout
              </button>
            </div>
            <div className='rootsearchbar'>
              <div className='input-container'>
                <i class='fa fa-search icon'></i>
                <input
                  class='input-field'
                  type='text'
                  onChange={this.searchHandler}
                  placeholder='Search'
                />
              </div>
            </div>
            {this.state.displayedContacts}
          </div>
          <div className='viewBoard'>
            {this.state.currentPeerUser ? (
              <ChatBox
                currentPeerUser={this.state.currentPeerUser}
                showToast={this.props.showToast}
              />
            ) : (
              <WelcomeBoard />
            )}
          </div>
        </div>
      </div>
    )
  }
}
