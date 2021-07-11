import firebase from 'firebase';

export const addProduct = async product => {
  const db = firebase.firestore();
  return await db.collection('products').add(product);
}

export const updateProduct = async product => {
  const db = firebase.firestore();
  const { id } = product;
  delete product.id;
  return await db.collection('products').doc(id).update(product);
}

export const getProductsInStock = () => {
  const db = firebase.firestore();

  return db.collection('products')
    .where('status', '==', 'active')
    .where('stock', '>', 0)
    .get();
}

export const getProducts = () => {
  const db = firebase.firestore();
  return db.collection('products').get()
}

export const getProduct = id => {
  const db = firebase.firestore();
  return db.collection('products').doc(id).get()
}
