import { Layout } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import React from "react"
import MySider from "../Sider/MySider"
import MyHeader from "../Header/MyHeader";
import "./MyLayout.css"
import MyFooter from "../Footer/MyFooter";
import SensorsData from "../SensorsData/SensorsData";
import CouleeProduction from "../CouleeProduction/CouleeProduction";
import ProdDuJour from "../ProdDuJour/ProdDuJour";
import { Route, Routes} from "react-router-dom";
import Production from "../Production/Production";
import GestionTypeDeCoulee from "../GestionTypeDeCoulee/GestionTypeDeCoulee";

export default function MyLayout() {
    return (
        <Layout>
            <MySider />
            <Layout>
                <MyHeader />

                <Content className="content-wrapper">
                    <Routes>
                        <Route path="/" element={<ProdDuJour />} />
                        <Route path="/produjour" element={<ProdDuJour />} />
                        <Route path="/production" element={<Production />} />
                        <Route path="/typescoulee" element={<GestionTypeDeCoulee />} />
                    </Routes>
                </Content>

                <MyFooter />
            </Layout>
        </Layout>
    );  
}