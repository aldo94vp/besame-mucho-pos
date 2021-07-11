import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'wouter'
import firebase from 'firebase';

import Header from './header.component';

import './home.scss';

const Home = () => {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if(!user) setLocation('/login');
      setUser(user);
    })
  }, [setLocation]);

  return (
    <>
      <Header></Header>
      <div className="container-centered">
        <ul className="actions-container">
          <li>
            <Link href="/sales">
              <a>
                <div className="actions sales">
                  <span>
                    Ventas
                  </span>
                </div>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/sales/new">
              <a>
                <div className="actions new-sale">
                  <span>
                    Nueva venta
                  </span>
                </div>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/products">
              <a>
                <div className="actions list-products">
                  <span>
                    Productos
                  </span>
                </div>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/products/new">
              <a>
                <div className="actions add-product">
                  <span>
                    Añadir producto  
                  </span>
                </div>
              </a>
            </Link>
          </li>
          {
            user?.email === 'aldo94vp@gmail.com' &&
              <li>
                <Link href="/codes/new">
                  <a>
                    <div className="actions promos">
                      <span>
                        Añadir promoción  
                      </span>
                    </div>
                  </a>
                </Link>
              </li>
          }
        </ul>
      </div>
    </>
  )
}

export default Home;
