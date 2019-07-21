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
    console.log('updateOrdeItems ', item, qnt );
    
    return {
        type:'UPDATE_ORDER',
        payload: {
            item,
            qnt
        }
    }
}

export const confirmOrder = () => {
    return {
        type: 'CONFIRM_ORDER'
    }
}