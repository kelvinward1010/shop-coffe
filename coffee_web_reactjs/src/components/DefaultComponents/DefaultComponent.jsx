import React from "react";
import HeaderComponents from "../HeaderComponents/HeaderComponents";
// Nhập dữ liệu HeaderComponents từ file HeaderComponents

// Đây là component mặc định khi truy cập hoặc chuyển trang web
const DefaultComponents = ({children}) => {
  return (
    <div><HeaderComponents />
    {children}
    </div>
  )
}

export default DefaultComponents