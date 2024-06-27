import './NavBar.css';
import '../Header/Header'
import '../Footer/MyFooter'
import { Button, Layout, theme } from 'antd';
import React, { useEffect, useState } from 'react'
import Logo from './Logo'
import {MenuUnfoldOutlined, MenuFoldOutlined} from '@ant-design/icons'
import MenuList from './MenuList';
import ToggleThemeButton from './ToggleThemeButton';
import MyFooter from '../Footer/MyFooter';
import SensorsData from '../SensorsData/SensorsData';
import BlocPlanning from '../Bloc/BlocPlanning';
import axios from 'axios';
import DailyProduct from '../Product/DailyProduct';

const {Header, Sider, Content, Footer} = Layout;

function NavBar() {
    const [darkTheme, setDarkTheme] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const [blocEnCours, setBlocEnCours] = useState(null);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const UPDATE_BLOC_STATUS_URL = "http://localhost:8080/api/v1/bloc/create";
    const [newProduct, setNewProduct] = useState(false);

    const toggleTheme = () => {
        setDarkTheme(!darkTheme);
    }

    const {
        token: {colorBgContainer},
    } = theme.useToken();

    //Modifier statut du bloc dans la BDD
    const changeBlocStatus = async (blocUpdated) => {
        const response = await axios.post(UPDATE_BLOC_STATUS_URL, blocUpdated);
    }

    //Demarrer un bloc
    const handleStart = (bloc) => {
        //Verifier si un bloc n'est pas déjà en cours
        if(loadingStatus === false) {
            bloc.blocStatut = "EN-COURS"; 
            setBlocEnCours(bloc); //Definir comme bloc en cours
            setLoadingStatus(true); //Changer le statut du loading
            changeBlocStatus(bloc); //Changer le statut dans la BDD
        }
    }

    const handleEnd = (bloc) => {
        //Verifier qu'un bloc est en cours et que c'est bien lui que l'on termine 
        if(loadingStatus && bloc.id === blocEnCours.id ){
            bloc.blocStatut = "TERMINE";
            changeBlocStatus(bloc); //Changer dans la BDD
            setBlocEnCours(null); //Mettre à null le bloc en cours et le boolean
            setLoadingStatus(false);
        }
    }


  return (
    <>
        <Layout>
            <Sider 
                collapsible 
                collapsed={collapsed} 
                trigger={null} 
                theme={darkTheme ? "dark" : "light"} 
                className='sidebar'  
            > 

                <Logo />
                <MenuList darkTheme = {darkTheme} />
                <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
            </Sider>

            <Layout>
                <Header style={{padding: 0, background: colorBgContainer}}>
                        <Button 
                            type='text' 
                            className='toggle'
                            onClick={() => setCollapsed(!collapsed)}
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} />
                </Header>

                <Content style={{padding: '10px',margin: '10px'}} >
                    <div className='sensors-bloc'>
                        <SensorsData blocEnCours ={blocEnCours} newProduct={newProduct} setNewProduct={setNewProduct}/>
                        <BlocPlanning startBloc={handleStart} endBloc = {handleEnd} />
                    </div>
                    <DailyProduct newProduct={newProduct} setNewProduct={setNewProduct} />
                </Content>

                <Footer style={{backgroundColor: "#ccc", padding: 0}}>
                    <MyFooter />
                </Footer>
            </Layout>
        </Layout>
        
    </>
  )
}
export default NavBar