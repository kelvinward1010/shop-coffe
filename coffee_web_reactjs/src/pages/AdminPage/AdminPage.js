import { Menu } from "antd";
import React, { useState } from "react";
import { getItem } from "../../utils";
import {UserOutlined , MenuOutlined, BoxPlotOutlined} from '@ant-design/icons'
import HeaderComponents from "../../components/HeaderComponents/HeaderComponents";
import AdminUser from "../../components/AdminUser/AdminUser";
import AdminProduct from "../../components/AdminProduct/AdminProduct";
import OrderAdmin from "../../components/OrderAdmin/OrderAdmin";

const AdminPage = () =>{
  const items = [
    getItem('Người dùng', 'user', <UserOutlined />, ),
    getItem('Sản phẩm', 'product', <MenuOutlined />, ),
    getItem('Đơn hàng', 'order', <BoxPlotOutlined />, ),
  ];

const [keySelected, setKeySelected] = useState('')
const renderPage = (key) =>{
  switch(key){
    case 'user':
      return(
        <AdminUser />
      )
      case 'product':
      return(
        <AdminProduct />
      )
      case 'order':
        return(
          <OrderAdmin />
        )
      default:
        return<></>
  }
}

const handleOnclick = ({  key }) =>{
  setKeySelected(key)
}

  return(
  <div>
  <HeaderComponents isHiddenSearch />
  <hr style={{color:"rgb(192, 130, 97)", width:'90%', marginBottom:'0px'}}/>
  <div style={{display:'flex', overflowX: 'hidden',background: '#f5f5fa'}}>
  <div style={{borderRight: '2px solid rgb(226, 199, 153)', padding: '5px'}}>
      <Menu
      mode="inline"
      style={{ 
        boxShadow: '1px 1px 2px #ccc',
        width: 'fit-content',
        height: 'fit-content',
        border: '1px solid rgb(192, 130, 97)',
        padding: '10px',
        margin: '50px',
        color: 'rgb(154, 59, 59)',
        fontWeight: 'bolder'
      }}
      items={items}
      onClick={handleOnclick}
    />
  </div>
  <div style={{
    flex: 1, 
    padding: '15px 0 15px 15px', 
    margin: '10px',
  }}>
    {renderPage(keySelected)}
  </div>
  </div>
  </div>
  )
}

export default AdminPage