import React, { useEffect, useState } from "react";
import { WrapperLabelText, WrapperTextValue, WrapperContent, WrapperTextPrice, WrapperNavnarContent } from "./style";
import { Checkbox,Rate } from "antd";
import TypeProduct from "../TypeProduct/TypeProduct";
import * as ProductService from '../../services/ProductServices'


// Component này tạo ra 1 danh sách tên các sản phẩm khác, hiện thị ở bên trái khi kích chọn xem danh mục
// các loại sản phẩm
const NavbarComponent = () => {
  const [typeProducts, setTypeProducts] = useState([])
  const onChange = (checkedValues) => {
  };

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if(res?.status === 'OK'){
      setTypeProducts(res?.data)
    }
  }

  useEffect(() => {
    fetchAllTypeProduct()
  },[])
  
  const renderContent = (type, options) => {
    switch (type){
      case 'text':
        return options.map((option)=>{
          return (
            <WrapperTextValue>{option}</WrapperTextValue>
          ) 
        })
        case 'checkbox':
          return (<Checkbox.Group
          style={{
            width: '100%',
            display: 'flex',
            flexDirection:'column',
          }}
          onChange={onChange}
        >
        {options.map((option)=>{
          return(
            <Checkbox  value={option.value}>{option.label}</Checkbox>
          )
        })}
        </Checkbox.Group>)  
        case 'star':
          return (options.map((option)=>{
          return(
            <div style={{display: 'flex', gap: '5px'}}>
            <span>{`từ ${option} sao`}</span>
            <Rate style={{fontSize: '12px'}} disabled defaultValue={option} />
            </div>
          )
        })
        )
        case 'price':
          return (options.map((option)=>{
          return(
            <WrapperTextPrice>{option}</WrapperTextPrice>
          )
        })
        )
        default:
          return{}
    }
  }
  return (
    <WrapperNavnarContent>
      <WrapperLabelText style={{textTransform: 'uppercase', padding:'30px'}}>Mặt hàng khác</WrapperLabelText>
      <WrapperContent>
      {typeProducts.map((item)=>{ //  Sử dụng hàm map để render dữ liệu ra màn hình
        return(
          <TypeProduct name={item} key={item}/>
        )
      })}      
      </WrapperContent>
      
    </WrapperNavnarContent>
  )
}

export default NavbarComponent