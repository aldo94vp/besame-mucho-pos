import React, { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'wouter';

import { getProductsInStock } from 'services/products.service';
import { addSale } from 'services/sales.service';

import Product from 'components/products/product.component';
import Header from 'components/home/header.component';
import { InputSimple } from 'components/products/inputs';

import './sales.scss';
import { getPromoCode } from 'services/promocodes.service';

export const CreateSale = () => {
  const [list, setList] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [qtyItems, setQtyItems] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [promoCode, setPromoCode] = useState('');
  const [validPromoCode, setValidPromoCode] = useState(false);
  const [promoData, setPromoData] = useState({});

  const [, setLocation] = useLocation();

  const applyPromoCode = useCallback(
    async code => {
      const promo = await getPromoCode(code);
      if (!promo.empty) {
        setPromoData(promo.docs[0].data());
      } else {
        setValidPromoCode(false)
        setPromoData(null)
        setTotal(subtotal);
        alert('Promoción inválida');
      }
    },
    [subtotal],
  )

  useEffect(() => {
    const fetchData = async () => {
      const ab = new AbortController();
      const products = []
      const productsSnapshot = await getProductsInStock();
      productsSnapshot.forEach(p => {
        const product = {
          ...p.data(),
          id: p.id
        }
        products.push(product);
      });

      setProducts(products);
      return () => ab.abort();
    }
    fetchData();
  }, []);

  useEffect(() => {
    // calculate total
    const newTotal = list.reduce((p, c) => {
      return p + (c.price * c.qty);
    }, 0)
    // calculate qty
    const newQty = list.reduce((p, c) => {
      return p + c.qty;
    }, 0)
    setQtyItems(newQty);
    setSubtotal(newTotal);
    setTotal(newTotal);
    validPromoCode && applyPromoCode(promoCode);
  }, [list, setList, promoCode, validPromoCode, applyPromoCode])

  useEffect(() => {
    if (promoData && promoData.status === 'active') {
      setValidPromoCode(true)
      setTotal(subtotal * (1 - (promoData.discount / 100)));
    }
  }, [promoData, subtotal]);

  const addItem = ({ id, price, name }, idx) => {
    products[idx].stock--;
    const idReppeated = list.findIndex(i => i.id === id);
    let newList;
    if (idReppeated >= 0) {
      list[idReppeated].qty++;
      newList = [...list];
    } else {
      const product = {
        id,
        name,
        price,
        qty: 1
      }
      newList = [ ...list, product ];
    }
    
    setList(newList);
  }

  const increment = (idx, id) => {
    products[products.findIndex(p => p.id === id)].stock--;
    list[idx].qty++;
    const newList = [...list];
    setList(newList);
  }

  const decrement = (idx, id) => {
    products[products.findIndex(p => p.id === id)].stock++;
    let newList;
    if (list[idx].qty > 1) {
      list[idx].qty--;
      newList = [ ...list ];
    } else {
      newList = [ ...list.filter((_, i) => i !== idx) ];
    }
    setList(newList);
  }

  const pay = async () => {
    const sale = {
      paymentMethod,
      products: list,
      subtotal,
      total,
      qtyItems,
      discount: promoData.discount || 0
    }

    const saleId = await addSale(sale); 
    setLocation(`/print/${saleId}`);
  }

  const changePaymentMethod = e => setPaymentMethod(e.target.value);

  return (
    <div>
      <Header>
        <h1>Nueva venta </h1>
      </Header>
      <div className="sale">
        <div className="products">
          {products.map((p, idx) => (
            <Product key={`product-${idx}`} product={{...p}} btnLabel='Añadir' disableActionOnFewStock={true} onClick={() => addItem(p, idx)} />
          ))}
        </div>
        <div className="cart">
          <h4>Carrito</h4>
          {list.map((item, idx) => (
            <div key={item.id} className="cart__item">
              <div className="cart__item__desc">
                <span>
                  {item.name}
                </span>
                <span className="price">{item.price}</span>
              </div>
              <div className="cart__item__actions">
                <button onClick={() => decrement(idx, item.id)}>-</button>
                <span>{item.qty}</span>
                <button 
                  disabled={products[products.findIndex(p => p.id === item.id)].stock < 1} 
                  onClick={() => increment(idx, item.id)}>+
                </button>
              </div>
            </div>
          ))}
          <p className="qty">
            <span>Artículos:</span><span>{qtyItems}</span>
          </p>
          <p className="subtotal">
            <span>Subtotal:</span><span className="price">{subtotal}</span>
          </p>
          {
            validPromoCode &&
            <p className="subtotal">
              <span>Promoción:</span><span>{`${promoData?.promoCode}( ${promoData?.discount} % )`}</span>
            </p>
          }
          <p className="subtotal">
            <span>Total:</span><span className="price total">{total}</span>
          </p>
          <InputSimple 
            label="Promo Code:" 
            name="promoCode" 
            onChange={e => setPromoCode(e.target.value.toUpperCase())} 
          />
          <button type="button" className="btn" disabled={list.length === 0 || promoCode === ''} onClick={() => applyPromoCode(promoCode)}>Aplicar código</button>
          <div role="group">
            <p>
              Forma de pago:
            </p>
            <div className="radio-item">
              <input type="radio" onClick={changePaymentMethod} id="cash-radio" name="paymentMethod" defaultChecked={true} value="cash" />
              <label className="label-icon option1" htmlFor="cash-radio">
                Efectivo
              </label>
            </div>
            <div className="radio-item">
              <input type="radio" onClick={changePaymentMethod} id="card-radio" name="paymentMethod" value="card" />
              <label className="label-icon option2" htmlFor="card-radio">
                Tarjeta
              </label>
            </div>
          </div>
          <button className="btn" disabled={list.length === 0} onClick={pay}>Completar Venta</button>
        </div>
      </div>
    </div>
  )
}

export default CreateSale;
