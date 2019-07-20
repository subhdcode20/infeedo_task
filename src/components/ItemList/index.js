import React, {Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {getItems} from '../../actions/task';

class ItemsList extends Component {
  state = {
    items: []
  }

  componentDidMount() {
    // axios.get('http://demo2847571.mockable.io/items')
    // .then(res => {
    //   console.log('got items = ', res, res.success);
    //   if(res.data.success) {
    //     this.setState({items: res.data.items})
    //   }
    // })
    this.props.getItems()
  }

  render() {
    let {items = []} = this.props;
    return (<div>
      {
        items.map((item, index) => (<h1>{item.name}</h1>))
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
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemsList);
