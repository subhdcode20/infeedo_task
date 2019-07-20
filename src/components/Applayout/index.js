import React, {Component} from 'react';
import Button from '@material-ui/core/Button';

import ItemsList from '../ItemList';

function AppLayout () {
  return <div>
    <header>
      <span>GroceriesBuy</span>
      <Button variant="outlined" >
      Cart
      </Button>
      <Button variant="outlined" >
      My Orders
      </Button>
    </header>
    <ItemsList />
  </div>
}

export default AppLayout
