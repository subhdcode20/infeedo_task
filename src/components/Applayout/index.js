import React, {Component} from 'react';
import Button from '@material-ui/core/Button';

import Routes from '../../routes/routes.js';
import Header from './header';
import Styles from './styles.css'

function AppLayout({children}) {
  return <div>
    <Header />
    {children}
  </div>
}

export default AppLayout
