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
    const prefix = "monitoringSystem";
    return (
        <Layout>
            <MySider />
            <Layout>
                <MyHeader />

                <Content className="content-wrapper">
                    <Routes>
                        <Route path="/" element={<ProdDuJour />} />
                        <Route path={prefix + "/"} element={<ProdDuJour />} />
                        <Route path={prefix + "/produjour"} element={<ProdDuJour />} />
                        <Route path={prefix + "/production"} element={<Production />} />
                        <Route path={prefix + "/typescoulee"} element={<GestionTypeDeCoulee />} />
                    </Routes>
                </Content>

                <MyFooter />
            </Layout>
        </Layout>
    );  
}