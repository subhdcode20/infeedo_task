import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Header extends Component {

    render() {
        let {totalOrderCount} = this.props;
        return (<header>
            <div><Link to='/' style={{textDecoration: 'none'}}><span>GroceriesBuy</span></Link></div>
            <div>
                <Link to='/cart' style={{textDecoration: 'none'}}>
                    <Button variant="outlined" style={totalOrderCount > 0 ? {backgroundColor: 'green', color: 'white'} : {} }>
                        Cart{totalOrderCount > 0 && (<span> {totalOrderCount}</span>)}
                    </Button>
                </Link>
                &nbsp; 
                <Link to='/orderHistory' style={{textDecoration: 'none'}}><Button variant="outlined" >My Orders</Button></Link>
            </div>

        </header>)
    }
}

const mapStateToProps = state => {
	console.log('mapStateToProps chat ', state);
	return {
		totalOrderCount: state.task.totalOrderCount 
	}
}


export default connect(mapStateToProps, null)(Header);