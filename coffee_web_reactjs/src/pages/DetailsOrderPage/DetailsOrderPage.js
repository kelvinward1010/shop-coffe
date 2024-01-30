/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import { WrapperAllPrice, WrapperContentInfo, WrapperHeaderUser, WrapperInfoUser, WrapperItem, WrapperItemLabel, WrapperLabel, WrapperNameProduct, WrapperProduct, WrapperStyleContent } from './style'
import { useLocation, useParams } from 'react-router-dom'
import * as OrderService from '../../services/OrderServices'
import { useQuery } from '@tanstack/react-query'
import { orderContent } from '../../content'
import { convertPrice } from '../../utils'
import { useMemo } from 'react'
import Loading from '../../components/LoadingComponent/LoadingComponent'
import HeaderComponents from '../../components/HeaderComponents/HeaderComponents'
import FooterComponent from '../../components/FooterComponent/FooterComponent';


const DetailsOrderPage = () => {
  const params = useParams()
  const location = useLocation()
  const { state } = location
  const { id } = params

  const fetchDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id, state?.token)
    return res.data
  }

  const queryOrder = useQuery({ queryKey: ['orders-details'], queryFn: fetchDetailsOrder }, {
    enabled: id
  })
  const { isLoading, data } = queryOrder

  const priceMemo = useMemo(() => {
    const result = data?.orderItems?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    },0)
    return result
  },[data])

  console.log('data', data);
  return(
    <Loading isLoading={isLoading}>
    <HeaderComponents isHiddenSearch />
    <div style={{width: '100%', height: 'auto',padding:'20px', background: '#f5f5fa'}}>
     <div style={{ width: '1270px', marginBottom: '150px'}}>
       <h4 style={{
        fontSize: '20px', 
        fontWeight:'bolder', 
        color:'#9A3B3B', 
        textTransform:'uppercase',
        borderBottom: '2px solid #9A3B3B',
        marginBottom: '20px',
        padding: '10px',
        width: 'fit-content', 
        marginLeft: '100px'
      }}>Chi tiết đơn hàng</h4>
      <div style={{display:'flex', marginLeft: '100px'}}>
      <WrapperHeaderUser>
        <WrapperInfoUser>
          <WrapperLabel>Địa chỉ người nhận</WrapperLabel>
          <WrapperContentInfo>
            <div className='name-info'>Họ tên: <span style={{color:'#9A3B3B',fontWeight:'bolder'}}>{data?.shippingAddress?.fullName}</span></div>
            <div className='address-info'>Địa chỉ: <span style={{color:'#9A3B3B',fontWeight:'bolder'}}> 
            {`${data?.shippingAddress?.address} ${data?.shippingAddress?.city}`}
            </span>
            </div>
            <div className='phone-info'>Điện thoại: <span style={{color:'#9A3B3B',fontWeight:'bolder'}}>{data?.shippingAddress?.phone}</span></div>
          </WrapperContentInfo>
        </WrapperInfoUser>

        <WrapperInfoUser>
          <WrapperLabel>Thông tin đơn hàng</WrapperLabel>
          <WrapperContentInfo>
            <div className='payment-info'>Hình thức thanh toán: <span style={{color:'#9A3B3B',fontWeight:'bolder'}}>{orderContent.payment[data?.paymentMethod]}</span></div>
            <div className='status-payment'>Trạng thái thanh toán: <span style={{color:'#9A3B3B',fontWeight:'bolder'}}>{data?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</span></div>
            <div className='delivery-fee'>Trạng thái vận chuyển: <span style={{color:'#9A3B3B',fontWeight:'bolder'}}>{data?.isDelivered ? 'Đã giao hàng' : 'Đang chuyển hàng'}</span></div>
          </WrapperContentInfo>
        </WrapperInfoUser>
      </WrapperHeaderUser>
      <WrapperStyleContent>
        <tr>
          <WrapperItemLabel>Sản phẩm</WrapperItemLabel>
          <WrapperItemLabel>Giá</WrapperItemLabel>
          <WrapperItemLabel>Số lượng</WrapperItemLabel>
          <WrapperItemLabel>Giảm giá</WrapperItemLabel>
        </tr>

          {data?.orderItems?.map((order) => {
            return (
              <tr>
                <WrapperItem>
                  <img src={order?.image} 
                    style={{
                      objectFit: 'cover',
                      border: '1px solid rgb(238, 238, 238)',
                      padding: '2px',
                      width: "30%"
                    }}
                  />
                  <div style={{
                    overflow: 'hidden',
                    textOverflow:'ellipsis',
                    whiteSpace:'nowrap',
                    marginLeft: '10px',
                  }}>{order?.name}</div>
                </WrapperItem>
                <WrapperItem>{convertPrice(order?.price)}</WrapperItem>
                <WrapperItem>{order?.amount}</WrapperItem>
                <WrapperItem>{order?.discount ? convertPrice(priceMemo*order?.discount / 100) : '0 VND'}</WrapperItem>
              </tr>
            )
          })}
      </WrapperStyleContent>
   </div>

        <table style={{  
          border: '1px solid black',
          borderCollapse: 'collapse',
          marginLeft: '800px',
          marginTop: '50px'}}>
        <tr>
          <th style={{  
            border: '1px solid black',
            borderCollapse: 'collapse',
            padding: '0 50px'}}>Tạm tính</th>
          <th style={{  
            border: '1px solid black',
            borderCollapse: 'collapse',
            padding: '0 50px'}}>Phí vận chuyển</th>
          <th style={{  
            border: '1px solid black',
            borderCollapse: 'collapse',
            padding: '0 50px'}}>Tổng cộng</th>
        </tr>
        <tr>
          <td style={{  
            border: '1px solid black',
            borderCollapse: 'collapse',
            padding: '0 50px'}}>{convertPrice(data?.shippingPrice)}</td>
          <td style={{  
            border: '1px solid black',
            borderCollapse: 'collapse',
            padding: '0 50px'}}>{convertPrice(priceMemo)}</td>
          <td style={{  
            border: '1px solid black',
            borderCollapse: 'collapse',
            padding: '0 50px'}}>{convertPrice(data?.totalPrice)}</td>
        </tr>
    </table>
     </div>
     <FooterComponent />
   </div>
  </Loading>
  )
}

export default DetailsOrderPage