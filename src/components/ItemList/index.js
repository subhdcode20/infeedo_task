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
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';

import Styles from './styles.css';
import {getItems, updateOrderItems, filterItems, searchItems, setConfirmedOrders} from '../../actions/task';
import Item from './item';
import { runInThisContext } from 'vm';

const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    objectFit: 'cover',
  },
};


class ItemsList extends Component {
  state = {
    search: '',
    anchorEl: null,
    showSearchResults: false,
    filterOptions: [
      {type:'_price_high_low_',name: "Price: High - Low"},
      {type:'_price_low_high_',name: "Price: Low - High"},
      {type:'_rating_high_low_',name: "Rating: High - Low"},
      {type:'_rating_low_high_',name: "Rating: Low - High"},
      {type:'burger',name: "Burger"},
      {type:'pizza',name: "Pizza"}
    ],
    filterSelected: ''
  }

  componentDidMount() {
    this.props.getItems();
    this.props.setConfirmedOrders();
  }

  updateOrder = ({item, qnt}) => {
    this.props.updateOrderItems({item, qnt})
  }

  handleSearchChange = (e) => {
    let val = e.target.value
    if(val == '') {
      this.setState({search: val, showSearchResults: false});
      this.props.searchItems(null);
    }
    else {
      this.setState({search: val, showSearchResults: true});
      this.props.searchItems(val);
    }
  }

  handleOpenFilter = event => {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleCloseFilter = event => {
    this.setState({ anchorEl: null });
  }

  handleFilterSelect = type => {
    this.setState({filterSelected: type})
    this.props.filterItems(type);
  }

  render() {
    let {items = [], classes, searchResults} = this.props;
    let {search, anchorEl, showSearchResults, filterOptions, filterSelected} = this.state

    if(showSearchResults) items = searchResults;
    console.log('itemlist render ', items, showSearchResults, searchResults)
    return (<div>
      <div className={Styles.searchWrapper}>
        <div>
          <Input
            placeholder="Placeholder"
            fullWidth
            className={classes.input}
            value={search}
            onChange={this.handleSearchChange}
          />
        </div>
        <div>
          <Button
            aria-owns={anchorEl ? 'simple-menu' : null}
            aria-haspopup="true"
            onClick={this.handleOpenFilter}
          >
            Filter
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleCloseFilter}
          >
            {
              filterOptions.map((option, index) => (<MenuItem onClick={this.handleCloseFilter}>
                <ListItem
                  role={undefined}
                  dense
                  button
                  onClick={() => this.handleFilterSelect(option.type)}
                  className={classes.listItem}
                >
                  <Checkbox
                    checked={filterSelected == option.type}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText primary={option.name} />
                </ListItem>
              </MenuItem>))
            }
          </Menu>
        </div>
      </div>
      <div className={Styles.itemsGridWrapper}>
      {
        items.map((item, index) => <Item item={item} updateOrder={this.updateOrder}/>)
      }
      </div>
    </div>)
  }

}

const mapStateToProps = state => {
	console.log('mapStateToProps chat ', state);
	return {
    items: state.task.items,
    searchResults: state.task.searchResults
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getItems: (id, msg) => {
			dispatch(getItems(id, msg));
    },
    updateOrderItems: (item, qnt) => {
			dispatch(updateOrderItems(item, qnt));
    },
    filterItems: (type) => {
      dispatch(filterItems(type));
    },
    searchItems: (val) => {
      dispatch(searchItems(val));
    },
    setConfirmedOrders: () => {
      dispatch(setConfirmedOrders());
    }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ItemsList));
