import React from 'react'
import './MyFooter.css'

const MyFooter = () => {
  return (
    <div className='container'>
      <h3>Copyright &copy; {new Date().getFullYear()} SERVALOG </h3>
    </div>
  )
}

export default MyFooter