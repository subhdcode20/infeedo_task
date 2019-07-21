export default function ng(state = {
	items: [{"name":"Big Mac Burger","price":12,"currency":"Rs","rating":"4.0'","category":"burger","id":1,"img":"https://www.burger21.com/wp-content/uploads/2018/05/Bacon-Cheesy-1.jpg","ingredients":"This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like."},{"name":"Cheese Sandwhich","price":10,"currency":"Rs","rating":"4.0'","category":"sandwhich","id":2,"img":"https://www.burger21.com/wp-content/uploads/2018/05/Bacon-Cheesy-1.jpg","ingredients":"This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like."},{"name":"Big Mac Burger","price":42,"currency":"Rs","rating":"2.6'","category":"burger","id":3,"img":"https://www.burger21.com/wp-content/uploads/2018/05/Bacon-Cheesy-1.jpg","ingredients":"This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like."},{"name":"Big Mac Burger","price":30,"currency":"Rs","rating":"4.3'","category":"burger","id":4,"img":"https://www.burger21.com/wp-content/uploads/2018/05/Bacon-Cheesy-1.jpg","ingredients":"This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like."},{"name":"Big Mac Burger","price":12,"currency":"Rs","rating":"3.0'","category":"burger","id":5,"img":"https://www.burger21.com/wp-content/uploads/2018/05/Bacon-Cheesy-1.jpg","ingredients":"This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like."}]
}, action) {

	const tempState = { ...state }

	switch(action.type) {
    case 'ADD_ITEMS':{
		let {items} = action.payload;

		return {...tempState, items};
	}
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
	
	case 'UPDATE_ORDER': {
		let {item, qnt} = action.payload;
		let {order = {}, totalOrderCount = 0, } = state;
		let {items = [], totalOrderAmount = 0} = order;
		let totalItemPrice = 0;
		console.log('UPDATE ORDER ', action.payload, order)
		let fonundItem = items.findIndex((elem) => elem.item.id == item.id)
		
		if(fonundItem > -1) {
			// totalItemPrice = order[fonundItem].totalItemPrice;
			console.log('item found ', items[fonundItem], qnt);
			if(qnt <= 0) {
				// totalItemPrice -= Number(order[fonundItem].item.price * order[fonundItem].qnt);
				totalItemPrice -= items[fonundItem].totalItemPrice;
				items.splice(fonundItem, 1);
				totalOrderCount -= 1;

			} else {
				console.log('totalOrderCount - ', totalOrderCount, items[fonundItem].qnt, qnt)
				totalOrderCount -= items[fonundItem].qnt;
				totalOrderAmount -= Number(items[fonundItem].totalItemPrice);
				totalOrderCount += qnt;
				totalItemPrice += Number(items[fonundItem].item.price * qnt);
				totalOrderAmount += totalItemPrice;

				items[fonundItem].qnt = qnt;
				items[fonundItem].totalItemPrice = totalItemPrice;
				console.log('totalOrderCount222 - ', totalOrderCount )
			}
		} else {
			console.log('item NOT found ');
			totalItemPrice += Number(item.price * qnt);
			items.push({item, qnt, totalItemPrice});
			totalOrderCount += qnt;
			totalOrderAmount += totalItemPrice
		}
		order.totalOrderAmount = totalOrderAmount;
		order.items = items;
		console.log('UPDATEd --ORDER ', order)
		return {...tempState, order, totalOrderCount}
	}
	case 'CONFIRM_ORDER': {
		// let {orderIndex = null} = action.payload;
		let {confirmedOrders = [], order: currentOrder} = state;
		
		if(currentOrder) {
			// let currentOrder = order[orderIndex];
			// order.splice(orderIndex, 1);
			confirmedOrders.splice(0, 0, currentOrder);
			return {...tempState, confirmedOrders}
		} else return tempState;
	}
    default:
			return tempState;
	}
}
