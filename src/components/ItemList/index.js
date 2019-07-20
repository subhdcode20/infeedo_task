import React, {Component} from 'react';

class ItemsList extends Component {
  state = {
    items = []
  }

  componentDidMount() {
    axios.get('http://demo2847571.mockable.io/items')
    .then(res => {
      console.log('got items = ', res, res.success);
      if(res.success) {
        this.setState(items: res.items)
      }
    })
  }

  render() {
    let {items} = this.state;
    return (<div>
      {
        items.map((item, index) => (<h1>{item.name}</h1>))
      }
    </div>)
  }

}

export default ItemsList
