import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik';
import { useLocation, useRoute } from 'wouter';

import { updateProduct, getProduct } from 'services/products.service';

import { Input } from './inputs';
import { validate } from './constants';
import Header from 'components/home/header.component';

const EditProduct = () => {
  const [ product, setProduct ] = useState({});

  const [ , setLocation ] = useLocation();

  const [ , { id } ] = useRoute("/products/:id");

  useEffect(() => {
    const fetchData = async () => {
      const ab = new AbortController();
      const productSnapshot = await getProduct(id);
      const productData = {
        ...productSnapshot.data(),
        id: productSnapshot.ref.id,
      };
      setProduct(productData);
      return () => ab.abort();
    }
    fetchData();
  }, [id]);

  const decrement = setFieldValue => {
    product.stock > 1 && product.stock--;
    setFieldValue('stock', product.stock)
    console.log(product.stock)
  }

  const increment = setFieldValue => {
    product.stock++;
    setFieldValue('stock', product.stock)
    console.log(product.stock)
  };

  const onSubmit = async values => {
    await updateProduct({ ...values, id: product.id })
    setLocation('/products');
  }

  return (
    <>
    <Header>
      <h1>Editar producto</h1>
    </Header>
    <div className="container form">
      <Formik 
        initialValues={{...product}}
        validate={validate}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {({ setFieldValue }) => (
          <Form>
            <Input name="name" label="Nombre:" type="text" />
            <Input name="productCode" label="Código:" type="text" />
            <Input name="price" label="Precio:" type="number" />
            <div className="qty-container">
              <span>Cantidad:</span>
              <button type="button" disabled={product.stock < 2} onClick={() => decrement(setFieldValue)}>-</button>
              <span>{product.stock}</span>
              <button type="button" onClick={() => increment(setFieldValue)}>+</button>
            </div>
            <p>Status:</p>
            <div role="group">
              <Input type="radio" label="Activo" name="status" value="active" />
              <Input type="radio" label="Deshabilitado" name="status" value="disabled" />
            </div>
            <button className="btn" type="submit">Guardar</button>
          </Form>
        )}
      </Formik>
    </div>
    </>
  )
};

export default EditProduct;
