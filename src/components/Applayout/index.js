import React, {Component} from 'react';
import Button from '@material-ui/core/Button';

import ItemsList from '../ItemList';
import Header from './header';
import Styles from './styles.css'

function AppLayout () {
  return <div>
    <Header />
    <ItemsList />
  </div>
}

export default AppLayout
