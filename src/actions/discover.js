import axios from 'axios';
import Store from '../reducers/store';
import botApiPayloads, {get_started} from '../shared/botApiPayloads'
import {getLSItem, setLSItem} from '../utility'

const apiURL = 'https://temp.neargroup.me/ag'
export function showLoader() {
    return {
        type: 'LOADER_NOTIFICATION',
        payload: true
    };
}

export function hitBotApi(data) {
  console.log('in hitBotApi');
  return axios({
      method: 'POST',
      url: `${BOT_API}rht`,
      data
  })
  .then(response => {
    console.log('hitBotApi response= ', response);
    return {
            type: 'BLANK',
        }
  })
  .catch(e => {
    console.log('hitBotApi error ', e);
  })

}

export const addBotData = (data) => {
  console.log('in addBotData = ', data);
    return {
            type: 'ADD_BOT_DATA',
            payload: data
        }
}

export const setBotData = (data) => {
  console.log('in setBotData = ', data);
    return {
            type: 'SET_BOT_DATA',
            payload: data
        }
}

export function sendBotReply(data) {
  console.log('in sendBotReply ', data);
  let bot_payload = {}
  let userData = getLSItem(`${LS_APP_PWA_USER_DETAILS}`) != null ? getLSItem(`${LS_APP_PWA_USER_DETAILS}`) : {};
  let channelType = getLSItem(`${LS_CHANNELTYPE}`)

    switch (data.payload_type) {
      case "get_started":
        bot_payload = botApiPayloads.get_started

        if(channelType != null) {
          // set channelType
          bot_payload["nearGroupWeb"] = channelType
          bot_payload["senderObj"]["channeltype"] = channelType
          bot_payload["contextObj"]["channeltype"] = channelType
        }
        // botData["text"] = "get started"
        bot_payload["senderObj"]["display"] = userData.name
        bot_payload["senderObj"]["channelid"] = userData.channelId
        bot_payload["senderObj"]["userProfilePic"] = userData.imageUrl
        bot_payload["contextObj"]["contextid"] = userData.channelId
        console.log("get-started bot_payload ", bot_payload);
        break;
      case "quick_reply":
        bot_payload = botApiPayloads.send_quick_reply

        if(channelType != null) {
          // set channelType
          bot_payload["nearGroupWeb"] = channelType
          bot_payload["senderObj"]["channeltype"] = channelType
          bot_payload["contextObj"]["channeltype"] = channelType
        }

        bot_payload["messageObj"]["refmsgid"] = data.payload.msgid
        bot_payload["messageObj"]["text"] = data.payload.selectedOption
        bot_payload["senderObj"]["userProfilePic"] = userData.imageUrl
        bot_payload["senderObj"]["display"] = userData.name
        bot_payload["senderObj"]["channelid"] = userData.channelId
        bot_payload["contextObj"]["contextid"] = userData.channelId
        console.log("quick_reply bot_payload ", bot_payload);
        // botData["text"] = ""
        break;
      case "normal_text":
        bot_payload = botApiPayloads.normal_text
        // bot_payload["messageObj"]["referralParam"] = data.payload.msgid
        try {
          if(channelType != null) {
            // set channelType
            bot_payload["nearGroupWeb"] = channelType
            bot_payload["senderObj"]["channeltype"] = channelType
            bot_payload["contextObj"]["channeltype"] = channelType
          }

          bot_payload["messageObj"]["text"] = data.payload.selectedOption.title
          bot_payload["senderObj"]["userProfilePic"] = userData.imageUrl
          bot_payload["senderObj"]["display"] = userData.name
          bot_payload["senderObj"]["channelid"] = userData.channelId
          bot_payload["contextObj"]["contextid"] = userData.channelId
          if(data.payload.selectedOption.refId)
          bot_payload["messageObj"]["referralParam"] = data.payload.selectedOption.refId
        } catch (e) {
          console.error('sendBotReply normal_text erro ', e);
        }
        // botData["text"] = ""
          console.log("normal_text bot_payload ", bot_payload);
        break;
      case 'postback':
        let refMsgId = ""
        if(data.payload.qr_payload != undefined) {
          console.log("sendBotReply postback -- qr_payload ");
          refMsgId = data.payload.qr_payload
        } else {
          refMsgId = data.payload.msgid
        }
        bot_payload = botApiPayloads.send_postback
        if(channelType != null) {
          // set channelType
          bot_payload["nearGroupWeb"] = channelType
          bot_payload["senderObj"]["channeltype"] = channelType
          bot_payload["contextObj"]["channeltype"] = channelType
        }
        bot_payload["messageObj"]["refmsgid"] = refMsgId
        bot_payload["messageObj"]["text"] = data.payload.selectedOption
        bot_payload["senderObj"]["userProfilePic"] = userData.imageUrl
        bot_payload["senderObj"]["display"] = userData.name
        bot_payload["senderObj"]["channelid"] = userData.channelId
        bot_payload["contextObj"]["contextid"] = userData.channelId
        console.log("postback bot_payload ", bot_payload);
      default:

    }
  // }
  console.log('final bot_payload ', bot_payload);

  // TODO: api with payload
  return hitBotApi(bot_payload)
  // return addBotData(bot_payload)
}

export const addDiscoverChildListener = channelId => {
    return {
        type: 'ADD_DISCOVER_CHILD_LISTENER',
        payload: channelId
    }
}
