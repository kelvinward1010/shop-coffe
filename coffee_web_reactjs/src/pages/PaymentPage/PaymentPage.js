import { Checkbox, Form, Radio } from 'antd'
import React, { useMemo, useState } from 'react'
import { Lable, WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperRadio, WrapperRight, WrapperStyleHeader, WrapperTotal } from './style';
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
import * as OrderService from '../../services/OrderServices'
import Loading from '../../components/LoadingComponent/LoadingComponent';
import * as message from "../../components/Message/Message"
import { updateUser } from '../../redux/slide/userSlide';
import { useNavigate } from 'react-router-dom';
import { PayPalButton } from "react-paypal-button-v2";
import * as PaymentServices from '../../services/PaymentServices'
import HeaderComponents from '../../components/HeaderComponents/HeaderComponents';
import FooterComponent from '../../components/FooterComponent/FooterComponent';


const PaymentPage= () => {
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)

  const [delivery, setDelivery] = useState('shopeefood')
  const [payment, setPayment] = useState('later_money')
  const navigate = useNavigate()
  const [sdkReady, setSdkReady] = useState(false)

  const [listChecked, setListChecked] = useState([])
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [stateUserDetails, setStateUserDetails] = useState({ 
    name: '',
    phone: '',
    address:'',
    city:'',
  })

  const [form] = Form.useForm()

  const dispatch = useDispatch()

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
    if(priceMemo > 200000){
      return 10000
    }
    else if(priceMemo === 0) {
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

  const handleAddOrder = () => {
    if(user?.access_token && order?.orderItemSelected && user?.name && user?.address && user?.phone
      && user?.city && priceMemo && user?.id){
        // eslint-disable-next-line no-unused-expressions
        mutationAddOrder.mutate(
          { 
            token: user?.access_token, 
            orderItems: order?.orderItemSelected, 
            fullName: user?.name, 
            address: user?.address, 
            phone: user?.phone, 
            city: user?.city,
            paymentMethod: payment,
            itemsPrice: priceMemo,
            shippingPrice: deliveryPriceMemo,
            totalPrice: totalPriceMemo,
            user: user?.id,
          }
        )
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

  const mutationAddOrder = useMutationHooks(
    (data) => {
      const { 
        token,
        ...rests} = data
      const res = OrderService.createOrder(
        {...rests},
        token,)
    return res
    }
  )

  const {isLoading, data} = mutationUpdate
  const {data: dataAdd,isLoading: isLoadingAddOrder, isSuccess, isError} = mutationAddOrder

  useEffect(() => {
    if(isSuccess && dataAdd?.status === 'OK'){
      const arrayOrdered = []
      order?.orderItemSelected?.forEach(element => {
        arrayOrdered.push(element.product)
      })
      dispatch(removeAllOrderProduct({listChecked: arrayOrdered}))
      message.success('Đặt hàng thành công')
      navigate('/orderSuccess',{
        state:{
          delivery,
          payment,
          order:order?.orderItemSelected,
          totalPriceMemo: totalPriceMemo
        }
      })
    }
    else if(isError){
      message.error()
    }
  },[isSuccess, isError])

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

  const onSuccessPaypal = (details, data) => {
    mutationAddOrder.mutate(
      { 
        token: user?.access_token, 
        orderItems: order?.orderItemSelected, 
        fullName: user?.name, 
        address: user?.address, 
        phone: user?.phone, 
        city: user?.city,
        paymentMethod: payment,
        itemsPrice: priceMemo,
        shippingPrice: deliveryPriceMemo,
        totalPrice: totalPriceMemo,
        user: user?.id,
        isPaid:  true,
        paidAt: details.update_time,
        email: user?.email
      }
    )
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

  const handleDilivery = (e) => {
    setDelivery(e.target.value)
  }

  const handlePayment = (e) => {
    setPayment(e.target.value)
  }

  const addPaypalScript = async () => {
    const {data} = await PaymentServices.getConfig()
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
    script.async = true;
    script.onload = () => {
      setSdkReady(true)
    }
    document.body.appendChild(script)
  }

  useEffect(()=>{
    if(!window.paypal){
      addPaypalScript()
    }
    else {
      setSdkReady(true)
    }
  },[])

  return (
    <div style={{ background: '#f5f5fa', with: '100%', height: '100vh' }}>
    <HeaderComponents isHiddenSearch />
    <hr style={{color:"rgb(192, 130, 97)", width:'90%', marginBottom:'50px'}}/>
    <div style={{marginBottom:'100px'}}>
    <Loading isLoading={isLoadingAddOrder}>
      <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
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
          }}>Chọn phương thức thanh toán</h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <WrapperLeft>
              <WrapperInfo>
                <div>
                  <Lable style={{fontSize:'15px', color:'rgb(192, 130, 97)'}}>Chọn dịch vụ giao hàng</Lable>
                  <WrapperRadio onChange={handleDilivery} value={delivery}>
                    <Radio value="shopeefood">Giao hàng bằng <span style={{ color: '#ea8500', fontWeight: 'bold' }}>SHOPEEFOOD</span></Radio>
                    <Radio value="gojek">Giao hàng bằng <span style={{ color: 'green', fontWeight: 'bold' }}>GO_JEK</span> </Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <Lable style={{fontSize:'15px', color:'rgb(192, 130, 97)'}}>Chọn phương thức thanh toán</Lable>
                  <WrapperRadio onChange={handlePayment} value={payment}>
                  <Radio value="later_money"> Thanh toán tiền mặt khi nhận hàng</Radio>
                  <Radio value="paypal"> Thanh toán tiền bằng Paypal</Radio>
                </WrapperRadio>
              </div>
            </WrapperInfo>
          </WrapperLeft>
          <WrapperRight>
            <div style={{ width: '100%' }}>
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
              <span onClick={handleChangeAddress} style={{color: 'blue', cursor:'pointer',fontSize:'13px', fontWeight:'bolder', marginLeft:'50px'}}> Thay đổi thông tin giao hàng</span>
          </WrapperInfo>
              <WrapperInfo>
              <span style={{fontSize:'15px', fontWeight:'bolder', color:'rgb(154, 59, 59)'}}>Giá sản phẩm</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Tạm tính</span>
                  <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(priceMemo)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Giảm giá</span>
                  <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(priceDiscountMemo)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Phí giao hàng</span>
                  <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(deliveryPriceMemo)}</span>
                </div>
              </WrapperInfo>
              <WrapperTotal>
                <span style={{fontSize:'15px',fontWeight:'bolder', color:'rgb(154, 59, 59)'}}>Tổng tiền</span>
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: '#9A3B3B', fontSize: '24px', fontWeight: 'bold' }}>{convertPrice(totalPriceMemo)}</span>
                </span>
              </WrapperTotal>
            </div>
            {payment === 'paypal' && sdkReady ? (
            <div style={{width:'320px'}}>
              <PayPalButton
                amount={Math.round(totalPriceMemo / 30000)}
                // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                  onSuccess={onSuccessPaypal}
              onError={() =>{
                alert('Lỗi kết nối')
              }}
            />              
            </div>
            ) : (
              <ButtonComponent
                onClick={() => handleAddOrder()}
                size={40}
                styleButton={{
                  background: '#9A3B3B',
                  height: '48px',
                  width: '320px',
                  border: 'none',
                  borderRadius: '4px'
                }}
                textButton={'Đặt hàng'}
                styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
              ></ButtonComponent>         
            )}
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
                span: 5,
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
                <InputComponent value={stateUserDetails.name} onChange={handleOnchangeDetails} name="name" />
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
                <InputComponent value={stateUserDetails.city} onChange={handleOnchangeDetails} name="city" />
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
                <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
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
                <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
              </Form.Item>
              <span style={{color: 'red'}}>Sau khi chọn 'OK'! Vui lòng đăng nhập lại tài khoản !</span>
            </Form>
          </Loading>

      </ModalComponent>
    </Loading>
    </div>
    <FooterComponent/>
        </div>
  )
}

export default PaymentPage
