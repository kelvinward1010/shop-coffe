import React, { useEffect, useState } from "react";
import { WrapperHeader, WrapperContentProfile, WrapperLabel, WrapperInput, WrapperUploadFile } from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from '../../services/UserServices'
import { useMutationHooks } from "../../hook/useMutationHook";
import { Button, Upload, message } from "antd";
import { updateUser } from "../../redux/slide/userSlide";
import { UploadOutlined} from '@ant-design/icons'
import { getBase64 } from "../../utils";
import HeaderComponents from "../../components/HeaderComponents/HeaderComponents";
import FooterComponent from "../../components/FooterComponent/FooterComponent";


const ProfilePage = () => {
  const user = useSelector((state)=> state.user) 
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [avatar, setAvatar] = useState('')
  const mutation = useMutationHooks(
    (data) => {
      const {id,access_token, ...rests} = data
      UserService.updateUser(id, rests, access_token)
    }
  )
  const dispatch = useDispatch()
  const {data, isSuccess, isError} = mutation

  useEffect(()=>{
    setEmail(user?.email)
    setName(user?.name)
    setPhone(user?.phone)
    setAddress(user?.address)
    setAvatar(user?.avatar)
  },[user])

  useEffect(() => {
    if (isSuccess) {
        message.success()
        handleGetDetailsUser(user?.id, user?.access_token)
    } else if (isError) {
        message.error()
    }
}, [isSuccess, isError])

const handleGetDetailsUser = async (id, token) => {
  const res = await UserService.getDetailsUser(id, token)
  dispatch(updateUser({ ...res?.data, access_token: token }))
}
  const handleOnchangeEmail = (value) =>{
    setEmail(value)
  }
  const handleOnchangeName = (value) =>{
    setName(value)
  }
  const handleOnchangePhone = (value) =>{
    setPhone(value)
  }
  const handleOnchangeAddress = (value) =>{
    setAddress(value)
  }
  const handleOnchangeAvatar = async ({fileList}) =>{
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setAvatar(file.preview)
  }

  const handleUpdate = () =>{
   mutation.mutate({id: user?.id, email, phone, name, avatar,address, access_token: user?.access_token})
 
  }

  return(
    <div style={{width: '100%', margin: '0 auto',height:'auto'}}>
    <HeaderComponents isHiddenSearch />
    <hr style={{color: 'rgb(154, 59, 59)'}}/>
    <div style={{paddingBottom:'30px',marginBottom:'30px', background:'rgb(242, 236, 190)'}}>
    <WrapperHeader>Thông tin người dùng</WrapperHeader>
        <WrapperContentProfile>
        <WrapperInput>
            <WrapperLabel htmlFor='Name'>Tên</WrapperLabel>
            <InputForm style={{width:'300px'}} value={name} onChange={handleOnchangeName} id='email'/>
            <ButtonComponent
            onClick = {handleUpdate}
                  size={40}
                  textButton={'Cập nhật'}
                  styleTextButton={{color:'black', fontSize:'15px',fontWeight: '700'}}
                  styleButton={{
                    width: 'fit-content',
                    height: '30px',
                    border: 'solid 1px black',
                    borderRadius: '5px',
                    padding: '1px 5px 5px '
                  }}
            ></ButtonComponent>
        </WrapperInput>

        <WrapperInput>
        <WrapperLabel htmlFor='email'>Email</WrapperLabel>
        <InputForm style={{width:'300px'}} value={email} onChange={handleOnchangeEmail} id='email'/>
        <ButtonComponent
        onClick = {handleUpdate}
              size={40}
              textButton={'Cập nhật'}
              styleTextButton={{color:'black', fontSize:'15px',fontWeight: '700'}}
              styleButton={{
                width: 'fit-content',
                height: '30px',
                border: 'solid 1px black',
                borderRadius: '5px',
                padding: '1px 5px 5px '
              }}
        ></ButtonComponent>
        </WrapperInput>

        <WrapperInput>
        <WrapperLabel htmlFor='phone'>Điện thoại</WrapperLabel>
        <InputForm style={{width:'300px'}} value={phone} onChange={handleOnchangePhone} id='email'/>
        <ButtonComponent
        onClick = {handleUpdate}
          size={40}
          textButton={'Cập nhật'}
          styleTextButton={{color:'black', fontSize:'15px',fontWeight: '700'}}
          styleButton={{
            width: 'fit-content',
            height: '30px',
            border: 'solid 1px black',
            borderRadius: '5px',
            padding: '1px 5px 5px '
          }}
        ></ButtonComponent>
        </WrapperInput>

        <WrapperInput>
        <WrapperLabel htmlFor='address'>Địa chỉ</WrapperLabel>
        <InputForm style={{width:'300px'}} value={address} onChange={handleOnchangeAddress} id='email'/>
        <ButtonComponent
        onClick = {handleUpdate}
        size={40}
        textButton={'Cập nhật'}
        styleTextButton={{color:'black', fontSize:'15px',fontWeight: '700'}}
        styleButton={{
          width: 'fit-content',
          height: '30px',
          border: 'solid 1px black',
          borderRadius: '5px',
          padding: '1px 5px 5px '
        }}
        ></ButtonComponent>
        </WrapperInput>

        <WrapperInput>
        <WrapperLabel htmlFor='avatar'>Hình đại diện</WrapperLabel>
        <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
        <Button icon={<UploadOutlined />}>Select File</Button>
        </WrapperUploadFile>
        {avatar && (
        <img src={avatar} style={{
        height: '60px',
        width: '60px',
        borderRadius: '50%',
        objectFit: 'cover'
        }} alt="avatar"/>
        )}
        <ButtonComponent
        onClick = {handleUpdate}
        size={40}
        textButton={'Cập nhật'}
        styleTextButton={{color:'black', fontSize:'15px',fontWeight: '700'}}
        styleButton={{
          width: 'fit-content',
          height: '30px',
          border: 'solid 1px black',
          borderRadius: '5px',
          padding: '1px 5px 5px '
        }}
        ></ButtonComponent>
        </WrapperInput>
        </WrapperContentProfile>
        </div>
      <FooterComponent/>
    </div>
  )
}

export default ProfilePage