import React, { useState } from 'react'
import { Formik, Form } from 'formik';
import { useLocation } from 'wouter';

import uploadFile from 'services/uploadFile';
import { addProduct } from 'services/products.service';

import { Input, FileInput } from './inputs';
import { initialValuesProduct, validate } from './constants';
import Header from 'components/home/header.component';

import './products.scss';

const handleUpload = async (file, setFieldValue, submit) => {
  const task = await uploadFile(file);
  const url = await task.ref.getDownloadURL();
  setFieldValue('photoUrl', url);
  submit()
}

const checkFields = async (validateForm, setShowSubmit, setTouched) => {
  setTouched({name: true, price: true})
  const errors = await validateForm()
  if (!errors.name && !errors.price) setShowSubmit(true);
}


const CreateProduct = () => {
  const [ showInputImage, setShowInputImage ] = useState(false);
  
  const [ , setLocation ] = useLocation();
  
  const onSubmit = product => {
    addProduct(product).then(() => setLocation('/home'));
  };

  return (
    <>
    <Header>
      <h1>Alta de producto</h1>
    </Header>
    <div className="container form">
      <Formik 
        initialValues={initialValuesProduct}
        onSubmit={onSubmit}
        validate={validate}
      >
        {
          ({ setFieldValue, submitForm, validateForm, isValid, setTouched }) => (
            <Form>
              <Input name="name" label="Nombre:" type="text" />
              <Input name="productCode" label="Código:" type="text" />
              <Input name="price" label="Precio:" type="number" />
              { !showInputImage && <button disabled={ !isValid} type="button" className="btn" onClick={() => checkFields(validateForm, setShowInputImage, setTouched)}>Crear producto y añadir foto/imagen</button>}
              {
                showInputImage && <>
                  <FileInput name="file" label="Foto/Imagen:" onChange={e => handleUpload(e, setFieldValue, submitForm)} />
                  <Input name="photoUrl" hidden="true" type="text" />
                </>
              }
            </Form>
          )
        }
      </Formik>
    </div>
    </>
  )
};

export default CreateProduct;
