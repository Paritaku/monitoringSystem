import React from 'react'
import './LoginForm.css';
import logo from '../assets/img.png'
import servalog from "../assets/servalog.png"
import egatech from "../assets/egatech.jpeg"
import { FaUser, FaLock } from "react-icons/fa";

const LoginForm = () => {
  return (
    <div className='main-container'>
        <div className='company-logo-container'>
            <img src={servalog} className='servalog-logo' />
            <img src={egatech} className='egatech-logo' />
        </div>
        <div className='center-container'>
            <div className="left-form">
                <img src={logo} alt='Logo' />
                <h1> Monitoring System </h1>
            </div>
            <div className="right-form">
                <form action="">
                    <h1>Log In</h1>
                    <div className="input-box">
                        <input type="text" placeholder="Username" required  />
                        <FaUser className='icon' />
                    </div>

                    <div className="input-box">
                        <input type="password" placeholder="Password" required  />
                        <FaLock className='icon' />
                    </div>

                    <button type="submit"> Sign In </button>
                </form>
            </div>
        </div>
    </div>
  )
}
export default LoginForm