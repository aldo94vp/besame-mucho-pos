import React, { useState, useEffect } from 'react'
import { useLocation } from 'wouter';

import { getProducts } from 'services/products.service';

import Header from 'components/home/header.component';
import Product from './product.component';

const ListProducts = () => {
  const [ products, setProducts ] = useState([])
  const [ , setLocation ] = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      const ab = new AbortController();
      const products = []
      const productsSnapshot = await getProducts();
      productsSnapshot.forEach(p => {
        const product = {
          ...p.data(),
          id: p.id
        }
        products.push(product);
      });
      setProducts(products);
      console.log(products)
      return () => ab.abort();
    }
    fetchData();
  }, []);

  const edit = id => setLocation(`products/${id}`);

  return (
    <>
    <Header>
      <h1>Productos</h1>
    </Header>
    <div className="products">
      {
        products.map(p => (
          <Product product={ {...p}} onClick={() => edit(p.id)}  btnLabel='Editar'/>
        ))
      }
    </div>
    </>
  )
}

export default ListProducts;
