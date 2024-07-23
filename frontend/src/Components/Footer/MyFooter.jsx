import { Footer } from "antd/es/layout/layout";
import "./MyFooter.css"
export default function MyFooter(){
    return(
        <Footer className="footer-wrapper">
            <h3>Copyright &copy; {new Date().getFullYear()} SERVALOG - EGATECH </h3>
        </Footer>
    );
}