import React from "react";
import { StyleNameProduct, WrapperReportText, WrapperPriceText, WrapperDiscountText, WrapperCardStyle, WrapperStyleTextSell } from "./style";
import {StarFilled} from '@ant-design/icons'
import { useNavigate } from "react-router-dom";
import { convertPrice } from "../../utils";

// Component này tạo ra khung giới thiệu của từng sản phẩm
const CardComponent = (props) => {
  const {countInStock, description, image, name, price,rating, type, selled, discount,id} = props
  const navigate = useNavigate()
  const handleDetailsProduct = (id) => {
    navigate(`/product-detail/${id}`)
  }
  return (
    <WrapperCardStyle
    hoverable
    style={{
      width: '210px',
      marginTop: '20px',
      border: '1px rgb(211, 117, 107) solid'
    }}
    bodyStyle={{padding:"10px"}}
    cover={<img alt="example" src={image} />}
    onClick={() => handleDetailsProduct(id)}
  >
    <StyleNameProduct>{name}</StyleNameProduct>
    <WrapperReportText>
    <span style={{marginRight:'4px'}}>
    <span>{rating} </span><StarFilled style={{fontSize:'12px', color:'rgb(255, 153, 0)'}}/>
    </span>
    <WrapperStyleTextSell> | Đã bán {selled || 0} </WrapperStyleTextSell>
    </WrapperReportText> 
    <WrapperPriceText>
    <span style={{marginRight:'10px'}}>{convertPrice(price)}</span>
    <WrapperDiscountText>
      - {discount || 5}% 
    </WrapperDiscountText>
    </WrapperPriceText>
  </WrapperCardStyle>
  )
}

export default CardComponent