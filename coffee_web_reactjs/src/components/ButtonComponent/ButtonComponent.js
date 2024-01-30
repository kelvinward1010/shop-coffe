import { Button } from "antd";
// Sử dụng để tạo ra nút bấm từ ant-design
import React from "react";
// Dùng để viết Jsx

// Component sẽ tạo ra nút bấm và nhận tất cả các thuộc tính được thêm vào nó
const ButtonComponent = ({size,styleButton,styleTextButton,textButton,disabled,...rest}) => {
  return(
    <Button
    style={{
      ...styleButton,
      background: disabled ? '#ccc' : styleButton.background
    }}
    size={size}
    {...rest}
    >
      <span style={styleTextButton}>{textButton}</span>
    </Button>
  )
}

export default ButtonComponent