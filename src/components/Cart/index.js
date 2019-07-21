import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router'
import Button from '@material-ui/core/Button';

import {confirmOrder} from '../../actions/task';
import Header from '../Applayout/header';
import Styles from './styles.css';

class Cart extends Component {
    state = {
        orderConfirmed: false
    }
    
    handleConfirmOrder = () => {
        this.setState({orderConfirmed: true});
        this.props.confirmOrder();
    }

    render() {
        let {order, invalidAccess} = this.props;
        let {orderConfirmed} = this.state;
        let {items = []} = order;
        console.log('order in cart: ', order)
        if(invalidAccess) return (<Redirect to='/' />);

        if(orderConfirmed) {
            return (<div>
                <h1>Your order will be delivered in x minutes</h1>
            </div>)
        }

        return (<div>
            <Header />
            <div className={Styles.cardItemsWrapper}>
                {
                    items.length > 0 ?
                    (<div>
                        {
                            items.map((elem, index) => (
                                <div className={Styles.cartItem}>
                                    <div>{elem.item.name}</div>
                                    <div>{elem.qnt}</div>
                                    <div>{elem.item.currency}{elem.totalItemPrice}</div>
                                </div>
                            ))
                        }
                        <div style={{textAlign: 'right'}}> 
                            <h3>To Pay: Rs {order.totalOrderAmount}</h3>
                        </div>
                    </div>)
                    :
                    (<div>
                        <h2>Your cart is empty!</h2>
                        <br />
                        <Button variant="outlined">
                            <Link to='/' style={{textDecoration: 'none'}}>Home</Link>
                        </Button>
                    </div>)
                }
            </div>
            <Button size="small" color="primary" onClick={this.handleConfirmOrder}>
                Confirm order
            </Button>
        </div>)
    }
}

const mapStateToProps = state => {
	console.log('mapStateToProps cart ', state);
	return {
        totalOrderCount: state.task.totalOrderCount,
        order: state.task.order || [],
        invalidAccess: state.task.order == undefined
	}
}

const mapDispatchToProps = dispatch => {
	return {
		confirmOrder: () => {
            dispatch(confirmOrder());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);