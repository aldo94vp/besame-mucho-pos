import React, { useEffect, useState } from 'react'
import { Link } from 'wouter';

import { getSales } from 'services/sales.service';

import Header from 'components/home/header.component';

const SalesList = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      const ab = new AbortController();
      const salesData = await getSales();
      const salesArray = [];
      salesData.docs.forEach(s => salesArray.push({...s.data(), id: s.id}))
      console.log(salesArray)
      setSales(salesArray);
      ab.abort();
    }
    fetchSales();
  }, []);

  return (
    <>
      <Header>
        <h1>
          Listado de Ventas
        </h1>
      </Header>
      <div className="sales-list">
        <ul>
          {
            sales?.map(s => (
              <li>
                <Link to={`/print/${s.id}`}>
                  <a>
                    {new Date(s.createdAt?.seconds * 1000).toLocaleString() }
                  </a>
                </Link>
              </li>
            ))
          }
        </ul>
      </div>
    </>
  )
};

export default SalesList;
