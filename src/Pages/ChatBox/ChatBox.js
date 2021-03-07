import React, { useState, useEffect, useRef } from 'react'
import { Card } from 'react-bootstrap'
import ReactLoading from 'react-loading'
import 'react-toastify/dist/ReactToastify.css'
import firebase from '../../Services/firebase'
import images from '../../ProjectImages/ProjectImages'
import moment from 'moment'
import './ChatBox.css'
import LoginString from '../Login/LoginStrings'
import 'bootstrap/dist/css/bootstrap.min.css'

const ChatBox = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isShowStiker, setIsShowStiker] = useState(false)
  const [inputValue, setIsInputValue] = useState('')
  let [listMessage, setListMessage] = useState([])
  //   const [isSended, setIsSended] = useState(false)
  //   const [groupChatId, setGroupChatId] = useState(null)
  let refInput = useRef(false)
  let messageEnd = useRef(false)

  const currentUserName = localStorage.getItem(LoginString.Name)
  const currentUserId = localStorage.getItem(LoginString.ID)
  const currentUserPhoto = localStorage.getItem(LoginString.PhotoURL)
  const currentUserDocumentId = localStorage.getItem(
    LoginString.FirebaseDocumentId
  )
  let stateChanged = localStorage.getItem(LoginString.UPLOAD_CHANGED)
  let currentPeerUser = props.currentPeerUser
  let currentPeerUserMessages = []
  let removeListener = null
  let currentPhotoFile = null
  let groupChatId = null

  firebase
    .firestore()
    .collection('users')
    .doc(currentPeerUser.documentkey)
    .get()
    .then((docRef) => {
      currentPeerUserMessages = docRef.data().messages
    })
  const setGroupChatId = () => {
    if (hashString(currentUserId) <= hashString(currentPeerUser.id)) {
      groupChatId = `${currentUserId}-${currentPeerUser.id}`
    } else {
      groupChatId = `${currentPeerUser.id}-${currentUserId}`
    }
    return { groupChatId: groupChatId }
  }

  useEffect(() => {
    scrollToBottom()
  })
  useEffect(() => {
    getListHistory()
  }, [currentPeerUser])

  //   componentWillReceiveProps(newProps) {
  //     if (newProps.currentPeerUser) {
  //       currentPeerUser = newProps.currentPeerUser
  //       getListHistory()
  //     }
  //   }

  //   componentDidMount() {
  //     getListHistory()
  //   }
  useEffect(() => {
    return () => {
      if (removeListener) {
        removeListener()
      }
    }
  }, [])
  //   componentWillUnmount() {
  //     if (removeListener) {
  //       removeListener()
  //     }
  //   }
  const getListHistory = () => {
    if (removeListener) {
      removeListener()
    }

    let inputGroupChatId = setGroupChatId()
    listMessage.length = 0
    setIsLoading(true)
    //Get history and listen new data added
    removeListener = firebase
      .firestore()
      .collection('Messages')
      .doc(inputGroupChatId.groupChatId)
      .collection(inputGroupChatId.groupChatId)
      .onSnapshot(
        (Snapshot) => {
          Snapshot.docChanges().forEach((change) => {
            if (change.type === LoginString.DOC) {
              listMessage.push(change.doc.data())
            }
          })
          setIsLoading(false)
        },
        (err) => {
          props.showToast(0, err.toString())
        }
      )
  }

  const onSendMessage = (content, type) => {
    console.log('test')
    let notificationMessages = []
    if (isShowStiker && type === 2) {
      setIsShowStiker(false)
    }
    if (content.trim() === '') {
      return
    }
    const timestamp = moment().valueOf().toString()
    let inputGroupChatId = setGroupChatId()

    const itemMessage = {
      idFrom: currentUserId,
      idTo: currentPeerUser.id,
      timestamp: timestamp,
      content: content.trim(),
      type: type,
    }
    firebase
      .firestore()
      .collection('Messages')
      .doc(inputGroupChatId.groupChatId)
      .collection(inputGroupChatId.groupChatId)
      .doc(timestamp)
      .set(itemMessage)
      .then(() => {
        setIsInputValue('')
      })
    currentPeerUserMessages.map((item) => {
      if (item.notificationId !== currentUserId) {
        notificationMessages.push({
          notificationId: item.notificationId,
          number: item.number,
        })
      }
    })
    firebase
      .firestore()
      .collection('users')
      .doc(currentPeerUser.documentkey)
      .update({
        messages: notificationMessages,
      })
      .then((data) => {})
      .catch((err) => {
        props.showToast(0, err.toString())
      })
  }
  const scrollToBottom = () => {
    if (messageEnd) {
      messageEnd.scrollIntoView({})
    }
  }
  const onKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSendMessage(inputValue, 0)
    }
  }
  const openListSticker = () => {
    setIsShowStiker(!isShowStiker)
  }

  //   今まで下にあった関数
  const onChoosePhoto = (event, props) => {
    if (event.target.files && event.target.files[0]) {
      setIsLoading(true)
      currentPhotoFile = event.target.files[0]
      const prefixFiletype = event.target.files[0].type.toString()
      if (prefixFiletype.indexOf('image/') === 0) {
        uploadPhoto()
      } else {
        setIsLoading(false)
        props.showToast(0, 'This file is not an image')
      }
    } else {
      setIsLoading(false)
    }
  }
  const uploadPhoto = () => {
    if (currentPhotoFile) {
      const timestamp = moment().valueOf().toString()

      const uploadTask = firebase
        .storage()
        .ref()
        .child(timestamp)
        .put(currentPhotoFile)

      uploadTask.on(
        LoginString.UPLOAD_CHANGED,
        null,
        (err) => {
          setIsLoading(false)
          props.showToast(0, err.message)
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            setIsLoading(false)
            onSendMessage(downloadURL, 1)
          })
        }
      )
    } else {
      setIsLoading(false)
      props.showToast(0, 'File is null')
    }
  }
  const renderListMessage = () => {
    if (listMessage.length > 0) {
      let viewListMessage = []
      listMessage.forEach((item, index) => {
        if (item.idFrom === currentUserId) {
          if (item.type === 0) {
            viewListMessage.push(
              <div className='viewItemRight' key={item.timestamp}>
                <span className='textContentItem'>{item.content}</span>
              </div>
            )
          } else if (item.type === 1) {
            viewListMessage.push(
              <div className='viewItemRight2' key={item.timestamp}>
                <img
                  className='imgItemRight'
                  src={item.content}
                  alt='Please update your image'
                />
              </div>
            )
          } else {
            viewListMessage.push(
              <div className='viewItemRight3' key={item.timestamp}>
                <img
                  className='imgItemRight'
                  src={getGifImage(item.content)}
                  alt='content message'
                />
              </div>
            )
          }
        } else {
          if (item.type === 0) {
            viewListMessage.push(
              <div className='viewWrapItemLeft' key={item.timestamp}>
                <div className='viewWrapItemLeft3'>
                  {isLastMessageLeft(index) ? (
                    <img
                      src={
                        currentPeerUser.URL ? currentPeerUser.URL : images.nopic
                      }
                      alt='avatar'
                      className='peerAvatarLeft'
                    />
                  ) : (
                    <div className='viewPaddingLeft' />
                  )}
                  <div className='viewItemLeft'>
                    <span className='textContentItem'>{item.content}</span>
                  </div>
                </div>
                {isLastMessageLeft(index) ? (
                  <span className='textTimeLeft'>
                    <div className='time'>
                      {moment(Number(item.timestamp)).format(
                        'YYYY-MM-DD HH:mm'
                      )}
                    </div>
                  </span>
                ) : null}
              </div>
            )
          } else if (item.type === 1) {
            viewListMessage.push(
              <div className='viewWrapItemLeft2' key={item.timestamp}>
                <div className='viewWrapItemLeft3'>
                  {isLastMessageLeft(index) ? (
                    <img
                      src={
                        currentPeerUser.URL ? currentPeerUser.URL : images.nopic
                      }
                      alt=''
                      className='peerAvatarLeft'
                    />
                  ) : (
                    <div className='viewPaddingLeft' />
                  )}
                  <div className='viewItemLeft2'>
                    <img
                      src={item.content}
                      alt='content message'
                      className='imgItemLeft'
                    />
                  </div>
                </div>
                {isLastMessageLeft(index) ? (
                  <span className='textTimeLeft'>
                    <div className='time'>
                      {moment(Number(item.timestamp)).format('ll')}
                    </div>
                  </span>
                ) : null}
              </div>
            )
          } else {
            viewListMessage.push(
              <div className='viewWrapItemLeft2' key={item.timestamp}>
                <div className='viewWrapItemLeft3'>
                  {isLastMessageLeft(index) ? (
                    <img
                      src={
                        currentPeerUser.URL ? currentPeerUser.URL : images.nopic
                      }
                      alt=''
                      className='peerAvatarLeft'
                    />
                  ) : (
                    <div className='viewPaddingLeft' />
                  )}
                  <div className='viewItemLeft3' key={item.timestamp}>
                    <img
                      className='imgItemRight'
                      src={getGifImage(item.content)}
                      alt='content message'
                    />
                  </div>
                </div>
                {isLastMessageLeft(index) ? (
                  <span className='textTimeLeft'>
                    <div className='time'>
                      {moment(Number(item.timestamp)).format('ll')}
                    </div>
                  </span>
                ) : null}
              </div>
            )
          }
        }
      })
      return viewListMessage
    } else {
      return (
        <div className='viewWrapSayHi'>
          <span className='textSayHi'>Say hi to new friend</span>
          <img className='imgWaveHand' src={images.wave_hand} alt='wave hand' />
        </div>
      )
    }
  }
  const renderStickers = () => {
    return (
      <div className='viewStickers'>
        <img
          className='imgSticker'
          src={images.lego1}
          alt='sticker'
          onClick={() => {
            onSendMessage('lego1', 2)
          }}
        />
        <img
          className='imgSticker'
          src={images.lego2}
          alt='sticker'
          onClick={() => onSendMessage('lego2', 2)}
        />
        <img
          className='imgSticker'
          src={images.lego3}
          alt='sticker'
          onClick={() => onSendMessage('lego3', 2)}
        />
        <img
          className='imgSticker'
          src={images.lego4}
          alt='sticker'
          onClick={() => onSendMessage('lego4', 2)}
        />
        <img
          className='imgSticker'
          src={images.lego5}
          alt='sticker'
          onClick={() => onSendMessage('lego5', 2)}
        />
        <img
          className='imgSticker'
          src={images.lego6}
          alt='sticker'
          onClick={() => onSendMessage('lego6', 2)}
        />

        <img
          className='imgSticker'
          src={images.mimi1}
          alt='sticker'
          onClick={() => onSendMessage('mimi1', 2)}
        />
        <img
          className='imgSticker'
          src={images.mimi2}
          alt='sticker'
          onClick={() => onSendMessage('mimi2', 2)}
        />

        <img
          className='imgSticker'
          src={images.mimi4}
          alt='sticker'
          onClick={() => onSendMessage('mimi4', 2)}
        />
        <img
          className='imgSticker'
          src={images.mimi5}
          alt='sticker'
          onClick={() => onSendMessage('mimi5', 2)}
        />
        <img
          className='imgSticker'
          src={images.mimi6}
          alt='sticker'
          onClick={() => onSendMessage('mimi6', 2)}
        />
        <img
          className='imgSticker'
          src={images.mimi7}
          alt='sticker'
          onClick={() => onSendMessage('mimi7', 2)}
        />
        <img
          className='imgSticker'
          src={images.mimi8}
          alt='sticker'
          onClick={() => onSendMessage('mimi8', 2)}
        />
        <img
          className='imgSticker'
          src={images.mimi9}
          alt='sticker'
          onClick={() => onSendMessage('mimi9', 2)}
        />
      </div>
    )
  }
  const getGifImage = (value) => {
    switch (value) {
      case 'lego1':
        return images.lego1
      case 'lego2':
        return images.lego2
      case 'lego3':
        return images.lego3
      case 'lego4':
        return images.lego4
      case 'lego5':
        return images.lego5
      case 'lego6':
        return images.lego6
      case 'mimi1':
        return images.mimi1
      case 'mimi2':
        return images.mimi2
      case 'mimi4':
        return images.mimi4
      case 'mimi5':
        return images.mimi5
      case 'mimi6':
        return images.mimi6
      case 'mimi7':
        return images.mimi7
      case 'mimi8':
        return images.mimi8
      case 'mimi9':
        return images.mimi9
      default:
        return null
    }
  }
  const hashString = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash += Math.pow(str.charCodeAt(i) * 31, str.length - i)
      hash = hash & hash //Convert to 32bit integer
    }
    return hash
  }
  const isLastMessageLeft = (index) => {
    if (
      (index + 1 < listMessage.length &&
        listMessage[index + 1].idFrom === currentUserId) ||
      index === listMessage.length - 1
    ) {
      return true
    } else {
      return false
    }
  }

  const isLastMessageRight = (index) => {
    if (
      (index + 1 < listMessage.length &&
        listMessage[index + 1].idFrom !== currentUserId) ||
      index === listMessage.length - 1
    ) {
      return true
    } else {
      return false
    }
  }

  return (
    <Card className='viewChatBoard'>
      <div className='headerChatBoard'>
        <img
          className='viewAvatarItem'
          src={currentPeerUser.URL ? currentPeerUser.URL : images.nopic}
          alt=''
        />
        <span className='textHeaderChatBoard'>
          <p style={{ fontSize: '20px' }}>{currentPeerUser.name}</p>
        </span>
        <div className='aboutme'>
          <span>
            <p>{currentPeerUser.description}</p>
          </span>
        </div>
      </div>
      <div className='viewListContentChat'>
        {renderListMessage()}
        <div
          style={{ float: 'left', clear: 'both' }}
          ref={(el) => {
            messageEnd = el
          }}
        />
      </div>
      {isShowStiker ? renderStickers() : null}

      <div className='viewBottom'>
        <img
          className='icOpenGallery'
          src={images.input_file}
          alt='input_file'
          onClick={() => refInput.click()}
        />
        <input
          ref={(el) => {
            refInput = el
          }}
          className='viewInputGallery'
          accept='images/'
          type='file'
          onChange={onChoosePhoto}
        />
        <img
          className='icOpenSticker'
          src={images.sticker}
          alt='icon open sticker'
          onClick={openListSticker}
        />
        <input
          className='viewInput'
          placeholder='Type a message'
          value={inputValue}
          onChange={(event) => {
            setIsInputValue(event.target.value)
          }}
          onKeyPress={onKeyPress}
        />
        <img
          className='icSend'
          src={images.send}
          alt='icon send'
          onClick={() => {
            onSendMessage(inputValue, 0)
          }}
        />
      </div>
      {isLoading ? (
        <div className='viewLoading'>
          <ReactLoading
            type={'spin'}
            color={'#203152'}
            height={'3%'}
            width={'3%'}
          />
        </div>
      ) : null}
    </Card>
  )
}
export default ChatBox
