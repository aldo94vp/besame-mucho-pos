import React, { useEffect, useState } from 'react';
import { useRoute } from 'wouter';

import { getSale } from 'services/sales.service';

import './print.scss';

const Print = () => {
  const [ data, setData ] = useState({});
  const [ , { id } ] = useRoute("/print/:id");
  
  useEffect(() => {
    const fetchData = async () => {
      const ab = new AbortController();
      try {
        const saleData = await getSale(id);
        setData(saleData);
        console.log(saleData)
      } catch (error) {
        console.log(error)
      }
      return () => ab.abort();
    }
    fetchData();
  }, []);

  return (
    <>
      <div className="ticket">
        <img className="logo" src="/logo.png" alt="" />
        <p className="centered header">
          Melchor Ocampo #25
        </p>
        <p className="centered header">
          Col. Centro, C.P. 49000
        </p>
        <p className="centered header">
          Cd. Guzmán, Jalisco
        </p>
        <p className="centered header">
          RFC: SEAC931208V74
        </p>
        <p></p>
        <p className="centered header">
          Ticket Id:
        </p>
        <p className="centered header id">
          {id}
        </p>
        <p className="centered header">
          Fecha de compra:
        </p>
        <p className="centered header">
          {new Date(data.sale?.createdAt.seconds * 1000).toLocaleString()}
        </p>
        <div className="table">
          <div className="thead">
            <div className="tr">
              <span className="quantity">Cant.</span>
              <span className="description">Artículo</span>
              <span className="price"></span>
            </div>
          </div>
          <img className="line" src="/line.png" alt="" />
          <div className="tbody">
            {
              data.entries?.map(p => (
                <div className="tr" key={`ticket-${p.name}-${p.price}`}>
                  <span className="quantity">{p.qty}</span>
                  <span className="description">{p.name}</span>
                  <span className="price">{p.priceSelled}</span>
                </div>
              ))
            }
          </div>
        </div>
        <p className="total">Subtotal: <span className="price">{data.sale?.subtotal}</span></p>
        {
          (data.sale?.discount && data.sale?.discount > 0) ?
            <p className="total">Descuento: <span>{data.sale?.discount} %</span></p>: ''
        }
        <p className="total">Total: <span className="price">{data.sale?.total}</span></p>
        <p className="centered">
          ¡Gracias por tu compra!
        </p>
        <p className="centered">
          Síguenos en nuestras redes
        </p>
        <p className="centered">
          escaneando el código
        </p>
        <img className="logo qr" src="/qr.png" alt="" />
      </div>
      <button className="hidden-print" onClick={() => window.print()}>Imprimir</button>
    </>
  )
}

export default Print;
