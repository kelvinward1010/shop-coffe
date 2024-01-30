/* eslint-disable jsx-a11y/alt-text */
import React,{ useEffect, useState } from 'react'
import Loading from '../../components/LoadingComponent/LoadingComponent';
import { useQuery } from '@tanstack/react-query';
import * as OrderService from '../../services/OrderServices'
import { useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import { WrapperItemOrder, WrapperListOrder, WrapperHeaderItem, WrapperFooterItem, WrapperContainer, WrapperStatus } from './style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutationHooks } from '../../hook/useMutationHook';
import * as message from "../../components/Message/Message"
import HeaderComponents from '../../components/HeaderComponents/HeaderComponents';
import FooterComponent from '../../components/FooterComponent/FooterComponent';


const MyOrderPage = () => {
  const location = useLocation()
  const {state} = location
  const navigate = useNavigate()
  const fetchMyOrder = async () => {
      const res = await OrderService.getOrderByUserId(state?.id, state?.token)
      return res.data
  }

  const queryOrder = useQuery({ queryKey: ['orders'], queryFn: fetchMyOrder }, {
    enabled: state?.id && state?.token
  })
  const { isLoading, data } = queryOrder

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`,{
      state: {
        token: state?.token
      }
    })
  }

  const mutation = useMutationHooks(
    (data) => {
      const {id, token, orderItems} = data
      const res = OrderService.cancelOrder(id,token, orderItems)
      return res
    }
  )

  const handleCancelOrder = (order) => {
    mutation.mutate({id : order._id, token: state?.token, orderItems: order?.orderItems },{
      onSuccess: () => {
        queryOrder.refetch()
      }
    })
  }

  const {isLoading: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancel, data: dataCancel} = mutation

  useEffect(()=>{
    if(isSuccessCancel && dataCancel?.status === 'OK'){
      message.success()
    } 
    else if (isErrorCancel) {
      message.error()
    }
  },[isErrorCancel,isSuccessCancel])

  const renderProduct = (data) => {
    return data?.map((order) => {
      return <WrapperHeaderItem key={order?._id}> 
            <img src={order?.image} 
              style={{
                width: '70px', 
                height: '70px', 
                objectFit: 'cover',
                border: '1px solid #9A3B3B',
                borderRadius: '5px',
                padding: '2px'
              }}
            />
            <div style={{
              width: 260,
              overflow: 'hidden',
              textOverflow:'ellipsis',
              whiteSpace:'nowrap',
              marginLeft: '10px',
              fontWeight:'bolder',
              color:'rgb(154, 59, 59)'
            }}>{order?.name}</div>
            <span style={{ fontSize: '13px', color: '#242424',marginLeft: 'auto',fontWeight:'bolder' }}>{convertPrice(order?.price)}</span>
          </WrapperHeaderItem>
        })
  }

  return (
    <Loading isLoading={isLoading || isLoadingCancel}>
    <HeaderComponents isHiddenSearch />
      <WrapperContainer>
        <div style={{height: '100%', width: '1270px', margin: '0 auto', paddingBottom:'30px'}}>
          <h4 style={{
            fontSize: '20px', 
            fontWeight:'bolder', 
            color:'#9A3B3B', 
            textTransform:'uppercase',
            borderBottom: '2px solid #9A3B3B',
            margin: '0px auto',
            padding: '10px',
            width: 'fit-content'
          }}>Đơn hàng của tôi</h4>
          <WrapperListOrder>
            {data?.map((order) => {
              return (
                <WrapperItemOrder key={order?._id}>
                  <WrapperStatus>
                    <span style={{fontSize: '14px', fontWeight: 'bold',color:'#9A3B3B', }}>Trạng thái đơn hàng</span>
                    <div><span style={{color: 'rgb(255, 66, 78)', fontWeight:'bolder'}}>Giao hàng: </span>{`${order.isDelivered ? 'Đã giao hàng': 'Đang giao hàng'}`}</div>
                    <div><span style={{color: 'rgb(255, 66, 78)', fontWeight:'bolder'}}>Thanh toán: </span>{`${order.isPaid ? 'Đã thanh toán': 'Chưa thanh toán'}`}</div>
                  </WrapperStatus>
                  {renderProduct(order?.orderItems)}
                  <WrapperFooterItem>
                    <div>
                      <span style={{fontWeight:'bolder',color:'rgb(154, 59, 59)'}}>Tổng tiền: </span>
                      <span 
                        style={{ fontSize: '13px', color: 'rgb(56, 56, 61)',fontWeight: 700 }}
                      >{convertPrice(order?.totalPrice)}</span>
                    </div>
                    <div style={{display: 'flex', gap: '10px'}}>
                    <ButtonComponent
                        onClick={() => handleCancelOrder(order)}
                        size={40}
                        styleButton={{
                            height: '36px',
                            border: '1px solid rgb(154, 59, 59)',
                            borderRadius: '4px',
                            fontWeight:'bolder',
                        }}
                        textButton={'Hủy đơn hàng'}
                        styleTextButton={{ color: 'rgb(154, 59, 59)', fontSize: '14px' }}
                      >
                      </ButtonComponent>
                      <ButtonComponent
                        onClick={() => handleDetailsOrder(order?._id)}
                        size={40}
                        styleButton={{
                            height: '36px',
                            border: '1px solid rgb(154, 59, 59)',
                            borderRadius: '4px',
                            fontWeight:'bolder',
                        }}
                        textButton={'Xem chi tiết'}
                        styleTextButton={{ color: 'rgb(154, 59, 59)', fontSize: '14px' }}
                      >
                      </ButtonComponent>
                    </div>
                  </WrapperFooterItem>
                </WrapperItemOrder>
              )
            })}
          </WrapperListOrder>
        </div>
      </WrapperContainer>
      <FooterComponent />
    </Loading>
  )
}

export default MyOrderPage