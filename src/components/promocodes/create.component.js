import React from 'react';
import { Form, Formik } from 'formik';
import { useLocation } from 'wouter';

import Header from 'components/home/header.component';
import { Input } from 'components/products/inputs';

import { addPromoCode } from 'services/promocodes.service';
import { initialValuesPromoCode, validatePromoCode } from 'components/products/constants';

const CreatePromoCode = () => {
  const [ , setLocation ] = useLocation();

  const onSubmit = async values => {
    console.log(values)
    await addPromoCode(values);
    setLocation('/codes')
  }

  return (
    <>
      <Header>
        <h1>Crear código promocional</h1>
      </Header>
      <div className="container form">
        <Formik
          initialValues={initialValuesPromoCode}
          onSubmit={onSubmit}
          validate={validatePromoCode}
          >
          {
            () => (
              <Form>
                <Input label="Código" type="text" className="uppercase" name="promoCode" />
                <Input label="Descuento" type="number" name="discount" />
                <button type="submit" className="btn">Agregar</button>
              </Form>
            )
          }
        </Formik>
      </div>
    </>
  )
}

export default CreatePromoCode;
