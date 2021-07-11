export const initialValuesProduct = {
  name: '',
  photoUrl: '',
  price: 0,
  stock: 1,
  status: 'active'
};

export const initialValuesPromoCode = {
  promoCode: '',
  discount: undefined,
  status: 'active'
}

const commonError = 'es requerido.';
export const validate = values => {
  const errors = {};

  if (!values.name || values.name.length < 2) errors.name = `Nombre ${commonError}`;

  if (!values.price || values.price < 1) errors.price = `Precio ${commonError}`;

  if (!values.productCode || values.productCode.length < 1) errors.productCode = `Código ${commonError}`;

  return errors;
};

export const validatePromoCode = values => {
  const errors = {};

  if (!values.promoCode || values.promoCode.length < 4) errors.promoCode = `Código ${commonError}`

  if (!values.discount || values.discount < 1) errors.discount = `Descuento ${commonError}`

  return errors;
}