import React from 'react'
import './MyFooter.css'

const MyFooter = () => {
  return (
    <div className='container'>
            Copyright &copy; {new Date().getFullYear()} SERVALOG
        
    </div>
  )
}

export default MyFooter