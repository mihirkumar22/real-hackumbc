import React from 'react'
import './LandingNavbar.css'
import logo from '../components/images/BEANSTACKLogo.png'

const LandingNavbar = () => {
  return (
    <div>
      <div className="landing-nav-wrapper">
        <div className="landing-nav-left">
            <img src={logo} alt="BeanStack Logo" className="landing-nav-logo" />
        </div>
        <div className="landing-nav-right">
            <button className="landing-nav-button" onClick={() => window.location.href = '/login'}>Login</button>
            <button className="landing-nav-button" onClick={() => window.location.href = '/register'}>Get Started</button>
        </div>
      </div>
    </div>
  )
}

export default LandingNavbar
