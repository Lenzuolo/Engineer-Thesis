import React from 'react';
import logo from '../../assets/logo-ps-white.svg'
import './topbar.css'



const Topbar = () => 
{
    return (
        <div className="topbar-main">
            <img src={logo} className="topbar-logo" alt='Politechnika Śląska'/>
            <div className='topbar-title'>Moduł Nauczania Syntezy Układów Sekwencyjnych</div>
        </div>
    )
}

export default Topbar;