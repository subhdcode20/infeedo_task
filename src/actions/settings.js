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

export const getQuestions = (channelid) => {
  // = '040f6a5ff54643e0ab24795e3f426766'
  console.log('getQuestions= ', channelid);
    // Store.dispatch(showLoader());
    return {
        type: 'QUESTIONS',
        payload: axios({
            url: `${BOT_API}getQuestions?id=${channelid}`,
            // url: 'https://api.myjson.com/bins/10c95u'
        }).then(questions => {
          console.log('get questions response= ', questions);
          return {questions}
          // load answers after questions ..to load question first so that page is not blank
            // return axios({
            //     url: `${BOT_API}getAnswers?id=${channelid}`,
            //     // url: 'https://api.myjson.com/bins/7rg4i'
            // }).then(answers => ({ questions, answers }))
        }).catch(err => ({ err }))
    }
}

export const getAnswers = (channelid) => {
  // = '040f6a5ff54643e0ab24795e3f426766'
  console.log('getAnswers= ', channelid);
    // Store.dispatch(showLoader());
    return {
        type: 'ANSWERS',
        payload: axios({
            url: `${BOT_API}getAnswers?id=${channelid}`,
            // url: 'https://api.myjson.com/bins/10c95u'
        }).then(answers => {
          return {answers}
        }).catch(err => ({ err }))
    }
}

export const setUsetInput = (id, val, meta) => {
  console.log('in action setUsetInput ', id, val, meta);
  if(meta == undefined) meta = id
  return {
    type: 'USER_ANSWER',
    payload: {id, option: val, meta}
  }
}

export const deleteUserAnswers = (val) => {
  console.log('in action deleteUserAnswers ', val);
  return {
    type: 'DELETE_USER_ANSWER',
    payload: val
  }
}

export const saveUserInput = (data, channelid, reload = false) => {
  // TODO: set channelId from localStorage
  // let channelid = '040f6a5ff54643e0ab24795e3f426766';
  console.log('saveUserInput= ', data, channelid);
  if(channelid !='' && channelid != null) {

    Store.dispatch(showLoader());
    // type: 'HIDE_LOADER',
    return {
        type: 'SAVE_USER_INPUT',
        payload: axios({
            method: 'POST',
            url: `${BOT_API}saveSettings?id=${channelid}`,
            data,
            headers: {
              'Content-Type': 'application/json'
            }
            // url: 'https://api.myjson.com/bins/10c95u'
        }).then(response => {
            if(response.status == 200 && response.data.all_data.result && reload) {
              setTimeout(() => {
    			      console.log("bye bye! ", reload);
    			      try {
    			          window.location.reload(true);
    			      } catch (err) {
    			        console.log('refersh err ', err);
    			      }
    			      // else window.close();
    			    }, 800)

            }

            return response

            // console.log('saveUserInput response= ', response);
            // // TODO: check BIO_VULGAR
            // Store.dispatch(deleteUserAnswers([]))
            // if(response.status == 200) {
            //   if('BIO_VULGAR' in response.data && response.data.BIO_VULGAR.BIO_VULGAR ) {
            //     Store.dispatch(showSnackbarMsg("No explicit words allowed. Edit 'About Me'"))
            //   }
            //   else if('BIO_PHONE' in response.data && response.data.BIO_PHONE.BIO_PHONE) {
            //     Store.dispatch(showSnackbarMsg("No phone numbers allowed. Edit 'About Me'"))
            //   }
            //   else if('BIO_LINKS' in response.data && response.data.BIO_LINKS.BIO_LINKS) {
            //     Store.dispatch(showSnackbarMsg("No links allowed. Please Edit 'About Me'"))
            //   }
            //   else if('USER_VULGAR' in response.data && response.data.USER_VULGAR.USER_VULGAR ) {
            //     Store.dispatch(showSnackbarMsg("No explicit words allowed. Edit 'Username'"))
            //   }
            //   else if('USER_PHONE' in response.data && response.data.USER_PHONE.USER_PHONE) {
            //     Store.dispatch(showSnackbarMsg("No phone numbers allowed. Edit 'Username'"))
            //   }
            //   else if('USER_LINKS' in response.data && response.data.USER_LINKS.USER_LINKS) {
            //     Store.dispatch(showSnackbarMsg("No links allowed. Please Edit 'Username'"))
            //   }
            //   else if(response.data.all_data.result) {
            //     Store.dispatch(showSnackbarMsg("Changes saved"))
            //     setTimeout(() => {
            //       console.log("bye bye! ", reload);
            //       try {
            //
            //         if(reload) window.location.reload(true);
            //       } catch (err) {
            //         console.log('refersh err ', err);
            //       }
            //       // else window.close();
            //     }, 800)
            //   }
            // } else {
            //   Store.dispatch(showSnackbarMsg("Something went wrong! Please Try again later"))
            // }
            // return response

        }).catch(err => ({ err }))
    }
  }else {
    console.log('saveUserInput invalid data= ', data);
    return {
      type: 'HIDE_LOADER',
      payload: "blank"
    }
  }
}

export const showSnackbarMsg = (msg) => {
  console.log('showSnackbarMsg msg action ', msg);
  return {
    type: "SNACKBAR_MSG",
    payload: msg
  }
}

export const getAuthIdData = (channelId) => {
  Store.dispatch(showLoader());
  return {
    type: "QUES_ANS",
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
				setLSItem(`${LS_AUTHID}`, authData) //NG_APP_SD_AUTHID
        let authId = authData.auth2
				    return axios({
                url: `${BOT_API}getQuestions?id=${authId}`,
            }).then(questions => {
              console.log('get questions response= ', questions);
              if(questions.status >= 200 && questions.status < 300) {
                // load answers after questions ..to load question first so that page is not blank
                return axios({
                  url: `${BOT_API}getAnswers?id=${authId}`,
                }).then(answers => {
                  if(answers.status >= 200 && answers.status < 300) {
                    return { questions, answers }  //})
                  } else {
                    return {err: true}
                  }
                }).catch(err => ({ err }))
              } else {
                return {err: true}
              }
            }).catch(err => ({ err }))

			} else {
        return {err: true}
      }
    })
    .catch(e => {
      console.log('getAuthid action error ', e);
      return { err }
    })
  }
}
export const setLocationInputText = (val) => {
  return {
    type: 'SET_LOCATION_TEXT',
    payload: val
  }
}

export const saveDetectLocation = (data, getAddress = false) => {
  let channelId = getLSItem(`${LS_CHANNELID}`)
  console.log('in saveDetectLocation= ', data, channelId, getAddress);
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
            type: 'SAVE_DETECT_LOCATION',
            payload: {coords: data.coords, response: response.data, error: data.error ? data.error : false}
          }
        } else {
          return {
            type: 'SAVE_DETECT_LOCATION',
            payload: data
          }
        }
    })
    .catch(error => {
      return {
        type: 'SAVE_DETECT_LOCATION',
        payload: data
      }
      console.log('failed', error)
    });

  } else {
    return {
      type: 'BLANK'
    }
  }
}


export const getAutocompleteResults = (val) => {
  console.log('AUTOCOMPLETE_RESULT ', val);
  return {
    type: 'AUTOCOMPLETE_RESULT',
    payload: axios({
      method: 'GET',
      url: `https://autocomplete.geocoder.api.here.com/6.2/suggest.json?query=${val}&app_id=${HERE_MAP_APP_ID}&app_code=${HERE_MAP_APP_CODE}`
    }).then(response => {
      console.log('getAutocompleteResults response ', response);

      return response
    })
    .catch(e => {
      return {error: true}
    })
  }
}

export const emptyPlacesSuggestions = () => {
  return {
    type : 'AUTOCOMPLETE_RESULT',
    payload:  {status: 200, data: {suggestions: [], noPlacesFound: false}}
  }
}

// export const imageFilterUpload = (imageName, formData, authid, answer) => {
//   console.log('imageFilterUpload ', imageName, formData, authid, answer);
//
//   axios({
//     method: 'POST',
//     url: `${FACE_API}`,
//     data: formData
//   })
//   .then(response => {
//     console.log("foremdata = ", response);
//     if(response.data.error && response.data.error == "No face") {
//       this.setState({loading: false,imageUrl: 'https://s3-us-west-2.amazonaws.com/ng-utilities-images/demo_boy.png'})
//       this.props.showMessage('Image does not have a face! Upload another image.')
//     } else if(response.data.error && response.data.error == "adult image") {
//       this.setState({loading: false,imageUrl: 'https://s3-us-west-2.amazonaws.com/ng-utilities-images/demo_boy.png'})
//       this.props.showMessage('Vulgur content is not allowed! Upload another image.')
//     } else {
//       //success
//       this.setState({loading: false, imageUrl: 'https://s3-us-west-2.amazonaws.com/ng-image/ng/profile/profile_' + imageName}, () => {
//         console.log('uploaded imageName= ', this.state);
//       })
//       let data = [{...this.props.answer, option: imageName}]
//       // data[0].option = imageName
//       console.log('saveImgSettings data= ', data);
//       // this.setState({imageUrl: 'https://s3-us-west-2.amazonaws.com/ng-image/ng/profile/profile_' + "profile_" + imageName})
//       axios({
//         method: 'POST',
//         url: `${BOT_API}saveImgSettings?id=${authid.auth2}`,
//         data
//       })
//       .then(resp => {
//         if(resp.status == 200 && resp.data.result == "success") {
//           // this.setState({loading: false, imageUrl: 'https://s3-us-west-2.amazonaws.com/ng-image/ng/profile/profile_' + imageName}, () => {
//           //   console.log('uploaded imageName= ', this.state);
//           // })
//           // ,showSnackbar: true, snackbar_msg: "Image uploaded!"
//           this.props.showMessage("Image uploaded!")
//         } else {
//           this.setState({loading: false, imageUrl: 'https://s3-us-west-2.amazonaws.com/ng-utilities-images/demo_boy.png'})
//           // showSnackbar: true, snackbar_msg: "Something went wrong! Please try again later",
//           this.props.showMessage("Something went wrong! Please try again later")
//         }
//       })
//       .catch(e => {
//         console.log('save image ', e);
//         this.setState({loading: false,imageUrl: 'https://s3-us-west-2.amazonaws.com/ng-utilities-images/demo_boy.png'})
//         // ,showSnackbar: true, snackbar_msg: "Image upload failed. Please try again later"
//         this.props.showMessage("Image upload failed. Please try again later")
//       })
//
//     }
//   })
//   .catch(e => {
//     this.setState({loading: false,imageUrl: 'https://s3-us-west-2.amazonaws.com/ng-utilities-images/demo_boy.png'})
//     // , showSnackbar: true, snackbar_msg: "Something went wrong. Please try again later."
//     this.props.showMessage("Something went wrong. Please try again later.")
//     console.log('formdata showSnackbar ', e);
//   })
//
// }
