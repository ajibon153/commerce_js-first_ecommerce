import React, { useState, useEffect } from 'react';
import {
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  CircularProgress,
  Divider,
  Button,
  CssBaseline,
} from '@material-ui/core';
import useStyle from './style';
import AddressFrom from './AddresForm';
import PaymentForm from './PaymentForm';
import { commerce } from '../../lib/commerce';
import { Link, useHistory } from 'react-router-dom';

const steps = ['Shipping Addres', 'Payment Details'];

const Checkout = ({ cart, handleCaptureCheckout, order, error }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [checkoutToken, setCheckoutToken] = useState(null);
  const [shippingData, setShippingData] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const classes = useStyle();
  const history = useHistory();

  useEffect(() => {
    const genereteToken = async () => {
      try {
        const token = await commerce.checkout.generateToken(cart.id, {
          type: 'cart',
        });
        setCheckoutToken(token);
      } catch (error) {
        console.log(error);
        setTimeout(() => {
          // history.pushState('/');
          window.location = '/';
        }, 5000);
      }
    };
    genereteToken();
  }, [cart]);

  const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const next = (data) => {
    nextStep();
    setShippingData(data);
  };

  const timeout = () => {
    setTimeout(() => {
      setIsFinished(true);
    }, 3000);
  };

  const Form = () =>
    activeStep === 0 ? (
      <AddressFrom checkoutToken={checkoutToken} next={next} />
    ) : (
      <PaymentForm
        shippingData={shippingData}
        checkoutToken={checkoutToken}
        backStep={backStep}
        handleCaptureCheckout={handleCaptureCheckout}
        nextStep={nextStep}
        timeout={timeout}
      />
    );

  let Confirmation = () =>
    order.customer ? (
      <div>
        <Typography variant='h5'>
          Thank you for your purchase, {order.customer.firstname}{' '}
          {order.customer.lastname}
        </Typography>
        <Divider className={classes.divider} />
        <Typography variant='subtitle2'>
          Order ref : {order.customer_reference}}
        </Typography>
        <Button variant='outlined' component={Link} to='/' type='button'>
          Back to home
        </Button>
      </div>
    ) : (
      <div className={classes.spinner}>
        <CircularProgress />
      </div>
    );

  if (error) {
    return (
      <>
        <Typography variant='h5'>
          Error : {error}
          ( ini gara2 stripe payment gateway nya belum bener )
          <br />
          <Button component={Link} to='/' variant='outlined' type='button'>
            Back to home
          </Button>
        </Typography>
      </>
    );
  }

  return (
    <>
      <CssBaseline />
      <div className={classes.toolbar}>
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography variant='h5' align='center'>
              Checkout
            </Typography>
            <Stepper activeStep={0} className={classes.stepper}>
              {steps.map((step) => (
                <Step key={step}>
                  <StepLabel>{step}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length ? (
              <Confirmation />
            ) : (
              checkoutToken && <Form />
            )}
          </Paper>
        </main>
      </div>
    </>
  );
};

export default Checkout;
