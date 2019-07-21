import React, {Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Styles from './styles.css';
import {getItems, updateOrderItems} from '../../actions/task';
import Item from './item';
import { runInThisContext } from 'vm';

const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    // ⚠️ object-fit is not supported by IE11.
    objectFit: 'cover',
  },
};


class ItemsList extends Component {
  state = {
    items: []
  }

  componentDidMount() {
    // this.props.getItems()
  }

  updateOrder = ({item, qnt}) => {
    this.props.updateOrderItems({item, qnt})
  }

  render() {
    let {items = [], classes} = this.props;
    return (<div className={Styles.itemsGridWrapper}>
      {
        items.map((item, index) => <Item item={item} updateOrder={this.updateOrder}/>)
      }
    </div>)
  }

}

const mapStateToProps = state => {
	console.log('mapStateToProps chat ', state);
	return {
		items: state.task.items 
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getItems: (id, msg) => {
			dispatch(getItems(id, msg));
    },
    updateOrderItems: (item, qnt) => {
			dispatch(updateOrderItems(item, qnt));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ItemsList));
