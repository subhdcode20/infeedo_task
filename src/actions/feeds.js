import axios from 'axios';
import Store from '../reducers/store';
import {getLSItem, setLSItem} from '../utility'

export const getFeeds = (channelid, forceRefresh = true, lastFeedId = '') => {
  let type = 'GET_FEEDS', postData = {
    "authentication":{
      "signature":"x3BV0Qd3FopuT4JNLqslVokfoi194s1Kt2PKonEj3F0.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImlzc3VlZF9hdCI6MTU1ODAwNTkyNywicGxheWVyX2lkIjoiMTc4Mzc5NzMyODM5MDkwOSIsInJlcXVlc3RfcGF5bG9hZCI6bnVsbH0",
      "appName":"profoundly"
    },
    "body": {
      "playerId":"1783797328390909",
      "isFirst": forceRefresh
    }
  }
  if(!forceRefresh) {
    // get more feeds from last feed id
    type = 'GET_MORE_FEEDS',
    postData.body['last_id'] = lastFeedId
  }


    return {
        type: type,
        payload: axios({
          method: 'POST',
          url: `${NEW_API}${GET_FEED_ENDPOINT}`,
          headers: {
            'Content-Type': 'application/json'
          },
          data: postData
        }).then(response => {
          console.log('get response response= ', response);
          return {response}
          // load answers after questions ..to load question first so that page is not blank
            // return axios({
            //     url: `${BOT_API}getAnswers?id=${channelid}`,
            //     // url: 'https://api.myjson.com/bins/7rg4i'
            // }).then(answers => ({ questions, answers }))
        }).catch(err => ({ err }))
    }
}
