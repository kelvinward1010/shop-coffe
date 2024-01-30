import React from "react";
import CardComponent from "../../components/CardComponent/CardComponent";
import SlideComponent from "../../components/SlideComponent/SlideComponent";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import { WrapperTypeProduct } from "./style";
import  Slide1  from "../../img/imgs/Slide1.jpg";
import  Slide2  from "../../img/imgs/Slide2.jpg";
import  Slide3  from "../../img/imgs/Slide3.jpg";
// Nhập ảnh từ folder img
import { WrapperButtonMore, WrapperProduct } from "./style";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from '../../services/ProductServices'
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import FooterComponent from "../../components/FooterComponent/FooterComponent";

// Page này là giao diện của trang web
const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const [limit, setLimit] = useState(5)
  const [typeProducts, setTypeProducts] = useState([])
  const fetchProductAll = async (context) =>{
    const limit = context?.queryKey && context?.queryKey[1]
    const search = context?.queryKey && context?.queryKey[2]
    const res =  await ProductService.getAllProduct(search, limit)
      return res
  }
  
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if(res?.status === 'OK'){
      setTypeProducts(res?.data)
    }
  }

  const {data: products,isPreviousData} = useQuery(['products',limit,searchProduct], fetchProductAll,{retry: 3, retryDelay: 1000, keepPreviousData: true})

  useEffect(() => {
    fetchAllTypeProduct()
  },[])

  return (
    <div style={{padding:'20px',background:'rgb(242, 236, 190)'}}>
    <div style={{margin: '0 auto', width: '1270px'}}>
    <WrapperTypeProduct>
    {typeProducts.map((item)=>{ //  Sử dụng hàm map để render dữ liệu ra màn hình
      return(
        <TypeProduct name={item} key={item}/>
      )
    })}
    </WrapperTypeProduct>
    </div>
    <div className="body" style={{width:'90%', margin:'0 auto'}}>
    <div id="container" style={{height:'auto',width:'1270px', margin:'0 auto'}}>
    <SlideComponent arrImages={[Slide1, Slide2, Slide3]}/>
    <div style={
      {color: 'white', background:"rgb(211, 117, 107)", fontSize:'20px', margin:'25px 450px', 
      width:'fit-content', padding:'15px', textTransform:'uppercase'}}>
        Sản phẩm của chúng tôi
    </div>
    <WrapperProduct>
    {products?.data?.map((product)=>{
      return(
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
    <div style={{width: '100%',display:'flex',justifyContent: 'center',marginTop:'10px'}}>
    <WrapperButtonMore textButton={isPreviousData ? 'Tải thêm' : 'Xem thêm'} type="outline" 
    styleButton={{
      border:'1px solid rgb(11,116,229)',
      width:'240px',
      height:'38px',
      borderRadius:'4px',
      marginRight:'535px'
    }}

    disabled={products?.total === products?.data?.length || products.totalPage === 1}
    styleTextButton={{fontWeight: 500, color: products?.total === products?.data?.length && '#fff'}}
    onClick = {() => setLimit((prev) => prev + 5)}
    />
    </div>
    </div>
    </div>
    <FooterComponent />
    </div>
  )
}

export default HomePage