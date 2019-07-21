import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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

    handleDailogueClose = () => {
        this.setState({ orderConfirmed: false });
    };

    render() {
        let {order} = this.props;
        let {orderConfirmed} = this.state;
        let {items = []} = order;

        let confirmendDailogue = (<Dialog
            open={this.state.orderConfirmed}
            onClose={this.handleDailogueClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Thank you for choosing us!</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Your order will be delivered in x minutes
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleDailogueClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>)

        return (<div>
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
                        <center>
                            <Button size="small" color="primary" onClick={this.handleConfirmOrder}>Confirm order</Button>
                        </center> 
                    </div>)
                    :
                    (<div>
                        <h2>Your cart is empty!</h2>
                    </div>)
                }
            </div>
            
            {confirmendDailogue}
        </div>)
    }
}

const mapStateToProps = state => {
	return {
        totalOrderCount: state.task.totalOrderCount,
        order: state.task.order || []
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