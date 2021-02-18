import './App.css';
import React from 'react';
import { commerce } from './lib/commerce';
import { Products, Navbar, Cart, Checkout } from './components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  const [products, setProducts] = React.useState([]);
  const [cart, setCart] = React.useState([]);
  const [order, setOrder] = React.useState([]);
  const [errorMessage, setErrorMessage] = React.useState('');

  const fetchProduct = async () => {
    const { data } = await commerce.products.list();
    setProducts(data);
  };
  const fetchCart = async () => {
    const newCart = await commerce.cart.retrieve();
    setCart(newCart);
  };

  const handleAddCart = async (productId, quantity) => {
    const item = await commerce.cart.add(productId, quantity);
    setCart(item.cart);
  };

  const handleUpdateCartQty = async (productId, quantity) => {
    const { cart } = await commerce.cart.update(productId, { quantity });

    setCart(cart);
  };
  const handleRemoveCart = async (productId) => {
    console.log('handleRemoveCart', productId);
    const res = await commerce.cart.remove(productId);
    console.log('handleRemoveCart2', res);
    setCart(res);
  };
  const handleEmptyCart = async () => {
    const { cart } = await commerce.cart.empty();
    setCart(cart);
  };

  const refreshCart = async () => {
    const newCart = await commerce.cart.refresh();
    setCart(newCart);
  };

  const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
    console.log('newOrder', newOrder);
    try {
      const incomingOrder = await commerce.checkout.capture(
        checkoutTokenId,
        newOrder
      );
      console.log('incomingOrder', incomingOrder);
      setOrder(incomingOrder);
      refreshCart();
    } catch (error) {
      console.log('error', error);
      setErrorMessage(error.data.error.message);
    }
  };

  React.useEffect(() => {
    fetchProduct();
    fetchCart();
  }, []);

  return (
    <Router>
      <div className='App'>
        <Navbar totalItems={cart.total_items} />
        <Switch>
          <Route exact path='/'>
            <Products products={products} handleAddCart={handleAddCart} />
          </Route>
          <Route exact path='/cart'>
            <Cart
              cart={cart}
              handleUpdateCartQty={handleUpdateCartQty}
              handleRemoveCart={handleRemoveCart}
              handleEmptyCart={handleEmptyCart}
            />
          </Route>
          <Route exact path='/checkout'>
            <Checkout
              cart={cart}
              handleCaptureCheckout={handleCaptureCheckout}
              order={order}
              error={errorMessage}
            />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
