import React from 'react';
import {Menu} from 'antd';
import {
    HomeOutlined, 
    AppstoreOutlined, 
    SettingOutlined,
} from '@ant-design/icons';
import { CubeIcon, RapportIcon, HistoriqueIcon } from './MyIcons';

const MenuList = ({darkTheme}) => {
  return (
    <Menu 
        theme={darkTheme ? 'dark' : 'light'} 
        mode='inline' 
        className='menu-bar'
    >
        <Menu.Item key="home" icon={<HomeOutlined />} > 
            Home 
        </Menu.Item>

        <Menu.Item key="dashboard" icon={<AppstoreOutlined />} > 
            Tableau de bord
        </Menu.Item>
        

        {/*<Menu.SubMenu
            key="task"
            icon={<BarsOutlined /> }
            title="Tasks" 
        >
            <Menu.Item key="a"> Task - 1 </Menu.Item>
            <Menu.Item key="b"> Task - 2 </Menu.Item>
            <Menu.Item key="c"> Task - 3 </Menu.Item>

            <Menu.SubMenu key="subtask" title="subTask">
                <Menu.Item key="substack1"> SubTask - 1 </Menu.Item>
                <Menu.Item key="substack2"> SubTask - 2 </Menu.Item>
                <Menu.Item key="substack3"> SubTask - 3 </Menu.Item>
            </Menu.SubMenu>

        </Menu.SubMenu> */}

        <Menu.SubMenu
            key="production"
            icon={<CubeIcon />}
            title="Production" 
        >
            <Menu.Item key="prod-en-cours"> Prod en cours </Menu.Item>
            <Menu.Item key="prod-du-jour"> Prod du jour </Menu.Item>
        </Menu.SubMenu>

        <Menu.Item key="rapport" icon={<RapportIcon />}>
            Rapport
        </Menu.Item>

        <Menu.Item 
            key="parametre" 
            icon={<SettingOutlined />} 
        > 
            Paramètres
        </Menu.Item>

        <Menu.Item 
            key="historique" 
            icon={<HistoriqueIcon />} 
        > 
            Historique
        </Menu.Item>
    </Menu>
  )
}
export default MenuList