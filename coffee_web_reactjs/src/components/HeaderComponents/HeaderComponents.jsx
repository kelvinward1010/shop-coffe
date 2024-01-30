import React, { useEffect, useState } from "react"; 
// Dùng để viết JSx
import {Badge, Col, Popover} from 'antd' 
// Sử dụng để phân chia cột từ ant design
import Search from "antd/es/input/Search"; 
// Tạo ra thanh tìm kiếm ở đầu trang từ ant design
import { WrapperHeader, 
  WrapperText, WrapperHeaderAccout, 
  WrapperTextHeaderSmall,
  WrapperContentPopup,
  WrapperShop
 } from "./style"; 
// styled bên trên được nạp vào từ file style trong cùng thư  mục
import {UserOutlined,CaretDownOutlined, ShoppingFilled } from '@ant-design/icons';
// Icon nhập vào từ ant design
import { useNavigate } from "react-router-dom"; 
// Giúp chuyển trang tự động
import { useDispatch, useSelector } from "react-redux";
// Đọc dữ liệu từ store.js và gửi về qua useDispatch
import * as UserService from '../../services/UserServices'
import { resetUser } from "../../redux/slide/userSlide";
import ButttonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { searchProduct } from "../../redux/slide/productSlide";
import {CoffeeOutlined} from '@ant-design/icons'



// Component này chính là tiêu đề được đặt ngay ở đầu trang
const HeaderComponents = ({isHiddenSearch=false, isHiddenCart=false}) => {
  const navigate = useNavigate()
  const user = useSelector ((state) => state.user)
  const dispatch = useDispatch()
  const[userName,setUserName] = useState('')
  const[userAvatar,setUserAvatar] = useState('')
  const [search, setSearch] = useState('')
  const [isOpenPoup, setIsOpenPoup] = useState(false)
  const order = useSelector((state) => state.order)
  // biến user chứa hàm useSelector() sẽ trả ra dữ liệu từ store và được truyền ra bên ngoài JSX
  const handleNavigateLogin = () =>{
    // hàm handleNavigateLogin sẽ gọi đến useNavigate() và trả ra đường dẫn đến trang đăng nhập
    navigate('/sign-in')
  }

const handleLogout = async () => {
  await UserService.logoutUser()
  dispatch(resetUser())
  localStorage.removeItem('access_token') // Fix lỗi access_token
}

useEffect(() =>{
  setUserName(user?.name)
  setUserAvatar( user?.avatar)
},[user?.name, user?.avatar])

const content = (
  <div>
  <WrapperContentPopup onClick={()=> handleClickNavigate('profile')}>Thông tin người dùng</WrapperContentPopup>
  {user?.isAdmin && (
    <WrapperContentPopup onClick={()=> handleClickNavigate('admin')}>Quản lý hệ thống</WrapperContentPopup>
  )}
  <WrapperContentPopup onClick={()=> handleClickNavigate(`my-order`)}>Kiểm tra đơn hàng</WrapperContentPopup>
  <WrapperContentPopup onClick={()=> handleClickNavigate()}>Đăng xuất</WrapperContentPopup>
  </div>
)

const handleClickNavigate = (type) => {
  if(type === 'profile') {
    navigate('/profile-user')
  }
  else if(type === 'admin'){
    navigate('/system/admin')
  }
  else if(type === 'my-order'){
    navigate('/my-order', { state: {
      id: user?.id,
      token: user?.access_token
    }
    })
  }
  else{
    handleLogout()
  }
  setIsOpenPoup(false)
}

const onSearch = (e) => {
  setSearch(e.target.value)
  dispatch(searchProduct(e.target.value))
}

// Bên dưới là code JSX
  return (
    <div>
    <WrapperHeader style={{justifyContent: isHiddenSearch && isHiddenSearch ?'space-between' : 'unset'}}>
      <Col span={6}>
      <WrapperText to='/'><CoffeeOutlined /> COFFEE</WrapperText></Col>
      {!isHiddenSearch && (
        <Col span={12}>
          <ButttonInputSearch
            size = "large"
            bordered = {false}
            textButton = "Tìm kiếm"
            placeholder = "Nhập tên sản phẩm"
            onChange = {onSearch}
          />
        </Col>
      )}
      <Col span={6} style={{display: 'flex', gap: '30px', marginLeft: '25px'}}>
      {!isHiddenCart && (
        <WrapperShop onClick={() => navigate('/order')} style={{cursor:'pointer', width:'fit-content'}}>
        <Badge count={order?.orderItems?.length} size="small">
        <ShoppingFilled style={{fontSize: 30, color: "rgb(167, 93, 93)"}}/>
        </Badge>
        </WrapperShop>
        )}
      <WrapperHeaderAccout>
      {userAvatar ? (
        <img src={userAvatar} alt="avatar" style={{
          height: '30px',
          width: '30px',
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid rgb(167, 93, 93)'
      }}/>
      ):(
        <UserOutlined style={{fontSize: 30}} />
      )}
      {user?.access_token ? (
        <>
        <Popover content={content} trigger="click" open={isOpenPoup}>
        <div style={{cursor: "pointer"}} onClick={()=>setIsOpenPoup((prev) => !prev)}>{userName?.length ? userName : user?.email}</div>
        </Popover>
        </>
      ):(
        <div onClick={handleNavigateLogin} style={{cursor: "pointer"}}>
        <WrapperTextHeaderSmall>Đăng nhập / Đăng kí</WrapperTextHeaderSmall>
        <div>
        <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
        <CaretDownOutlined />
        </div>
        </div>
      )}
      </WrapperHeaderAccout>
      </Col>
    </WrapperHeader>
    </div>
  )
}

export default HeaderComponents