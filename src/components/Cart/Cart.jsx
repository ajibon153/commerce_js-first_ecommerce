import React from 'react';
import { Container, Typography, Button, Grid } from '@material-ui/core';
import useStyle from './style';
import CartItem from './CartItem/CartItem';
import { Link } from 'react-router-dom';

const Cart = ({
  cart,
  handleUpdateCartQty,
  handleRemoveCart,
  handleEmptyCart,
}) => {
  const classes = useStyle();

  const isEmpty = !cart.line_items;
  console.log('cart.line_items', cart.line_items);
  // cart.line_items === undefined
  //   ? false
  //   : cart.line_items.length > 0
  //   ? true
  //   : false;

  const EmptyCart = () => (
    <Typography variant='subtitle1'>
      You have no items in your shopping list
      <Link to='/' className={classes.link}>
        Start Adding Some
      </Link>
    </Typography>
  );
  const FilledCart = () => (
    <>
      <Grid container spacing={3}>
        {cart.line_items.map((item) => (
          <>
            <Grid item xs={12} sm={4} key={item.id}>
              <CartItem
                item={item}
                handleUpdateCartQty={handleUpdateCartQty}
                handleRemoveCart={handleRemoveCart}
              />
            </Grid>
          </>
        ))}
        <div className={classes.cardDetails}>
          <Typography variant='h4'>
            Subtotal :{cart.subtotal.formatted_with_symbol}
          </Typography>
          <div>
            <Button
              className={classes.emptyButton}
              size='large'
              type='button'
              variant='contained'
              color='secondary'
              onClick={() => handleEmptyCart()}
            >
              Empty Cart
            </Button>
            <Button
              className={classes.checkoutButton}
              size='large'
              type='button'
              variant='contained'
              color='primary'
              component={Link}
              to='/checkout'
            >
              Checkout
            </Button>
          </div>
        </div>
      </Grid>
    </>
  );

  if (!cart.line_items) return <div>Loading</div>;
  return (
    <Container>
      <div className={classes.toolbar}>
        <Typography className={classes.title} variant='h3' gutterBottom>
          Your Shopping Cart
        </Typography>
        {isEmpty ? <EmptyCart /> : <FilledCart />}
      </div>
    </Container>
  );
};

export default Cart;
