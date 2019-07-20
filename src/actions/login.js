import axios from 'axios';
import Store from '../reducers/store';
import {getLSItem, setLSItem} from '../utility'

const apiURL = 'https://temp.neargroup.me/ag'
export function showLoader() {
    return {
        type: 'LOADER_NOTIFICATION',
        payload: true
    };
}

// export const getNotifications = (channelid = '2c4049be7a41473d8b743a816bed041b') => {
//     Store.dispatch(showLoader());
//     const data = { channelid };
//     return axios({
//       method: 'POST',
//       url: `${apiURL}/myNotification`,
//       data
//     })
//     .then( response => {
//         return {
//             type: 'NOTIFICATIONS',
//             payload: response
//         }
//     })
//     .catch( error => {
//         return {
//             type: 'NOTIFICATIONS',
//             payload: { data: 0, error }
//         }
//     } );
// }

export const getUserAuth = (channelId) => {
  return axios({
    method: 'GET',
    url: `${BOT_API}userAuthId?id=${channelId}`,  //`https://mytest.neargroup.me/ng2/userAuthId?id=${channelId}`,
    headers: {
        'Content-Type': 'application/json'
    }
  })
  .then(response => {

    return {
      type: 'SET_USER_AUTH',
      payload: response
    }
  })
  .catch(error => {
    return {
      type: 'BLANK'
    }
  })
}

export const saveChannelId = (data) => {
  console.log('saveChannelId= ', data);
    return {
            type: 'SAVE_CHANNELID',
            payload: data
        }
}

export const saveLoginSession = (data) => {
  console.log('saveLoginSession= ', data);
    return {
            type: 'SAVE_LOGIN',
            payload: data
        }
}

export const addBotData = (data) => {
    return {
            type: 'ADD_BOT_DATA',
            payload: data
        }
}

export const saveLocation = (data, getAddress = false) => {
  let channelId = getLSItem(`${LS_CHANNELID}`)
  console.log('in saveLocation= ', data, channelId, getAddress);
  // let location = data.error ? false : {lat: data.coords.latitude, long: data.coords.longitude}
  let locationData = {}
  if(data.error) {
    console.log('error in location ');
    locationData = {
      failed: true,
      test: data.msg
    }
  } else {
    console.log('location ok');
    locationData = {lat: data.coords.latitude, lon: data.coords.longitude}
  }
  console.log('locationData ', locationData);
  if (channelId != null) {
    const postData = {
      channelid: channelId,
      location : locationData
    }
    // data.error ? "false" : {lat: data.coords.latitude, lon: data.coords.longitude},
    // address: true
    if(getAddress) postData["address"] = true
    // fcmtoken
    return axios({
      method: 'POST',
      url: `${BOT_API}pwaLocation`,
      data: postData
    })
    .then(response => {
        console.log('location data after response ', data);
        if(response.status >= 200 && response.status < 300) {
          console.log('response ok ', {...data, response: response.data});
          return {
            type: 'SAVE_LOCATION',
            payload: {coords: data.coords, response: response.data, error: data.error ? data.error : false}
          }
        } else {
          return {
            type: 'SAVE_LOCATION',
            payload: data
          }
        }
    })
    .catch(error => {
      return {
        type: 'SAVE_LOCATION',
        payload: data
      }
      console.log('failed', error)
    });

  } else {
    return {
      type: 'BLANK'
    }
  }

    // return {
    //         type: 'SAVE_LOCATION',
    //         payload: data
    //     }
}

export const saveFCMtoken = (token, result) => {
  let channelId = getLSItem(`${LS_CHANNELID}`)
  console.log('in saveFCMtoken ', token, result, channelId);
  if (channelId != null) {
    const data = {
      channelid: channelId,
      accessToken: token,
      result
    }
    // fcmtoken
     // FCMTokenWebBot
    return axios({
      method: 'POST',
      url: `${BOT_API}fcmTokenPwaBot`,
      data
    })
    .then(response => {
      if(token != false) {
        return {
          type: 'SAVE_FCM_TOKEN',
          payload: token
        }
      } else {
        return {
          type: 'BLANK'
        }
      }
      console.log('recorded', token)
    })
    .catch(error => {
      if(token != false) {
        return {
          type: 'SAVE_FCM_TOKEN',
          payload: token
        }
      } else {
        return {
          type: 'BLANK'
        }
      }
      console.log('failed', error)
    });

  } else {
    return {
      type: 'BLANK'
    }
  }
}

export const saveNotiPopupAction = (data) => {
  console.log('in saveNotiPopupAction ', data);
  let authId = getLSItem(`${LS_AUTHID}`)
  if(authId != null) {
    authId = authId.auth1
    return axios({
      method: 'POST',
      url: `${BOT_API}saveNotiPopupAction`,  //`https://mytest.neargroup.me/ng2/userAuthId?id=${channelId}`,
      data: JSON.stringify({authId, action: data}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('');
      return {
        type: 'BLANK'
      }
    })
    .catch(e => {
      return {
        type: 'BLANK'
      }
    })

  }

}

export const saveOnboardingData = (data) => {
    return {
            type: 'SAVE_ONBOARDING',
            payload: data
        }
}

export const firebaseDefined = (value) => {
  return {
    type: 'FIREBASE_INITIALIZE',
    payload: value
  }
}

export const hideNotificationsForNow = () => {
  return {
    type: 'HIDE_NOTI_FORNOW',
    payload: true
  }
}

export const getInitialText = (authId) => {
  console.log('getInitialText ', authId);
  if(authId != null) {
    return {
      type: 'INITIAL_TEXT',
      payload: axios({
        url: `${BOT_API}settingsPageInitialText?id=${authId}`
      })
      .then(response => {
        return response
      })
      .catch(err => ({ err }))
    }

  } else {
    return {
      type: '_BLANK_'
    }
  }
}
