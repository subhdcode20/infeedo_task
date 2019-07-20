import {getLSItem, setLSItem, preLoadImage} from '../utility'

export default function ng(state = [], action) {

	const tempState = { ...state }

	switch(action.type) {
		case 'GET_FEEDS': {
      console.log('GET_FEEDS payload= ', action.payload);
			let invalidAccess = false;
			const { response: qData = {} } = action.payload;
			const { status: qStatus = 0, data = {} } = qData;
      const { feedData: feeds = [], success = true} = data
			console.log('data in questions reducer ', feeds, status);
			// const questions = data.questions;
			// console.log('final questions ', questions);

			if(qStatus >= 200 && qStatus <= 300 && success != false && !action.payload.err) {
				tempState.feeds = feeds || []

				// const channelId = questions.channelId;
				// console.log('channelId from questions ', channelId);
				// // if(channelId) setLSItem(`${LS_URL_CHANNELID}`, channelId)
				// if(channelId) setLSItem(`${LS_CHANNELID}`, channelId)
			} else {
				invalidAccess = true
				tempState.invalidAccessCode = 'GET_FEEDS_ERROR'
			}
			return { ...tempState, isLoading: false, invalidAccess }
		}
		case 'GET_MORE_FEEDS': {
      console.log('GET_MORE_FEEDS payload= ', action.payload);
			let invalidAccess = false;
			const { response: qData = {} } = action.payload;
			const { status: qStatus = 0, data = {} } = qData;
      const { feedData: feeds = [], success = true} = data
			let {feeds: oldFeeds = []} = tempState
			console.log('data in questions reducer ', feeds, status);
			// const questions = data.questions;
			// console.log('final questions ', questions);

			if(qStatus >= 200 && qStatus <= 300 && success != false && !action.payload.err) {
				feeds.forEach((item, index) => oldFeeds.push(item))

				// const channelId = questions.channelId;
				// console.log('channelId from questions ', channelId);
				// // if(channelId) setLSItem(`${LS_URL_CHANNELID}`, channelId)
				// if(channelId) setLSItem(`${LS_CHANNELID}`, channelId)
			} else {
				invalidAccess = true
				tempState.invalidAccessCode = 'GET_FEEDS_ERROR'
			}
			return { ...tempState, feeds: oldFeeds, isLoading: false, invalidAccess }
		}
    default:
      return tempState;
  }
}
