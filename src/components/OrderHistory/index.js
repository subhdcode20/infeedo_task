import React, {Component} from 'react';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import Header from '../Applayout/header';
import Styles from './styles.css';

const styles = {
    card: {
        minWidth: 400,
    },
}


class OrderHistory extends Component {
    render() {
        let {confirmedOrders, classes} = this.props;
        return (<div className={Styles.orderHistoryWrapper}>
            {
                confirmedOrders.length > 0 ?
                (<div>
                    <h1>Transaction History:</h1>
                    {
                        confirmedOrders.map(elem => (<Card className={classes.card}>
                            <CardContent>
                            <Typography className={classes.title} color="textSecondary">
                                Order id: {elem.id || 'SET ORDER ID'}
                            </Typography>
                            <div>
                                {
                                    elem.items.map(item => (<div className={Styles.cartItem}>
                                        <div>{item.item.name}</div>
                                        <div>{item.qnt}</div>
                                        <div>{item.item.currency}{item.totalItemPrice}</div>
                                    </div>))
                                }
                            </div>
                            <div style={{textAlign: 'center'}}>
                                Total Amount: {elem.totalOrderAmount}
                            </div>
                            </CardContent>
                        </Card>))
                    }
                </div>)
                :
                (<div>
                    <h2>You haven't ordered anything yet!</h2>
                    <Link to='/' style={{textDecoration: 'none'}}><Button size="small" color="primary">Select items to order</Button></Link>
                </div>)
            }
        </div>)
    }
}

const mapStateToProps = state => {
	return {
        confirmedOrders: state.task.confirmedOrders || []
	}
}

export default connect(mapStateToProps, null)(withStyles(styles)(OrderHistory));