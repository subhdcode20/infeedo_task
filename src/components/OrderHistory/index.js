import React, {Component} from 'react';
import { connect } from 'react-redux';

class OrderHistory extends Component {
    render() {
        console.log('OrderHistory ', confirmedOrders);
        let {confirmedOrders} = this.props;
        return (<div>
            <h1 style={{color: 'red'}}>hahahahaahah</h1> 
    
        </div>)
    }
}

const mapStateToProps = state => {
	console.log('mapStateToProps OrderHistory ', state);
	return {
        confirmedOrders: state.task.confirmedOrders
	}
}

export default connect(mapStateToProps, null)(OrderHistory);