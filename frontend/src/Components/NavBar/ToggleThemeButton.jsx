import React from 'react';
import { Button } from 'antd';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';

function ToggleThemeButton({darkTheme, toggleTheme}) {
  return (
    <div className='toggle-theme-button'>
        <Button onClick={toggleTheme}>
            {darkTheme ? <HiOutlineSun /> : <HiOutlineMoon /> }
        </Button>
    </div>
  )
}
export default ToggleThemeButton