import firebase from 'firebase';
import { getProduct } from './products.service';

export const addSale = async saleData => {
  const db = firebase.firestore();
  const userEmail = firebase.auth().currentUser.email;
  const sale = {
    createdAt: new Date(),
    creator: userEmail,
    subtotal: saleData.subtotal,
    total: saleData.total,
    discount: saleData.discount,
    paymentMethod: saleData.paymentMethod,
    qtyItems: saleData.qtyItems
  }
  const saleRef = await db.collection('sales').add(sale);

  saleData.products.map(async ({id, price, qty}) => {
    const entry = {
      saleId: saleRef.id,
      productId: id,
      priceSelled: price,
      qty: qty,
    }
    await db.collection('sales_entries').add(entry);
    const product = await getProduct(id);
    await db.collection('products').doc(id).update({stock: product.data().stock - qty});
  })
  return saleRef.id;
};

export const getSale = async id => {
  const db = firebase.firestore();

  const sale = await db.collection('sales').doc(id).get();
  const entries = await db.collection('sales_entries').where('saleId', '==', id).get()
  const products = entries.docs.map(p => p.data());

  const productsProcessed = [];

  for(let i = 0; i < products.length; i++) {
    const productId = products[i].productId;
    const productData = await getProduct(productId);
    productsProcessed.push({
      name: productData.data().name,
      priceSelled: products[i].priceSelled,
      qty: products[i].qty
    });
  }

  return {
    sale: { ...sale.data() },
    entries: [ ...productsProcessed ]
  }
}

export const getSales = async () => {
  const db = firebase.firestore();

  return await db.collection('sales').orderBy('createdAt').get();
}

export const getReportSales = async (starDate, endDate) => {
  const db = firebase.firestore();
  console.log(starDate, endDate)
  return await db.collection('sales')
    .where('createdAt', '>=', new Date(starDate))
    .where('createdAt', '<=', new Date(endDate))
    .get();
}
