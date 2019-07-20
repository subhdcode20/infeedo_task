export default function ng(state = {}, action) {

	const tempState = { ...state }

	switch(action.type) {
    case 'ADD_BOT_DATA':
      return tempState;
    default:
			return tempState;
	}
}
