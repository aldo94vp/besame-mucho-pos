import firebase from 'firebase';

export const addPromoCode = async codeData => {
  const db = firebase.firestore();
  return await db.collection('promocodes').add(codeData);
}

export const getPromoCode = async (code = '') => {
  const db = firebase.firestore();
  return await db.collection('promocodes').where('promoCode', '==', code).get();
}
