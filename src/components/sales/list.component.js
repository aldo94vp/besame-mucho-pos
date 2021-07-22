import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'wouter';

import { getSales } from 'services/sales.service';

import Header from 'components/home/header.component';

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [ , setLocation] = useLocation();

  useEffect(() => {
    const fetchSales = async () => {
      const ab = new AbortController();
      const salesData = await getSales();
      const salesArray = [];
      salesData.docs.forEach(s => salesArray.push({...s.data(), id: s.id}))
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
        <button onClick={() => setLocation('/sales/report')}>Reporte</button>
        <ul>
          {
            sales?.map((s, idx) => (
              <li key={idx}>
                <Link to={`/print/${s.id}`}>
                  <button type="button">
                    {new Date(s.createdAt?.seconds * 1000).toLocaleString() }
                  </button>
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
