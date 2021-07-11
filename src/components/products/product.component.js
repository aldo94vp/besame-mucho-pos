import React from 'react'

const Product = ({product, btnLabel, onClick, disableActionOnFewStock}) => {
  const { id, photoUrl, name, price, stock, productCode } = product;

  return (
    <div key={`product-${id}`} className="products__item">
      <figure>
        <img src={photoUrl} alt="" />
        <figcaption>{name} <span className="price">{price}</span></figcaption>
      </figure>
      <p className="code">
        <span>Código:</span>
        <span>{productCode}</span>
      </p>
      <span className={stock === 0 ? 'out-stock' : ''}>{stock} en existencia</span>
      <button className="btn" disabled={disableActionOnFewStock && stock < 1 && true} onClick={onClick}>{btnLabel}</button>
    </div>
)}

export default Product;