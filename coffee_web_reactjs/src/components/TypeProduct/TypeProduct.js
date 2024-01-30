import React from "react";
import { useNavigate } from "react-router-dom";
import {WrapperTypePRoduct} from './style'

// Component này là tên loại sản phẩm, nó nhận ra biến name và trả về Jsx có biến name và được hiển thị ở 
// trang HomePage
const TypeProduct = ({name}) => {
  const navigate = useNavigate()
  const handleNavigateType = (type) =>{
    navigate(`/product/${type.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ /g, '_')}`, {state: type})
  }
  return(
    <WrapperTypePRoduct style={{}} onClick={() => handleNavigateType(name)}>
      {name}
    </WrapperTypePRoduct>
  )
}

export default TypeProduct