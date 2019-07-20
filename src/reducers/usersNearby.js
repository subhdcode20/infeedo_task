import {getLSItem, setLSItem} from '../utility'

export default function ng(state = [], action) {

	const tempState = { ...state }

	switch(action.type) {
		case 'SHOW_LOADER': {
			return { ...tempState, isLoading: true }
		}
		case 'NEARBY_CHANNELIDS' : {
			console.log('NEARBY_CHANNELIDS ', action.payload);
			// const { questions: qData = {}, answers: aData = {} } = action.payload;
			const { status, data } = action.payload;
      // const { status: aStatus = 0, data: answers = {} } = aData;
			let invalidAccess = false
			let counter = tempState.counter ? tempState.counter : 0
			// && !action.payload.err
			if(
				status >= 200 && status <=300
			) {
				console.log('nearbyChannelids data ok ', data.channelIds);
				tempState.nearbyChannelids = data.channelIds || []
				tempState.titleText = data.title || null
				tempState.buttonText = data.text || null

				if(data.selfChannelId) {
					setLSItem(`${LS_CHANNELID}`, data.selfChannelId)
				}
			} else {
				invalidAccess = true
			}
			console.log('NEARBY_CHANNELIDS final nearbyChannelids ', tempState.nearbyChannelids);
			return { ...tempState, isLoading: false, invalidAccess, counter: ++counter }
		}
		case 'NEARBY_USER_DETAILS': {
			console.log('NEARBY_USER_DETAILS payload= ', action.payload);
			let invalidAccess = false;
      const { response, channelid: id = '' } = action.payload;
			const { status, data } = response;
			let counter = tempState.counter ? tempState.counter : 0
			if( status >= 200 && status <= 300 && !action.payload.err && data && Object.keys(data)) {
        // userDetail = data || {}
        console.log('added NEARBY_USER_DETAILS ', data, tempState.nearbyUserDetails);
				if(tempState.nearbyUserDetails == undefined || tempState.nearbyUserDetails == null) tempState.nearbyUserDetails =  {}
				tempState.nearbyUserDetails[id] = data
				try {
					if(data.imageUrl.length > 0) fetch(data.imageUrl[0])
				} catch (e) {}
				console.log('after added NEARBY_USER_DETAILS', tempState.nearbyUserDetails);
			} else {
				invalidAccess = true
			}
			return { ...tempState, isLoading: false, invalidAccess, counter: ++counter }
		}

		case 'PROFILE_USER_DETAILS': {
			console.log('PROFILE_USER_DETAILS payload= ', action.payload);
			let invalidAccess = false;
      const { response, channelid: id = '' } = action.payload;
			const { status, data } = response;
			let counter = tempState.counter ? tempState.counter : 0
			if( status >= 200 && status <= 300 && !action.payload.err && data && Object.keys(data)) {
				tempState.profileUserDetails = data
				console.log('after added PROFILE_USER_DETAILS', tempState.profileUserDetails);
			} else {
				invalidAccess = true
			}
			return { ...tempState, isLoading: false, invalidAccess, counter: ++counter }
		}

		case 'HIDE_LOADER': {
			return { ...tempState, isLoading: false}
		}
		case 'SNACKBAR_MSG': {
			return { ...tempState, showSnackbar: action.payload}
		}

		default:
			return tempState;
	}
}
