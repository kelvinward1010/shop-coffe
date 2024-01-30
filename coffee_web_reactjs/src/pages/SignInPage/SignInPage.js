import React, { useEffect, useState } from "react";
// Nạp thêm useEffect, useState để thay đổi và render lại dữ liệu ra màn hình
import {WrapperContainerLeft, WrapperContainerRight, WrapperTextLight} from './style'
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import sign from '../../img/imgs/sgin.jpeg'
import { Image } from "antd";
import {EyeFilled, EyeInvisibleFilled} from '@ant-design/icons'
// Nhập Icon từ Ant-design
import { useLocation, useNavigate } from "react-router-dom";
// useNavigate Giúp chuyển trang tự động
import * as UserService from '../../services/UserServices'
// Nạp UserService từ folder UserService
import { useMutationHooks } from "../../hook/useMutationHook";
//import Loading from "../../components/LoadingComponent/LoadingComponent";
import { jwtDecode } from "jwt-decode";
//JSON Web Mã (JWT) là một chuẩn mở (RFC 7519) định nghĩa một cách nhỏ gọn và khép kín
// để truyền một cách an toàn thông tin giữa các bên dưới dạng đối tượng JSON
import { useDispatch } from "react-redux";
// useDispatch giúp chuyển dữ liệu từ store.js
import { updateUser } from "../../redux/slide/userSlide";
import storage from "redux-persist/lib/storage";
// Nạp dữ liệu của updateUser từ folder redux/slide

// TRANG NÀY LÀ TRANG ĐĂNG NHẬP
const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false)
  // Khai báo setIsShowPassword để cho phép hiển thị mật khẩu hoặc không
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // Khai báo email, password với giá trị khởi tạo ban đầu là rỗng
  const dispatch = useDispatch()
  // khai báo hàm useDispatch và gán cho biến dispatch

  // Tạo ra các hàm để lấy dữ liệu được nhập vào input và render lại cho useState và hiển thị ra màn hình
  const handleOnchangeEmail = (value) => {
    setEmail(value)
  }
  const handleOnchangePassword = (value) => {
    setPassword(value)
  }

  // Khai báo hàm useNavigate() và gắn cho biến navigate để chuyển trang tự động
  const navigate = useNavigate()

  // Khai báo hàm useMutationHooks() và gắn cho biến mutation để call API từ back-end
  const mutation = useMutationHooks(
     data => UserService.loginUser(data)
  )

  // Nạp dữ liệu cho mutation
  const {data, isLoading, isSuccess, isError} = mutation

  // Sử dụng useEffect() để render lại dữ liệu khi nó bị thay đổi
  useEffect(()=>{
    if (isSuccess){
      if(location?.state){
        navigate(location?.state)
      }else{
        navigate('/') // chuyển về trang Home khi nhập thành công
      }
      localStorage.setItem('access_token', JSON.stringify(data?.access_token))
      localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token))
      if(data?.access_token){
        const decoded = jwtDecode(data?.access_token)
        if(decoded?.id){
          handleGetDetailsUser(decoded?.id, data?.access_token)
        }
      }
    }
  },[isSuccess])

  const handleGetDetailsUser = async (id, token) => {
    const storage = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storage)
    const res = await UserService.getDetailsUser(id, token)
    // UserService.getDetailsUser(id, token) đang gọi hàm bên back-end
    dispatch(updateUser({ ...res?.data, access_token: token,refreshToken }))
  }


  // Chuyển trang đăng kí
  const handleNavigateSignUp = () =>{
    navigate('/sign-up')
  }

  // Lấy dữ liệu được nhập vào input khi bấm nút đăng kí và truyền nó qua API phía back-end
  const handleSignUp = () => {
    mutation.mutate({
      email, password
    })
    }
  

  return(
    <div style={{
      display:'flex', 
      alignItems:'center',
      justifyContent:'center',
      background:'rgb(242, 236, 190)',
      height:'100vh'
    }}>
    <div style={{
      display: 'flex',
      width: '500px', 
      height:'445px',
      borderRadius:'6px',
      backgroundColor:'white',
      boxShadow: '2px 2px 2px #ccc',
      border: '1px solid rgb(192, 130, 97)'}}>

    <WrapperContainerLeft>
      <h1 style={{textTransform: 'uppercase', fontWeight:'bolder', color:'rgb(154, 59, 59)'}}>Xin chào !</h1>
      <p style={{fontSize: '15px',color:'rgb(154, 59, 59)'}}>Mời bạn đăng nhập tài khoản</p>

      <InputForm 
      style={{marginBottom:'10px'}} 
      placeholder = "Hãy nhập email tài khoản của ban"
      value={email} 
      onChange={handleOnchangeEmail}
      />

      <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '4px',
                right: '8px'
              }}
            >{
                isShowPassword ? (
                  <EyeFilled />
                ) : (
                  <EyeInvisibleFilled />
                )
              }
            </span>
            <InputForm
              placeholder="Hãy nhập mật khẩu của ban"
              type={isShowPassword ? "text" : "password"}
              value={password} 
              onChange={handleOnchangePassword}
            />
          </div>

      {data?.status === 'ERR' && <span style={{color:'red', paddingTop:"10px"}}>{data?.message}</span>}

      <ButtonComponent
      disabled = {!email.length || !password.length }
      onClick = {handleSignUp}
            size={40}
            textButton={'Đăng nhập'}
            styleTextButton={{color:'#9A3B3B'}}
            styleButton={{
              background: 'rgb(226, 199, 153)',
              width: '220px',
              height: '50px',
              border: 'none',
              borderRadius: '4px',
              margin: '26px 0 10px 190px'
            }}
          ></ButtonComponent>
          <div style={{margin: '15px 0 10px 190px'}}>
          <p>Chưa có tài khoản ?<WrapperTextLight onClick={handleNavigateSignUp}> Đăng kí tài khoản</WrapperTextLight></p>
          </div>
    </WrapperContainerLeft>
    </div>
    </div>
  )
}

export default SignInPage