import { Col, Rate, Row } from "antd";
import { 
  WrapperStyleImageSmall,
  WrapperStyleColImage,
  WrapperStyleNameProduct,
  WrapperStyleTextSell, 
  WrapperPriceProduct, 
  WrapperPriceTextProduct,
  WrapperAddressProduct,
  WrapperQualityProduct,
  WrapperInputNumber,
} from './style'
import React, { useState } from "react";
import Blog2 from  "../../img/imgs/blog-2.jpeg";
// Nạp Blog2 từ folder ảnh imgs
import {PlusOutlined,MinusOutlined } from '@ant-design/icons';
// Nạp icon từ Ant-design
import ButtonComponent from "../ButtonComponent/ButtonComponent";
// Nạp ButtonComponent từ folder ButtonComponent
import * as ProductService from '../../services/ProductServices'
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addOrderProduct,resetOrder } from "../../redux/slide/orderSlide";
import { convertPrice, initFacebookSDK } from "../../utils";
import { useEffect } from "react";
import * as message from "../../components/Message/Message"
import LikeButtonComponent from "../LikebuttonComponent/LikebuttonComponent";
import CommentComponent from "../CommentComponent/CommentComponent";
import { useMemo } from "react";


const ProductDetailComponent = ({idProduct}) => {
  const [numProduct, setNumProduct] = useState(1)
  const user = useSelector((state) => state.user)
  const order = useSelector((state) => state.order)
  const [errorLimitOrder,setErrorLimitOrder] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const onChange = (value) =>{
    setNumProduct(Number(value))
  }

  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1]
    if(id){
      const res = await ProductService.getDetailsProduct(id) 
      return res.data
    }
  }

  useEffect(() => {
    initFacebookSDK()
  },[])
  
  useEffect(() => {
    const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
    if((orderRedux?.amount + numProduct) <= orderRedux?.countInStock || 
    (!orderRedux && productDetails?.countInStock > 0)){
      setErrorLimitOrder(false)
    }
    else if(productDetails?.countInStock === 0){
      setErrorLimitOrder(true)
    }
  },[numProduct])

  useEffect(() => {
    if(order.isSuccessOrder){
      message.success('Đã thêm vào giỏ hàng')
    }

    return () => {
      dispatch(resetOrder())
    }
  }, [order.isSuccessOrder])

  const handleChangeCount = (type, limited) => {
    if(type === 'tăng'){
      if(!limited){
        setNumProduct(numProduct + 1)
      }
    }else{
      if(!limited){
        setNumProduct(numProduct -1 )
      }
    }
  }

  const {data: productDetails} = useQuery(['products-details',idProduct], fetchGetDetailsProduct,{enabled : !!idProduct})
  const handleAddOrderProduct = () =>{
    if(!user?.id){
      navigate('/sign-in',{state: location?.pathname})
    }else{
    //   {
    //     name: { type: String, required: true },
    //     amount: { type: Number, required: true },
    //     image: { type: String, required: true },
    //     price: { type: Number, required: true },
    //     discount: { type: Number },
    //     product: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Product',
    //         required: true,
    //     },
    // },
    const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
    if((orderRedux?.amount + numProduct) <= orderRedux?.countInStock || 
    (!orderRedux && productDetails?.countInStock > 0)) {
      dispatch(addOrderProduct({
        orderItem:{
          name: productDetails?.name,
          amount: numProduct,
          image: productDetails?.image,
          price: productDetails?.price,
          product: productDetails?._id,
          discount: productDetails?.discount,
          countInStock: productDetails?.countInStock
        }
      })) 
    } else {
      setErrorLimitOrder(true)
    }
    }
  }

  return(
    <>
    <Row style={{padding:'16px',background:'white',borderRadius:'5px', marginBottom:'25px'}}>
      <Col span={12} style={{paddingRight:'40px',borderRight:'1px solid rgb(154, 59, 59)'}}>
        <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
        <div>
        <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating}/>
        <WrapperStyleTextSell style={{color:'rgb(192, 130, 97)'}}> | Đã bán được {productDetails?.selled} sản phẩm</WrapperStyleTextSell>
        </div>
        <WrapperPriceProduct>
          <WrapperPriceTextProduct style={{color:'rgb(154, 59, 59)'}}>{convertPrice(productDetails?.price)}</WrapperPriceTextProduct>
        </WrapperPriceProduct>
        <span style={{fontSize:'20px', fontWeight:'bolder',marginBottom: '10px', color:'rgb(154, 59, 59)'}}>Thông tin người đặt hàng</span>
        <div style={{marginTop:'25px',marginBottom:'25px'}}>
        <WrapperAddressProduct>
          <span>Tên đặt hàng: </span>
          <span className="name" style={{color:'rgb(154, 59, 59)', fontWeight:'bolder'}}>{user?.name}</span> 
        </WrapperAddressProduct>

        <WrapperAddressProduct>
          <span>Địa chỉ: </span>
          <span className="address" style={{color:'rgb(154, 59, 59)', fontWeight:'bolder'}}>{user?.address} {user?.city}</span> 
        </WrapperAddressProduct>
        
        <WrapperAddressProduct>
        <span>Số điện thoại </span>
        <span className="phone" style={{color:'rgb(154, 59, 59)', fontWeight:'bolder'}}>{user?.phone}</span>
        </WrapperAddressProduct>

        <WrapperAddressProduct>
        <span>Email: </span>
        <span className="email" style={{color:'rgb(154, 59, 59)', fontWeight:'bolder'}}>{user?.email}</span> 
      </WrapperAddressProduct> 
        </div>
        <LikeButtonComponent 
        dataHref={process.env.REACT_APP_IS_LOCAL ? 'https://developers.facebook.com/docs/plugins/' : window.location.href}/>
        <div style={{
          margin:'10px 0 20px', 
          padding: '10px 0',
          borderTop: '1px solid #F2C84B',
          borderBottom: '1px solid #F2C84B'
        }}>
          <div style={{marginBottom:'10px', color: 'rgb(154, 59, 59)', fontWeight:'bolder'}}>Số lượng</div>
          <WrapperQualityProduct>
          <button style={{border:'none', background: 'transparent', cursor: 'pointer'}} 
            onClick={() => handleChangeCount('giảm', numProduct === 1)}>
            <MinusOutlined style={{color:'black', fontSize:'20px'}}/>
          </button>
            <WrapperInputNumber onChange={onChange} defaultValue={1} 
            min={1} max={productDetails?.countInStock} 
            value={numProduct} size="small"/>
          <button style={{border:'none', background: 'transparent', cursor: 'pointer'}} 
            onClick={() => handleChangeCount('tăng', numProduct === productDetails?.countInStock)}>
            <PlusOutlined style={{color:'black', fontSize:'20px'}}/>
          </button>
          </WrapperQualityProduct>
        </div>
        <div style={{display:'flex', alignItems:'center',gap:'12px'}}>
              <div>
                <ButtonComponent
                  bordered = {false}
                  size={40}
                  textButton={'Chọn mua'}
                  onClick = {handleAddOrderProduct}
                  styleTextButton={{color:'white', fontWeight:'bolder'}}
                  styleButton={{
                    background: 'rgb(154, 59, 59)',
                    width: '220px',
                    height: '50px',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                ></ButtonComponent>
                  {errorLimitOrder && <div style={{color:'red'}}>Sản phẩm đã hết hàng</div>}
              </div>
        </div>
      </Col>
      <Col span={12}>
      <WrapperStyleImageSmall src={productDetails?.image} style={
        {width:'60%', 
         padding: '10px',
         marginLeft: '110px',
         marginTop: '10px'
        }} alt="image product"/>
    
    </Col>
    </Row>
    <CommentComponent 
    dataHref={process.env.REACT_APP_IS_LOCAL ? "https://developers.facebook.com/docs/plugins/comments#configurator" : window.location.href} 
    width='1270'/>
    </>
  )
}
export default ProductDetailComponent