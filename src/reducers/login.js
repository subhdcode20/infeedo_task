import {getLSItem, setLSItem} from '../utility'

export default function ng(state = {
	location: null,
	fcmToken: null
}, action) {

	const tempState = { ...state }

	switch(action.type) {

		case 'SAVE_LOGIN':
			let login = null, isLoggedIn = false
      if(action.payload != null || action.payload != undefined) {
        login = action.payload
				isLoggedIn = true
      }
      console.log('SAVE_LOGIN = ', login, isLoggedIn, action.payload);
			return { ...tempState, login, isLoggedIn }
			break;
		case 'SAVE_LOCATION':
			console.log('SAVE_LOCATION= ', action.payload);
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
      console.log('SAVE_LOCATION = ', location, action.payload);
			return { ...tempState, location, detectLocationName, locationLoading: false }
			break;
		case 'SAVE_FCM_TOKEN':
			console.log('SAVE_FCM_TOKEN = ', action.payload);
			let fcmToken = {}
      if(action.payload != null || action.payload != undefined) {
        fcmToken = action.payload
				console.log('set local fcmtoken ', fcmToken);
				// localStorage.setItem("NG_APP_SD_FCMTOKEN", JSON.stringify(fcmToken))
				setLSItem(`${LS_APP_PWA_FCMTOKEN}`, fcmToken)
      }
      console.log('SAVE_FCM_TOKEN = ', fcmToken, action.payload);
			return { ...tempState, fcmToken }
			break;
		case 'SAVE_ONBOARDING':
			console.log('SAVE_ONBOARDING= ', action.payload);
			let onboardingData= tempState.onboardingData ? tempState.onboardingData : {}
      onboardingData[action.payload.type] = action.payload.value
			console.log('new onboardingData= ', onboardingData);
			return { ...tempState, onboardingData }
		break;
		case 'SAVE_CHANNELID':
			console.log('SAVE_CHANNELID= ', action.payload);

			return { ...tempState, channelId: action.payload }
		break;
			// case 'ADD_BOT_DATA':
			// 	console.log('ADD_BOT_DATA= ', action.payload);
			// 	let newBotData = tempState.botData ? tempState.botData : []
			// 	newBotData.push(action.payload)
			// 	try {
			// 		if(newBotData.length > 100) {
			// 			let offset = Number(newBotData.length) - Number(100)
			// 			console.log('LS_APP_PWA_BOTDATA OFFSET ', offset);
			// 			newBotData.splice(0, offset);
			// 		}
			// 	} catch (e) {
			// 		console.log('LS_APP_PWA_BOTDATA OFFSET error: ', e);
			// 	}
			// 	//update state to localStorage
			// 	setLSItem(`${LS_APP_PWA_BOTDATA}`, newBotData)
			// 	// localStorage.setItem("NG_APP_SD_BOTDATA", JSON.stringify(newBotData))
			// 	return { ...tempState, botData: newBotData }
			// break;
			// case 'SET_BOT_DATA':
			// 	console.log('SET_BOT_DATA= ', action.payload);
			// 	return { ...tempState, botData: action.payload }
			// break;
			// case 'ADD_DISCOVER_CHILD_LISTENER':
			// 	const discoverChildListeners = tempState.discoverChildListeners ? [...tempState.discoverChildListeners] : [];
			// 	if(!discoverChildListeners.includes(action.payload)) discoverChildListeners.push(action.payload);
			// 	return { ...tempState, discoverChildListeners }
			// break;
			case 'SET_USER_AUTH':
				console.log('SET_USER_AUTH login ', action.payload);
				let data = action.payload
				if(data.status == 200 && data.data.result == true) {
					let authData = {
						auth1: data.data.auth1 ? data.data.auth1 : null,
						auth2: data.data.auth2 ? data.data.auth2 : null,
						auth3: data.data.auth3 ? data.data.auth3 : null,
					}
					console.log('final auth data ', authData);
					setLSItem(`${LS_AUTHID}`, authData)
				}
				return {...tempState}
			break;
			case 'FIREBASE_INITIALIZE':
				console.log('FIREBASE_INITIALIZE payload ', action.payload);
				return {...tempState, firebaseAppDefined: action.payload}
				break;
			case 'HIDE_NOTI_FORNOW':
				console.log('HIDE_NOTI_FORNOW ', action.payload);
				return {...tempState, hideNotiForNow: true}
			case 'INITIAL_TEXT':
				console.log('INITIAL_TEXT ', action.payload);
				const { status: qStatus = 0, data: textData } = action.payload;
				// let initialText
				if(qStatus >= 200 && qStatus <= 300 && textData) {
					let initialText = {}
					if (textData && textData.friendsText) initialText["friendsText"] = textData.friendsText
					if (textData && textData.settingsText) initialText["settingsText"] = textData.settingsText
					if (textData && textData.users) initialText["usersText"] = textData.users
					if (textData && textData.saveText) initialText["saveText"] = textData.saveText
					tempState["initialText"] = initialText
				}
				return {...tempState}
				break;

		default:
			return tempState;
	}
}
