import React from 'react'
import { useLocation } from 'wouter';

import './home.scss';

const Header = ({children}) => {
  const [location, setLocation] = useLocation();

  const returnHome = () => {
    setLocation("/home");
  }

  return (
    <header>
      <img className={location === '/home' && 'centered-logo'} src="/logo_transparencia.png" alt="logo" />
      {
        location !== '/home' && <div className="separator"></div>
      }
      { children }
      {
        location !== '/home' && <span onClick={returnHome} className="close-sale">❌</span>
      }
    </header>
  )
}

export default Header;
