import axios from 'axios';

export const getItems = (channelid) => {
    return {
        type: 'ITEMS',
        payload: axios({
            url: 'http://demo2847571.mockable.io/items',
        }).then(res => { return res }).catch(err => ({ err }))
    }
}

export const updateOrderItems = ({item, qnt}) => {
    return {
        type:'UPDATE_ORDER',
        payload: {
            item,
            qnt
        }
    }
}

export const setConfirmedOrders = () => {
    return {
        type: 'SET_CONFIRMED_ORDERS'
    }
}

export const confirmOrder = () => {
    return {
        type: 'CONFIRM_ORDER'
    }
}

export const filterItems = (type) => {
    return {
        type: 'FILTER_ITEMS',
        payload: type
    }
}

export const searchItems = (val) => {
    console.log('serachItems action ', val)
    return {
        type: 'SEARCH_ITEMS',
        payload: val
    }
}