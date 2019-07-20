export default function ng(state = {}, action) {

	const tempState = { ...state }

	switch(action.type) {
    case 'ADD_ITEMS':
		let {items} = action.payload;

		  return {...tempState, items};
		  
		  case 'ITEMS': {
			console.log('ITEMS payload= ', action.payload);
			let invalidAccess = false, items = null;
			// const { qData = {} } = action.payload;
			const { status = 0, data = {} } = action.payload;

			if(status >= 200 && status <= 300 && !action.payload.err) {
				items = data.items || [];
			} else {
				invalidAccess = true
			}
			return { ...tempState, items, isLoading: false, invalidAccess }
		}
    default:
			return tempState;
	}
}
