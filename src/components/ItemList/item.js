import React, {Component, useState, useEffect} from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';

import Styles from './styles.css';

const styles = {
    card: {
      maxWidth: 400,
      margin: 'auto'
    },
    media: {
      objectFit: 'cover',
    },
  };

function Item({item, classes, updateOrder}) {
    const [showAdder, setShowAdder] = useState(false);
    const [itemAddedQnt, setItemAddedQnt] = useState(0);

    useEffect(() => {
        if(itemAddedQnt <= 0) {
            setShowAdder(false)
        }
    }, [itemAddedQnt])

    const handleAddItem = () => {
        setItemAddedQnt(itemAddedQnt + 1);
        // updateOrderItems({item, qnt: itemAddedQnt})
        updateOrder({item, qnt: itemAddedQnt + 1});
    }

    const handleRemoveItem = () => {
        setItemAddedQnt(itemAddedQnt - 1);
        // updateOrderItems({item, qnt: itemAddedQnt})
        updateOrder({item, qnt: itemAddedQnt - 1});
    }

    const handleAddClick = () => {
      setShowAdder(true);
      handleAddItem();
    }

    return (<Card className={classes.card}>
        <CardMedia
          component="img"
          className={classes.media}
          height="140"
          image={item.img}
          title={item.name}
        />
        <CardContent>
          <Typography gutterBottom variant="headline" component="h2">
            {item.name}
          </Typography>
          <Typography component="p">
            {item.ingredients}
          </Typography>
          <Typography component="p">
            {item.rating}⭐  -  {item.currency} {item.price}
          </Typography>
        </CardContent>
        <CardActions>
          {
            showAdder ?
            (<div>
                <IconButton className={classes.button} aria-label="Add" onClick={handleAddItem}><Add /></IconButton>
                <span style={{margin: '5px 10px'}}>{itemAddedQnt}</span>
                <IconButton className={classes.button} aria-label="Remove" onClick={handleRemoveItem}><Remove /></IconButton>
            </div>)
            :  
              (<Button size="small" color="primary" onClick={handleAddClick}>
            Add
          </Button>)}
        </CardActions>
      </Card>)
}

export default withStyles(styles)(Item);