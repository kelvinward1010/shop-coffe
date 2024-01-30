import { Checkbox, Form, Radio } from 'antd'
import React from 'react'
import { Lable, WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperContainer, WrapperValue, WrapperItemOrderInfo } from './style';
import { useDispatch, useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import Loading from '../../components/LoadingComponent/LoadingComponent';
import { useLocation } from 'react-router-dom';
import { orderContent } from '../../content';
import HeaderComponents from '../../components/HeaderComponents/HeaderComponents';
import FooterComponent from '../../components/FooterComponent/FooterComponent';


const OderSuccess= () => {
  const order = useSelector((state) => state.order)
  const location = useLocation()
  const {state} = location

  return (
    <div style={{ background: '#f5f5fa', with: '100%', height: '100vh' }}>
    <HeaderComponents isHiddenSearch />
    <hr style={{color:"rgb(192, 130, 97)", width:'90%', marginBottom:'50px'}}/>

    <Loading isLoading={false}>
      <div style={{ height: '100%', width: '1270px', marginBottom: '100px' }}>
          <h3 
          style={{
            fontSize: '20px', 
            fontWeight:'bolder', 
            color:'#9A3B3B', 
            textTransform:'uppercase',
            marginBottom: '10px',
            padding: '10px',
            position: 'relative',
            bottom: '20px',
            left: '65px',
            width: 'fit-content',
            borderBottom: '1px solid #9A3B3B'
          }}>Đặt hàng thành công !</h3>
          <div>
            <WrapperContainer style={{ display: 'flex', justifyContent: 'center' }}>
            <div>
              <WrapperInfo>
                <div>
                  <Lable style={{ fontSize: '15px', color: '#9A3B3B'}}>Phương thức giao hàng</Lable>
                  <WrapperValue>
                  Dịch vụ vận chuyển <span style={{ color: '#ea8500', fontWeight: 'bold' }}>{orderContent.delivery[state?.delivery]}</span>
                  </WrapperValue>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <Lable style={{ fontSize: '15px', color: '#9A3B3B' }}>Phương thức thanh toán</Lable>
                  <WrapperValue>
                    {orderContent.payment[state?.payment]}
                  </WrapperValue>
              </div>
            </WrapperInfo>
            </div>
            <WrapperItemOrderInfo key={order?.name}>
              {state.order?.map((order) => {
                return (
                  <WrapperItemOrder>
                  <div style={{width: 'fit-content', display: 'flex', alignItems: 'center', gap: 4}}> 
                    <img src={order.image}  style={{
                      width: '35%', 
                      height: 'auto', 
                      objectFit: 'cover',
                      border: '1px solid rgb(192, 130, 97)',
                      borderRadius: '5px',
                      padding: '10px'
                    }}/>
                    <div style={{
                      width: 260,
                      overflow: 'hidden',
                      textOverflow:'ellipsis',
                      whiteSpace:'nowrap',
                      fontSize: '20px',
                      fontWeight: 'bolder',
                      color:'rgb(192, 130, 97)'
                    }}>{order?.name}</div>
                  </div>
                  <div style={{flex: 1, display: 'flex', alignItems: 'center',gap:'10px'}}>
                    <span>
                      <span style={{ fontSize: '15px', color: '#9A3B3B',fontWeight:'bolder', width:'fit-content' }}>Giá tiền: </span>{convertPrice(order?.price)}
                    </span>
                    <span>
                    <span style={{ fontSize: '15px', color: '#9A3B3B',fontWeight:'bolder', width:'fit-content' }}>Số lượng: </span>{order?.amount}
                  </span>
                  </div>
                  </WrapperItemOrder>
                  )
                })}
                </WrapperItemOrderInfo>
                </WrapperContainer>
                </div>
                <div>
                  <span style={
                    { 
                      fontSize: '20px', 
                      color: 'rgb(154, 59, 59)',
                      fontWeight:'bolder', 
                      position:'relative',
                      left: '900px',
                      margin:'20px'
                    }}>
                  Tổng tiền: {convertPrice(state?.totalPriceMemo)}</span>
                </div>
      </div>
      <h3 
      style={{
        fontSize: '15px', 
        fontWeight:'bolder', 
        color:'#9A3B3B', 
        marginBottom: '10px',
        padding: '10px',
        position: 'relative',
        bottom: '20px',
        left: '65px',
        width: 'fit-content',
      }}>Chúng tôi đã gửi thông báo đến email của bạn !</h3>
    </Loading>
    <FooterComponent/>
        </div>
  )
}

export default OderSuccess
