export default function ng(state = {
	items: [] 
}, action) {

	const tempState = { ...state }

	switch(action.type) {
		case 'ADD_ITEMS':{
			let {items} = action.payload;

			return {...tempState, items};
		}
		case 'ITEMS': {
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
		
		case 'UPDATE_ORDER': {
			let {item, qnt} = action.payload;
			let {order = {}, totalOrderCount = 0, } = state;
			let {items = [], totalOrderAmount = 0} = order;
			let totalItemPrice = 0;
			let fonundItem = items.findIndex((elem) => elem.item.id == item.id)
			
			if(fonundItem > -1) {
				if(qnt <= 0) {
					totalItemPrice -= items[fonundItem].totalItemPrice;
					items.splice(fonundItem, 1);
					totalOrderCount -= 1;

				} else {
					totalOrderCount -= items[fonundItem].qnt;
					totalOrderAmount -= Number(items[fonundItem].totalItemPrice);
					totalOrderCount += qnt;
					totalItemPrice += Number(items[fonundItem].item.price * qnt);
					totalOrderAmount += totalItemPrice;

					items[fonundItem].qnt = qnt;
					items[fonundItem].totalItemPrice = totalItemPrice;
				}
			} else {
				totalItemPrice += Number(item.price * qnt);
				items.push({item, qnt, totalItemPrice});
				totalOrderCount += qnt;
				totalOrderAmount += totalItemPrice
			}
			order.totalOrderAmount = totalOrderAmount;
			order.items = items;
			return {...tempState, order, totalOrderCount}
		}
		case 'CONFIRM_ORDER': {
			let {confirmedOrders = [], order: currentOrder} = state;
			
			if(currentOrder) {
				confirmedOrders.splice(0, 0, currentOrder);
				try {
					if (typeof confirmedOrders === 'object') {
						localStorage.setItem('_CONFIRMED_ORDERS_', JSON.stringify(confirmedOrders));
					}
				
				} catch (e) {
					console.log('set ls error: ', e)
				}

				return {...tempState, confirmedOrders, order: {}, totalOrderCount: 0}
			} else return tempState;
		}
		case 'SET_CONFIRMED_ORDERS': {
			let value = localStorage.getItem('_CONFIRMED_ORDERS_');
			if (typeof value !== 'object') {
				try {
					value = JSON.parse(value);
				} catch (e) {
					console.log('**** parse error getItem= ', e, value);
				}
			}
			return {...tempState, confirmedOrders: value || []}
		}
		case 'SEARCH_ITEMS': {
			let val = action.payload;
			let {searchResults= [], items} = state;
			if(val == null) searchResults = [];
			else 
				searchResults = items.filter(item => item.name.toLowerCase().includes(val.toLowerCase()));
			return {...tempState, searchResults}
		}
		case 'FILTER_ITEMS': {
			let type = action.payload;
			let {filteredResults = [], items} = state;
			if(type == '_price_high_low_') {
				filteredResults = items.sort(function(a, b) {
					return b.price - a.price;
				});
			} else if(type == '_price_low_high_') {
				filteredResults = items.sort(function(a, b) {
					return a.price - b.price;
				});
			} else if(type == '_rating_low_high_') {
				filteredResults = items.sort(function(a, b) {
					return Number(a.rating) - Number(b.rating);
				});
			} else if(type == '_rating_high_low_') {
				filteredResults = items.sort(function(a, b) {
					return Number(b.rating) - Number(a.rating);
				});
			} else if(type == 'burger') {
				filteredResults = items.filter(item => item.category.toLowerCase().includes(type.toLowerCase()))
			} else if(type == 'pizza') {
				filteredResults = items.filter(item => item.category.toLowerCase().includes(type.toLowerCase()))
			}
			return {...tempState, filteredResults}
		}
		default:
			return tempState;
	}
}
