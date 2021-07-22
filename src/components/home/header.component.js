import React from 'react'
import { useLocation } from 'wouter';

import './home.scss';

const Header = ({children}) => {
  const [location, setLocation] = useLocation();

  const returnHome = () => {
    setLocation("/");
  }

  return (
    <header>
      <img className={location === '/' && 'centered-logo'} src="/logo_transparencia.png" alt="logo" />
      {
        location !== '/' && <div className="separator"></div>
      }
      { children }
      {
        location !== '/' && <span onClick={returnHome} className="close-sale">❌</span>
      }
    </header>
  )
}

export default Header;
