import React from "react";
import {CoffeeOutlined} from '@ant-design/icons'
import { WrapperShareFooter, WrapperElementA } from './style'

const FooterComponent = () => {
  return(
    <div style={{
    width:'90%',
    height:'auto', 
    background:'rgb(211, 117, 107)', 
    margin:'0 auto',
    padding:'20px'}}>
        <h3>FooterComponent</h3>
        <h3>COFFEE<CoffeeOutlined /></h3>
        <p>I would take 2 hours just to design headers of the site. And my CSS was too big, just for CSS, 
        and you have created a beautiful header with so much concise CSS. 
        You rock! Please tell me which theme of VS code you are using?</p>
        

        <WrapperShareFooter class="share">
          <div>
            <WrapperElementA href="#" class="fab fa-facebook-f"></WrapperElementA>
            <WrapperElementA href="#" class="fab fa-twitter"></WrapperElementA>
            <WrapperElementA href="#" class="fab fa-instagram"></WrapperElementA>
          </div>
          <div>
            <WrapperElementA href="#" class="links"><i class="fas fa-phone"></i>123456789</WrapperElementA>
            <WrapperElementA href="#" class="links"><i class="fas fa-envelope"></i>123456789</WrapperElementA>
            <WrapperElementA href="#" class="links"><i class="fas fa-map-marker-alt"></i>Anywhere so far</WrapperElementA>
          </div>
        </WrapperShareFooter>

    </div>
  )
}

export default FooterComponent