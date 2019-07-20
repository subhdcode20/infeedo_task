import {getLSItem, setLSItem} from '../utility'

export default function ng(state = {}, action) {

	const tempState = { ...state }

	switch(action.type) {
			case 'ADD_BOT_DATA':
				console.log('ADD_BOT_DATA= ', action.payload);
				let newBotData = tempState.botData ? tempState.botData : []
				newBotData.push(action.payload)
				try {
					if(newBotData.length > 100) {
						let offset = Number(newBotData.length) - Number(100)
						console.log('LS_APP_PWA_BOTDATA OFFSET ', offset);
						newBotData.splice(0, offset);
					}
				} catch (e) {
					console.log('LS_APP_PWA_BOTDATA OFFSET error: ', e);
				}
				//update state to localStorage
				setLSItem(`${LS_APP_PWA_BOTDATA}`, newBotData)
				// localStorage.setItem("NG_APP_SD_BOTDATA", JSON.stringify(newBotData))
				return { ...tempState, botData: newBotData }
			break;
			case 'SET_BOT_DATA':
				console.log('SET_BOT_DATA= ', action.payload);
				return { ...tempState, botData: action.payload }
			break;
			case 'ADD_DISCOVER_CHILD_LISTENER':
				const discoverChildListeners = tempState.discoverChildListeners ? [...tempState.discoverChildListeners] : [];
				if(!discoverChildListeners.includes(action.payload)) discoverChildListeners.push(action.payload);
				return { ...tempState, discoverChildListeners }
			break;
		default:
			return tempState;
	}
}
