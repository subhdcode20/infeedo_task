import axios from 'axios';
import Store from '../reducers/store';
import {getLSItem, setLSItem} from '../utility'

export function showLoader() {
    return {
        type: 'LOADER_FRNDS',
        payload: true
    };
}

export const getFriends = (authId = '') => {
    // authId = getLSItem(`${LS_AUTHID}`)
    console.log('getFriends action authId ', authId);
    const startTime = localStorage.getItem(`NG_APP_SD_START`) || Date.now();
    // Store.dispatch(showLoader());
    return axios({
        method: 'GET',
        url: `${BOT_API}getFriends?id=${authId}`,
        // 'https://pwabot.neargroup.me/ng/getFriends?authId=100afb4688784de5acac5b2e62ed9bf0',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then( response => {
        return {
            type: 'FRIENDS_LIST',
            payload: response
        }
    })
    .catch( error => {
        return {
            type: 'FRIENDS_LIST',
            payload: { data: 0, err: true }
        }
    });
}

export const getNewFriendRequests = () => {
  let authId = getLSItem(`${LS_AUTHID}`)
  console.log('getNewFriendRequests action authId ', authId);
  console.log('getNewFriendRequests ', authId);
  if(authId != null)
    authId = authId.auth1
    return axios({
        method: 'GET',
        url: `${API}getFriendRequests?id=${authId}`,  //'https://myfriends.neargroup.me/ng/getFriends?id=2c4049be7a41473d8b743a816bed041b',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then( response => {
        return {
            type: 'NEW_FRIEND_REQUEST_LIST',
            payload: response
        }
    })
    .catch( error => {
        return {
            type: 'NEW_FRIEND_REQUEST_LIST',
            payload: { data: 0, err: true }
        }
    });
}

export const getFriendsChat = (channelId, friends) => {
    return axios({
        method: 'POST',
        url: `${API}getFriendsChat`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            channelId,
            friends
        }
    })
    .then( response => {
        return {
            type: 'BOT_CHAT',
            payload: response
        }
    })
    .catch( error => {
        return {
            type: 'BOT_CHAT',
            payload: { data: 0, err: true }
        }
    });
}

export const sendPush = data => {
  console.log("in sendPush 222-- ", data);
    if(typeof data === 'object') {
      console.log("data type object");
       data.isRegistered = 1;
     }
    return axios({
        method: 'POST',
        url: `${API}notifyUser`,
        data
    })
    .then( response => {
      console.log("notifyUser response-- ", response);
        return {
            type: 'SENT',
            payload: response
        }
    });
}

export const getFriendsCache = () => {
    return {
        type: 'FRIENDS_LIST_CACHE',
        payload: true
    }
}

export const getLastMsg = (id, msg) => {
  console.log("in LAST_MSG");
    return {
        type: 'LAST_MSG',
        payload: { id, msg }
    }
}

export const setMeeting = meetingId => {
    return {
        type: 'SET_MEETING',
        payload: meetingId
    }
}

export const addChildListener = meetingId => {
    return {
        type: 'ADD_CHILD_LISTENER',
        payload: meetingId
    }
}

export const setChats = meetingId => {
    return {
        type: 'SET_CHATS',
        payload: meetingId
    }
}

export const addChats = (meetingId, msg) => {
    return {
        type: 'ADD_CHATS',
        payload: { meetingId, msg }
    }
}

export const setItems = (item, id, val) => {
    return {
        type: 'SET_ITEMS',
        payload: { item, id, val }
    }
}

export const unfriend = (channelId, unfriendChannelId) => {
    Store.dispatch(showLoader());
    return {
        type: 'UNFRIEND',
        payload: axios({
            method: 'POST',
            url: `${API}unfriendsUser`,
            data: { channelId, unfriendChannelId }
        })
    }
}

export const setUnreadChatCount = (meetingId, count, msg) => {
    return {
        type: 'SET_UNREAD_CHAT_COUNT',
        payload: { meetingId, count , msg}
    }
}

export const getAuthIdData = (channelId) => {
  console.log("getAuthIdData= ", channelId);
    Store.dispatch(showLoader());
  return {
    type: "FRIENDS_LIST",
    payload: axios({
      method: 'GET',
      url: `${BOT_API}userAuthId?id=${channelId}`,  //`https://mytest.neargroup.me/ng2/userAuthId?id=${channelId}`,
      headers: {
          'Content-Type': 'application/json'
      }
    })
    .then(data => {
      // return response
      if(data.status == 200 && data.data.result == true) {
        let authData = {
					auth1: data.data.auth1 ? data.data.auth1 : null,
					auth2: data.data.auth1 ? data.data.auth1 : null,
					auth3: data.data.auth1 ? data.data.auth1 : null,
				}
				setLSItem(`${LS_AUTHID}`, authData) // NG_APP_SD_AUTHID
        let authId = authData.auth1
				return axios({
                method: 'GET',
                url: `${BOT_API}getFriends?id=${authId}`,
                headers: {
                    'Content-Type': 'application/json'
                }
                // url: 'https://api.myjson.com/bins/10c95u'
            }).then(response => {
              return response
            }).catch(err => ({ data: 0, err }))
      } else {
        return {err: true}
      }

			// }
    })
    .catch(e => {
      console.log('getAuthid action error ', e);
      return { err }
    })
  }
}

export const saveChatReqAction = (action = null, data = null) => {
  let url = '', body = {}, channelId = getLSItem(`${LS_CHANNELID}`)
  console.log('saveChatReqAction ', action, data);
  if(channelId == null || action == null || data == null) return {type: '_BLANK_'}

  if(action.toLowerCase() == 'accept') {
    url = `${API}requestAccepted`;
    // 'https://pwatest.neargroup.me/ngTesting/requestAccepted'
    body = {
      "decline":action,
      "meetingId": data.meetingId,
      "friendRequestId": data.friendRequestId,
      "type": data.type,
      "userChannelId": channelId,
      "requesterChannelId": data.channelId
    }
  } else if (action.toLowerCase() == 'rejected') {
    url = `${API}requestDeclined`;
    // 'https://pwatest.neargroup.me/ngTesting/requestDeclined'
    body = {
      "decline":action,
      "meetingId": data.meetingId,
      "friendRequestId": data.friendRequestId,
      "type": data.type,
      "userChannelId": channelId,
      "requesterChannelId": data.channelId
    }
  }
  console.log('saveChatReqAction final ', url, body);
  return {
    type: 'CHAT_REQ_ACTION',
    payload: axios({
      method: 'POST',
      url,
      data: body,
      headers: {
          'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      //refresh friendList
      let authId = getLSItem(`${LS_AUTHID}`)
      if(authId != null) {
        Store.dispatch(getFriends(authId.auth1))
        Store.dispatch(getNewFriendRequests())
      }
      console.log('saveChatReqAction final return ', {response, actiontype: action.toLowerCase()});
      return {response, actiontype: action.toLowerCase()}
    })
    .catch(e => {
      console.log('CHAT_REQ_ACTION catch error ', e);
      return {type: '_BLANK_'}
    })
  }
}


// export const processChat = (chatobj, data, fromId, isOtherOnline) => {
//   console.log('processChat action chatobj= ', chatobj, data, fromId, isOtherOnline);
//   console.log("firebase n processChat=", firebase, navigator.onLine && !(isOtherOnline && isOtherOnline[chatobj.toId]));
//   // const { data, fromId, isOtherOnline } = this.props;
//   let testref= firebase.database().ref(`/rooms/${data}`)
//   console.log("testref= ", testref);
//   testref.once("value")
//   .then(function(snapshot) {
//     var key = snapshot.key; // "ada"
//     console.log('snapshot key= ', key);
//     //var childKey = snapshot.child("name/last").key; // "last"
//   });
//
//   firebase
//     .database()
//     .ref(`/rooms/${data}`)
//     .push(chatObj).then(res => {
//       console.log('push offline msg to firebase');
//       chatObj.id = res.key;
//       if (chatObj.id) {
//         // this.storeChat(chatObj);
//
//         const chats = JSON.parse(localStorage.getItem(`NG_APP_SD_CHAT_${data}`)) || [];
//         chats.push(chatObj);
//         localStorage.setItem(
//           `NG_APP_SD_CHAT_${this.props.data}`,
//           JSON.stringify(chats)
//         );
//
//       }
//       console.log('getLastMsg in processChat= ', data, chatObj);
//       // this.props.
//       getLastMsg(data, chatObj)
//     });
//   // try {
//   //   //this.refs["autoFocus"].select();
//   // } catch (e) {}
//
//   if (navigator.onLine && !(isOtherOnline && isOtherOnline[chatobj.toId])) { //
//     console.log("sendPush= ", {
//       toChannelId: chatobj.toId,
//       fromChannelId: fromId,
//       msg: chatObj.msg  //this.state.message.substring(0,200)
//     });
//     // this.props.
//     sendPush({
//       toChannelId: chatobj.toId,
//       fromChannelId: fromId,
//       msg: chatObj.msg  //this.state.message.substring(0,200)
//     });
//   }
//
// }

// export const storeChat = (msg) => {
//   try {
//     const { data } = this.props;
//     const chats = JSON.parse(localStorage.getItem(`NG_APP_SD_CHAT_${data.meetingId}`)) || [];
//     chats.push(msg);
//     localStorage.setItem(
//       `NG_APP_SD_CHAT_${this.props.data.meetingId}`,
//       JSON.stringify(chats)
//     );
//   }catch(e){}
// }
