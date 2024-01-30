import { Checkbox, Form } from 'antd'
import React, { useMemo, useState } from 'react'
import { WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperRight, WrapperStyleHeader, WrapperStyleHeaderDilivery, WrapperTotal } from './style';
import { DeleteOutlined, MinusOutlined, PlusOutlined} from '@ant-design/icons'
// import imag from '../../assets/images/test.webp'
import { WrapperInputNumber } from '../../components/ProductDetailComponent/style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '../../redux/slide/orderSlide';
import { convertPrice } from '../../utils';
import { useEffect } from 'react';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponet';
import { useMutationHooks } from '../../hook/useMutationHook';
import * as UserServices from '../../services/UserServices'
import Loading from '../../components/LoadingComponent/LoadingComponent';
import * as message from "../../components/Message/Message"
import { updateUser } from '../../redux/slide/userSlide';
import { useNavigate } from 'react-router-dom';
import Steps from '../../components/StepComponent/StepComponent';
import StepComponent from '../../components/StepComponent/StepComponent';
import HeaderComponents from '../../components/HeaderComponents/HeaderComponents';
import FooterComponent from '../../components/FooterComponent/FooterComponent';

const OrderPage = () => {
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)

  const [listChecked, setListChecked] = useState([])
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [stateUserDetails, setStateUserDetails] = useState({ 
    name: '',
    phone: '',
    address:'',
    city:'',
  })
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const dispatch = useDispatch()
  const onChange = (e) => {
    if(listChecked.includes(e.target.value)){
      const newListChecked = listChecked.filter((item) => item !== e.target.value)
      setListChecked(newListChecked)
    }else {
      setListChecked([...listChecked, e.target.value])
    }
  };

  const handleChangeCount = (type, idProduct, limited) => {
    if(type === 'increase') {
      if(!limited){
        dispatch(increaseAmount({idProduct}))
      }
    }else {
      if(!limited){
        dispatch(decreaseAmount({idProduct}))
      }
    }
  }

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({idProduct}))
  }

  const handleOnchangeCheckAll = (e) => {
    if(e.target.checked) {
      const newListChecked = []
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product)
      })
      setListChecked(newListChecked)
    }else {
      setListChecked([])
    }
  }

  useEffect(() => {
    dispatch(selectedOrder({listChecked}))
  }, [listChecked])

  useEffect(()=>{
    form.setFieldsValue(stateUserDetails)
  },[form,stateUserDetails])
  

  useEffect(() =>{
    if(isOpenModalUpdateInfo){
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone,
      })
    }
  },[isOpenModalUpdateInfo])

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true)
  }

  const priceMemo = useMemo(()=>{
    const result = order?.orderItemSelected?.reduce((total, cur) =>{
      return total + ((cur.price * cur.amount))
    },0)
    return result
  },[order])

  const priceDiscountMemo = useMemo(()=>{
    const result = order?.orderItemSelected?.reduce((total, cur) =>{
      const totalDiscount = cur.discount ? cur.discount : 0
      return total + (priceMemo * (totalDiscount * cur.amount) / 100)
    },0)
    if(Number(result)){
      return result
    }
    return 0
  },[order])

  const deliveryPriceMemo = useMemo(()=>{
    if(priceMemo >= 20000 && priceMemo < 50000){
      return 10000
    }
    else if( priceMemo >= 50000 || order?.orderItemSelected?.length === 0) {
      return 0
    }
    else{
      return 20000
    }
  },[priceMemo])

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(priceDiscountMemo) + Number(deliveryPriceMemo)
  },[priceMemo, priceDiscountMemo, priceMemo])

  const handleRemoveAllOrder = () => {
    if(listChecked?.length > 1){
      dispatch(removeAllOrderProduct({listChecked}))
    }
  }

  const handleAddCard = () => {
    if(!order?.orderItemSelected?.length){
      message.error('Vui lòng chọn sản phẩm ')
    }
    else if(!user?.phone || !user.address || !user.name || !user.city){ // Cái dấu ! này gây ra lỗi
      setIsOpenModalUpdateInfo(true)
    }
    else{
      navigate('/payment')
    }
  }

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { 
        id,
        token,
        ...rests} = data
      const res = UserServices.updateUser(
        id,
        {...rests},
        token,)
    return res
    }
  )

  const {isLoading, data} = mutationUpdate

  const handleCancelUpdate = () => {
    setStateUserDetails(
      {
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
      })
      form.resetFields()
    setIsOpenModalUpdateInfo(false)
  }
  const handleUpdateInfoUser = () => {
    const {name, address, city,phone} = stateUserDetails
    if(name && address && city && phone){
      mutationUpdate.mutate({id: user?.id, token: user?.access_token, ...stateUserDetails},{
        onSuccess: () => {
          dispatch(updateUser({name, address, city,phone}))
          setIsOpenModalUpdateInfo(false)
        }
      })
    }
  }

  const handleOnchangeDetails = (e) =>{
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }

  const itemsDelivery = [
    {
      title: '20.000 VND',
      description:'Dưới 20.000 VND',
    },
    {
      title: '10.000 VND',
      description:'Từ 20.000 VND đến dưới 50.000 VND',
    },
    {
      title: '0 VND',
      description:'Trên 50.000 VND',
    },
  ]

  return (
    <div style={{background: '#f5f5fa', with: '100%', height: '100vh'}}>
    <HeaderComponents isHiddenSearch />
    <hr style={{color:"rgb(192, 130, 97)", width:'90%', marginBottom:'50px'}}/>
    <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
        <h3 style={{
          fontSize: '20px', 
          fontWeight:'bolder', 
          color:'#9A3B3B', 
          textTransform:'uppercase',
          borderBottom: '2px solid #9A3B3B',
          marginBottom: '30px',
          padding: '10px',
          position: 'relative',
          bottom: '20px',
          left: '20px',
          width: '70%'
        }}>Giỏ hàng</h3>
        <div style={{ display: 'flex', justifyContent: 'center'}}>
          <WrapperLeft>
          <WrapperStyleHeaderDilivery>
            <StepComponent items={itemsDelivery} 
            current={deliveryPriceMemo === 10000 ? 2 : deliveryPriceMemo === 20000 ? 1 : order.orderItemSelected.length === 0 ? 0: 3}/>
          </WrapperStyleHeaderDilivery>
            <WrapperStyleHeader>
                <span style={{display: 'inline-block', width: '390px'}}>
                  <Checkbox onChange={handleOnchangeCheckAll} checked={listChecked?.length === order?.orderItems?.length}></Checkbox>
                  <span> Tất cả ({order?.orderItems?.length} sản phẩm)</span>
                </span>
                <div style={{flex:1,display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Đơn giá</span>
                  <span>Số lượng</span>
                  <span>Thành tiền</span>
                  <DeleteOutlined style={{cursor: 'pointer'}} onClick={handleRemoveAllOrder}/>
                </div>
            </WrapperStyleHeader>
            <WrapperListOrder>
              {order?.orderItems?.map((order) => {
                return (
                  <WrapperItemOrder key={order?.product}>
                <div style={{width: '390px', display: 'flex', alignItems: 'center', gap: 4}}> 
                  <Checkbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)}></Checkbox>
                  <img src={order?.image} style={{width: '77px', height: '79px', objectFit: 'cover'}}/>
                  <div style={{
                    width: 260,
                    overflow: 'hidden',
                    textOverflow:'ellipsis',
                    whiteSpace:'nowrap'
                  }}>{order?.name}</div>
                </div>
                <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>
                    <span style={{ fontSize: '13px', color: '#242424' }}>{convertPrice(order?.price)}</span>
                  </span>
                  <WrapperCountOrder>
                    <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease',order?.product, 
                    order?.amount === 1)}>
                        <MinusOutlined style={{ color: '#000', fontSize: '10px'}} />
                    </button>
                    <WrapperInputNumber defaultValue={order?.amount} value={order?.amount} size="small" min={1} max={order?.countInStock} />
                    <button style={{ border: 'none', ybackground: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase',order?.product,
                    order?.amount === order.countInStock, order?.amount === 1)}>
                        <PlusOutlined style={{ color: '#000', fontSize: '10px' }} />
                    </button>
                  </WrapperCountOrder>
                  <span style={{color: 'rgb(255, 66, 78)', fontSize: '13px', fontWeight: 500}}>{convertPrice(order?.price * order?.amount)}</span>
                  <DeleteOutlined style={{cursor: 'pointer'}} onClick={() => handleDeleteOrder(order?.product)}/>
                </div>
              </WrapperItemOrder>
                )
              })}
            </WrapperListOrder>
          </WrapperLeft>
          <WrapperRight>
          <div style={{width: '100%'}}>
          <WrapperInfo>
          <span style={{fontSize:'15px', fontWeight:'bolder', color:'rgb(154, 59, 59)'}}>Thông tin người đặt hàng</span>
              <div>
                <span style={{fontSize:'13px'}}>Họ và tên: </span>
                <span style={{fontWeight:'bold',fontSize:'13px'}}>{`${user.name}`}</span>
              </div>
              <div>
              <span style={{fontSize:'13px'}}>Địa chỉ: </span>
              <span style={{fontWeight:'bold',fontSize:'13px'}}>{`${user.address} ${user.city}`}</span>
            </div>
            <div>
            <span style={{fontSize:'13px'}}>Số điện thoại: </span>
            <span style={{fontWeight:'bold',fontSize:'13px'}}>{`${user.phone}`}</span>
          </div>
              <span onClick={handleChangeAddress} style={{color: 'blue', cursor:'pointer',fontSize:'13px',fontWeight:'bolder', marginLeft:'50px'}}> Thay đổi thông tin giao hàng</span>
          </WrapperInfo>
              <WrapperInfo>
              <span style={{fontSize:'15px', fontWeight:'bolder', color:'rgb(154, 59, 59)'}}>Giá sản phẩm</span>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between',fontSize:'13px'}}>
                  <span>Tạm tính</span>
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceMemo)}</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between',fontSize:'13px'}}>
                  <span>Giảm giá</span> 
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceDiscountMemo)}</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between',fontSize:'13px'}}>
                  <span>Phí giao hàng</span>
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(deliveryPriceMemo)}</span>
                </div>
              </WrapperInfo>
              <WrapperTotal>
                <span style={{fontSize:'15px',fontWeight:'bolder', color:'rgb(154, 59, 59)'}}>Tổng tiền</span>
                <span style={{display:'flex', flexDirection: 'column'}}>
                  <span style={{color: 'rgb(154, 59, 59)', fontSize: '20px', fontWeight: 'bold'}}>{convertPrice(totalPriceMemo)}</span>
                </span>
              </WrapperTotal>
            </div>
            <ButtonComponent
              onClick={() => handleAddCard()}
              size={40}
              styleButton={{
                  background: 'rgb(255, 57, 69)',
                  height: '48px',
                  width: '320px',
                  border: 'none',
                  borderRadius: '4px',
                  background: '#9A3B3B'
              }}
              textButton={'Mua hàng'}
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
          ></ButtonComponent>
          </WrapperRight>
        </div>
      </div>
      <ModalComponent
      title="Cập nhật thông tin giao hàng" 
      forceRender
      open={isOpenModalUpdateInfo} 
      onCancel={handleCancelUpdate}
      onOk={handleUpdateInfoUser}>
      <Loading isLoading={isLoading}>
      <Form
      name="basic"
      labelCol={{
        span: 9,
      }}
      wrapperCol={{
        span: 20,
      }}
      style={{
        maxWidth: 600,
      }}
      // onFinish={onUpdateUser}
      autoComplete="on"
      form={form}
    >
      <Form.Item
        label="Tên"
        name="name"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập tên !',
          },
        ]}
      >
        <InputComponent value={stateUserDetails.name} onChange={handleOnchangeDetails} name="name"/>
      </Form.Item>

      <Form.Item
      label="Thành phố"
      name="city"
      rules={[
        {
          required: true,
          message: 'Vui lòng nhập tên thành phố bạn đang ở!',
        },
      ]}
    >
      <InputComponent value={stateUserDetails.city} onChange={handleOnchangeDetails} name="city"/>
    </Form.Item>
  
  <Form.Item
  label="Số điện thoại"
  name="phone"
  rules={[
    {
      required: true,
      message: 'Vui lòng nhập số sao điện thoại !',
    },
  ]}
>
  <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone"/>
</Form.Item>

<Form.Item
label="Địa chỉ"
name="address"
rules={[
  {
    required: true,
    message: 'Vui lòng nhập đại chỉ!',
  },
]}
>
<InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address"/>
</Form.Item>
<span style={{color: 'red'}}>Sau khi chọn 'OK'! Vui lòng đăng nhập lại tài khoản !</span>
    </Form>   
      </Loading>

    </ModalComponent>
    <FooterComponent />

    </div>
  )
}

export default OrderPage