import React from 'react';
import { Grid } from '@material-ui/core';
import Product from './Product/Product';
import useStyle from './style';

const Products = ({ products, handleAddCart }) => {
  const classes = useStyle();

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <Grid container justify='flex-start' spacing={4}>
        {products.length > 0 ? (
          <>
            {products.map((product, i) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                <Product product={product} handleAddCart={handleAddCart} />
              </Grid>
            ))}
          </>
        ) : (
          'Loading...'
        )}
      </Grid>
    </main>
  );
};
export default Products;
