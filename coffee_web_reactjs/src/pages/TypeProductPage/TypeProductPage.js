import React from "react";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
// Nạp NavbarComponent từ folder NavbarComponent
import CardComponent from "../../components/CardComponent/CardComponent";
// Nạp CardComponent từ folder CardComponent
import { Row, Pagination, Col } from "antd";
// Pagination tạo ra một mục lục đánh số để chuyển trang
import {WrapperProduct,WrapperNavbar} from './style'
import { useLocation } from "react-router-dom";
import * as ProductService from '../../services/ProductServices'
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import FooterComponent from "../../components/FooterComponent/FooterComponent";

// Component này tạo ra trang danh sách sản phẩm
const TypeProductPage =()=>{
  const searchProduct = useSelector((state) => state?.product?.search)
  const {state} = useLocation()
  const [products, setProducts] = useState([])
  const [paginate, setPaginate] = useState({
    page:0,
    limit: 10,
    total: 1,
  })
  const fetchProductType = async (type,page, limit) => {
    const res = await ProductService.getProductType(type, page, limit)
    if(res?.status === 'OK'){
      setProducts(res?.data)
      setPaginate({...paginate, total:res?.totalPage})
    }else{

    }
  }

  useEffect(() =>{
    if(state){
      fetchProductType(state, paginate.page, paginate.limit)
    }
  },[state,paginate.page, paginate.limit])

  const onChange = (current, pageSize) => {
    setPaginate({...paginate,page: current -1, limit: pageSize })
  }
  return (
    <div style={{width:'100%', height: 'calc(100vh-64px)'}}>
    <div style={{width: '1270px', margin:'0 auto', height: 'calc(100%-20px)', background:'rgb(242, 236, 190)', marginBottom:'30px'}}>
    <Row style={{flexWrap:"nowrap", paddingTop:'10px'}}>
    <WrapperNavbar span={4}>
      <NavbarComponent/>
    </WrapperNavbar>
    <Col span={20} style={{display: 'flex', flexDirection:'column', justifyContent:'space-between'}}>
    <WrapperProduct span={20}>
      {products?.filter((pro) => {
        if(searchProduct === ''){
          return pro
        }
        else if(pro?.name?.toLowerCase()?.includes(searchProduct?.toLowerCase())){
          return pro
        }
      })?.map((product)=>{
        return (
          <CardComponent 
          key={product._id} 
          countInStock={product.countInStock} 
          description={product.description}
          image={product.image}
          name={product.name}
          price={product.price}
          rating={product.rating}
          type={product.type}
          selled={product.selled}
          discount={product.discount}
          id={product._id}
          />
        )
      })}
    </WrapperProduct>
    <Pagination showQuickJumper defaultCurrent={paginate.page + 1} total={paginate?.total} onChange={onChange} style={{
      margin: '40px 0',
      border: '1px solid white',
      width: 'fit-content',
      background: 'rgb(192, 130, 97)',
      position: 'relative',
      left: '350px'
    }}/>
    </Col>
  </Row>
    </div>
    <FooterComponent />

    </div>
  )
}

export default TypeProductPage