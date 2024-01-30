import React, { useEffect, useState } from "react";
import {WrapperContainerLeft, WrapperContainerRight, WrapperTextLight} from './style'
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import sign from '../../img/imgs/sgin.jpeg'
import { Image } from "antd";
import {EyeFilled, EyeInvisibleFilled} from '@ant-design/icons'
import { useNavigate } from "react-router-dom";
import * as UserService from '../../services/UserServices'
import { useMutationHooks } from "../../hook/useMutationHook";
//import Loading from "../../components/LoadingComponent/LoadingComponent";
import * as message from "../../components/Message/Message";  


const SignUpPage = () => {
  const navigate = useNavigate()

  const [isShowPassword, setIsShowPassword] = useState(false)
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleOnchangeEmail = (value) => {
    setEmail(value)
  }

  const handleOnchangePassword = (value) => {
    setPassword(value)
  }

  const handleOnchangeConfirmPassword = (value) => {
    setConfirmPassword(value)
  }

  const mutation = useMutationHooks(
    data => UserService.signupUser(data)
 )

 const {data, isLoading,  isSuccess, isError} = mutation

 useEffect(()=>{
  if(isSuccess){
    message.success()
    handleNavigateSignIn()
  }
  else if(isError){
    message.error()
  }
 },[ isSuccess, isError])

  const handleNavigateSignIn = () => {
    navigate('/sign-in')
  }

  const handleSignUp = () => {
    mutation.mutate({
      email, password, confirmPassword
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
      border: '1px solid rgb(192, 130, 97)',
      boxShadow: '2px 2px 2px #ccc',
    }}>
    
    <WrapperContainerLeft>
      <h1 style={{textTransform: 'uppercase', fontWeight:'bolder',color:'rgb(154, 59, 59)'}}>Xin chào</h1>
      <p style={{fontSize: '15px',color:'rgb(154, 59, 59)'}}>Mời bạn đăng kí tài khoản</p>


      <InputForm style={{marginBottom:'10px'}} 
      placeholder = "Hãy nhập email" 
      value={email} 
      onChange={handleOnchangeEmail}/>


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
              placeholder="Hãy nhập mật khẩu"
              style = {{marginBottom: '10px'}}
              type={isShowPassword ? "text" : "password"}
              value={password} 
              onChange={handleOnchangePassword}
            />
          </div>


          <div style={{ position: 'relative' }}>
          <span
            onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
            style={{
              zIndex: 10,
              position: 'absolute',
              top: '4px',
              right: '8px'
            }}
          >{
            isShowConfirmPassword ? (
                <EyeFilled />
              ) : (
                <EyeInvisibleFilled />
              )
            }
          </span>
          <InputForm placeholder="Nhập lại mât khẩu" 
          style = {{marginBottom: '10px'}}
          type={isShowConfirmPassword ? "text" : "password"}
          value={confirmPassword} 
          onChange={handleOnchangeConfirmPassword} />
        </div>

        {data?.status === 'ERR' && <span style={{color:'red', paddingTop:"10px"}}>{data?.message}</span>}
      <ButtonComponent
            disabled = {!email.length || !password.length || !confirmPassword.length}
            onClick = {handleSignUp}
            size={40}
            textButton={'Đăng ký'}
            styleTextButton={{color:'white'}}
            styleButton={{
              background: '#F2C84B',
              width: '220px',
              height: '50px',
              border: 'none',
              borderRadius: '4px',
              margin: '15px 0 10px 190px',
            }}
          ></ButtonComponent>

          <div style={{margin: '15px 0 10px 190px'}}>
          <p >Bạn đã có tài khoản ?<WrapperTextLight onClick={handleNavigateSignIn}> Đăng nhập</WrapperTextLight></p>
          </div>
    </WrapperContainerLeft>
    </div>
    </div>
  )
}

export default SignUpPage