import {getLSItem, setLSItem, preLoadImage} from '../utility'

export default function ng(state = [], action) {

	const tempState = { ...state }

	switch(action.type) {
		case 'SHOW_LOADER': {
			return { ...tempState, isLoading: true }
		}
		case 'QUES_ANS' : {
			console.log('QUES_ANS ', action.payload);
			const { questions: qData = {}, answers: aData = {} } = action.payload;
			const { status: qStatus = 0, data: questions = {} } = qData;
			const { status: aStatus = 0, data: answers = {} } = aData;
			let invalidAccess = false

			if(
				qStatus >= 200 && qStatus <=300 &&
				aStatus >= 200 && aStatus <=300 &&
				!action.payload.err
			) {
				tempState.questions = questions.questions || []
				tempState.answers = answers.answers || []
				tempState.paidUser = answers.paidUser || false
				const channelId = questions.channelId;

				// todo: testing only, remove this
				tempState.questions.map(item => {
					if(item.id == 'lookingFor') {
						console.log('found new to be radio ', item);
						item.type = 'radioSelect'

					}
				})

				console.log('channelId from questions ', channelId);
				if(channelId) setLSItem(`${LS_CHANNELID}`, channelId)

				//preload image
				let imageAns = answers.answers.find(item => {
					return item.id == 'profileImage'
				})
				console.log('imageAns ', imageAns);
				if(imageAns.option && imageAns.option != '') {
					// preLoadImage(imageAns.option)
					setLSItem(`${LS_APP_PWA_PROFILE_IMAGE}`, imageAns.option)
				}
			} else {
				invalidAccess = true
				tempState.invalidAccessCode = 'QUES_ANS_ERROR'
			}

			return { ...tempState, isLoading: false, invalidAccess }
		}
		case 'QUESTIONS': {
			console.log('QUESTIONS payload= ', action.payload);
			let invalidAccess = false;
			const { questions: qData = {} } = action.payload;
			const { status: qStatus = 0, data: questions = {} } = qData;
			console.log('data in questions reducer ', questions, questions.channelId);
			// const questions = data.questions;
			console.log('final questions ', questions);

			if(qStatus >= 200 && qStatus <= 300 && questions["Grant Access"] != false && !action.payload.err) {
				tempState.questions = questions.questions || []

				// todo: testing only, remove this
				tempState.questions.map(item => {
					if(item.id == 'lookingFor') {
						console.log('found new to be radio '. item);
						item.type = 'radioSelect'

					}
				})

				const channelId = questions.channelId;
				console.log('channelId from questions ', channelId);
				// if(channelId) setLSItem(`${LS_URL_CHANNELID}`, channelId)
				if(channelId) setLSItem(`${LS_CHANNELID}`, channelId)
			} else {
				invalidAccess = true
				tempState.invalidAccessCode = 'QUES_ERROR'
			}
			return { ...tempState, isLoading: false, invalidAccess }
		}

		case 'ANSWERS': {
			console.log('ANSWERS: ', action.payload);
			let invalidAccess = false
			const { answers: aData = {} } = action.payload;
			const { status: aStatus = 0, data: answers = {} } = aData;

			if(aStatus >= 200 && aStatus <=300 && answers["Grant Access"] != false && !action.payload.err) {
				tempState.answers = answers.answers || [];
				tempState.paidUser = answers.paidUser || false;

				//preload image
				let imageAns = answers.answers.find(item => {
					return item.id == 'profileImage'
				})
				console.log('imageAns ', imageAns);
				if(imageAns.option && imageAns.option != '') {
					// preLoadImage(imageAns.option)
					setLSItem(`${LS_APP_PWA_PROFILE_IMAGE}`, imageAns.option)
				}
			} else {
				invalidAccess = true
				tempState.invalidAccessCode = 'ANS_ERROR'
			}
			return { ...tempState, isLoading: false, invalidAccess }
		}

		case 'SAVE_DETECT_LOCATION':
			console.log('SAVE_DETECT_LOCATION= ', action.payload);
			let location = {}, detectLocationName= false
			if(action.payload.error) {
				location = false
			} else if(action.payload != null || action.payload != undefined) {
        let {coords} = action.payload
				location = true
				let localState = {
					lat: coords.latitude,
					long: coords.longitude,
					accuracy: coords.accuracy
				}
				// localStorage.setItem("NG_APP_SD_LATLONG", JSON.stringify(localState))
				setLSItem(`${LS_APP_PWA_LATLONG}`, localState)

      }
			if(action.payload.response && action.payload.response.result && action.payload.response.result != 'notNow')
				detectLocationName = action.payload.response.result
      console.log('SAVE_DETECT_LOCATION = ', location, action.payload);
			return { ...tempState, location, detectLocationName, locationLoading: false }
			break;

		case 'AUTOCOMPLETE_RESULT': {
			console.log('AUTOCOMPLETE_RESULT ', action.payload, action.payload.status, action.payload.data);
			let invalidAccess = false, placesSuggestions = tempState.placesSuggestions || [], noPlacesFound = false
			const { status: aStatus = 0, data: suggestions = {} } = action.payload;
			if(aStatus >= 200 && aStatus <=300 && !action.payload.err) {
				placesSuggestions = suggestions.suggestions || []
			} else {
				invalidAccess = true
				tempState.invalidAccessCode = 'AUTO_ERROR'
			}
			console.log('suggestions ', suggestions);
			if('noPlacesFound' in suggestions) {console.log('suggestions.noPlacesFound ' ); noPlacesFound = suggestions.noPlacesFound }
			else { noPlacesFound = placesSuggestions.length > 0 ? false : true }
			console.log('final AUTOCOMPLETE_RESULT ', placesSuggestions, noPlacesFound, invalidAccess);
			return { ...tempState, isLoading: false, invalidAccess, placesSuggestions, noPlacesFound, detectLocationName: false }
		}

		case 'USER_ANSWER': {
			const {id, option, meta} = action.payload
			console.log('USER_ANSWER ', action.payload, id, option, meta);
			let {userAnswers=[], answers= []} = tempState
			let currentItemIndex = userAnswers.findIndex((item) => {
				return item.id == id
			})
			console.log('currentItemIndex= ', currentItemIndex);
			if(currentItemIndex == -1) {
				//new entry
				console.log('new entry');
				userAnswers.push(action.payload)
			} else {
				//update entry
				console.log('updating old entry');
				userAnswers[currentItemIndex].option = option
				userAnswers[currentItemIndex].meta = meta
			}

			//save selected data as answer
			let currentAnsIndex = answers.findIndex((item) => {
				return item.id == id
			})
			answers[currentAnsIndex].option = option
			console.log('USER_ANSWER= ', userAnswers, answers);
			return {...tempState, userAnswers}
		}
		break;
		case 'SAVE_USER_INPUT': {
			let {showSnackbar = '', userAnswers} = tempState
			let response = action.payload
			console.log('SAVE_USER_INPUT ', response, showSnackbar);
			// Store.dispatch(deleteUserAnswers([]))
			if(response.status >= 200 && response.status <= 300) {
				userAnswers = [];
			  if('BIO_VULGAR' in response.data && response.data.BIO_VULGAR.BIO_VULGAR ) {
					showSnackbar = "No explicit words allowed. Edit 'About Me'";
			  }
			  else if('BIO_PHONE' in response.data && response.data.BIO_PHONE.BIO_PHONE) {
					showSnackbar = "No phone numbers allowed. Edit 'About Me'";
			  }
			  else if('BIO_LINKS' in response.data && response.data.BIO_LINKS.BIO_LINKS) {
					showSnackbar = "No links allowed. Please Edit 'About Me'";
			  }
			  else if('USER_VULGAR' in response.data && response.data.USER_VULGAR.USER_VULGAR ) {
					showSnackbar = "No explicit words allowed. Edit 'Username'";
			  }
			  else if('USER_PHONE' in response.data && response.data.USER_PHONE.USER_PHONE) {
					showSnackbar = "No phone numbers allowed. Edit 'Username'";
			  }
			  else if('USER_LINKS' in response.data && response.data.USER_LINKS.USER_LINKS) {
					showSnackbar = "No links allowed. Please Edit 'Username'";
			  }
			  else if(response.data.all_data.result) {
					showSnackbar = "Changes saved";
			  }
			} else {
				showSnackbar = "Something went wrong! Please Try again later";
			}
			try {
				setTimeout(() => {
					window.close();
				}, 800)
			} catch (e) {
				console.log('timeout window close error on save: ', e);
			}
			return {...tempState, userAnswers, showSnackbar, isLoading: false}

		}
		break;
		case 'DELETE_USER_ANSWER': {
			console.log('DELETE_USER_ANSWER ', action.payload);
			return {...tempState, userAnswers: action.payload}
		}
		case 'HIDE_LOADER': {
			return { ...tempState, isLoading: false}
		}
		case 'SNACKBAR_MSG': {
			return { ...tempState, showSnackbar: action.payload}
		}
		case 'SET_LOCATION_TEXT': {
			return { ...tempState, locationInputText: action.payload}
		}

		default:
			return tempState;
	}
}
