import axios from 'axios';
import Store from '../reducers/store';
import {getLSItem, setLSItem} from '../utility'

// const apiURL = 'https://mytest.neargroup.me/ng/'  //'https://temp.neargroup.me/ag'
export function showLoader() {
    return {
        type: 'SHOW_LOADER',
        payload: true
    };
}

export const getUsersNearbyChannelids = () => {
  // = '040f6a5ff54643e0ab24795e3f426766'
  let authId = getLSItem(`${LS_AUTHID}`)
  console.log('getUsersNearbyChannelids= ', authId);
    // Store.dispatch(showLoader());
  if(authId != null) {
    authId = authId.auth1
    return {
      type: 'NEARBY_CHANNELIDS',
      payload: axios({
        url: `https://web.neargroup.me/ng/UsersNearBy?auth=${authId}`,
      }).then(response => {
        console.log('getUsersNearbyChannelids response= ', response);
        return response
      }).catch(err => ({ err }))
    }
  } else {
    return {
      type: '_BLANK_'
    }
  }
}

export const getNearbyUserDetails = (channelid) => {
  console.log('getNearbyUserDetails= ', channelid);
  let channelId2 = getLSItem(`${LS_CHANNELID}`)
    // Store.dispatch(showLoader());
    if(channelid != null) {
      return {
        type: 'NEARBY_USER_DETAILS',
        payload: axios({
          url: `https://web.neargroup.me/ng/getProfile?channelId=${encodeURIComponent(channelid)}&channelId2=${encodeURIComponent(channelId2)}`
        }).then(response => {
          return {response, channelid}
        }).catch(err => ({ err }))
      }
    } else {
      return {
        type: '_BLANK_'
      }
    }
}

export const actionUserNearby = (action, userChannelId, user) => {
  let channelid = getLSItem(`${LS_CHANNELID}`)
  // = '040f6a5ff54643e0ab24795e3f426766'
  console.log('actionUserNearby= ', action, userChannelId, user);
    // Store.dispatch(showLoader());
    // TODO: below statement, only for testing
    // const BOT_API = 'https://web.neargroup.me/ng/'
    return {
        type: '_BLANK_',
        payload: axios({
            method: 'POST',
            url: `${BOT_API}ViewedProfile`,
            data: {
              "channelId": getLSItem(`${LS_CHANNELID}`),
              "viewed": userChannelId,
              "response": action
            }
        }).then(response => {
          console.log('actionUserNearby response= ', response);
          return response
        }).catch(err => ({ err }))
    }
}

export const getProfileUserDetails = (channelid) => {
  console.log('getProfileUserDetails= ', channelid);
    // Store.dispatch(showLoader());
    if(channelid != null) {
      return {
        type: 'PROFILE_USER_DETAILS',
        payload: axios({
          url: `${BOT_API}getProfile?auth=${channelid}`,
          // url: 'https://api.myjson.com/bins/10c95u'
        }).then(response => {
          return {response, channelid}
        }).catch(err => ({ err }))
      }
    } else {
      return {
        type: '_BLANK_'
      }
    }
}
