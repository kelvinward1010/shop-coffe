import React from "react";
import ProductDetailComponent from "../../components/ProductDetailComponent/ProductDetailComponent";
import { useNavigate, useParams } from "react-router-dom";

//Trang này hiển thị kết quả tìm kiếm chi thiết 1 sản phẩm
const ProductDetailPage = () => {
  const navigate = useNavigate()
  const {id} = useParams()
  return(
    <div style={{width: '100%',background:'rgb(242, 236, 190)'}}>
    <div style={{ width: '1270px', height: '100%', margin: '0 auto'}} >
      <h5 style={{
        fontSize: '20px', 
        color:'#9A3B3B', 
        textTransform:'uppercase',
        borderBottom: '2px solid #9A3B3B',
        padding: '10px',
        width: 'fit-content',
        fontWeight: 'bolder'
      }}>
       Chi tiết sản phẩm
      </h5>
      <ProductDetailComponent idProduct={id} />
    </div>
  </div>
  )
}

export default ProductDetailPage