import axios from 'axios';

export const getItems = (channelid) => {
      return {
          type: 'ITEMS',
          payload: axios({
              url: 'http://demo2847571.mockable.io/items',
          }).then(res => {
            console.log('got items= ', res);
            return res
          }).catch(err => ({ err }))
      }
  }