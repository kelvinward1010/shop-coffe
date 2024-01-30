import styled from 'styled-components'
// Đọc dữ liệu css từ styled-components
import { Row } from 'antd'
import { Link } from 'react-router-dom'
// Phân chia hàng của Ant-design

export const WrapperHeader = styled(Row)`
  padding: 10px 120px;
  align-items: center;
  gap: 15px;
  flex-wrap: nowrap;
  width: 90%;
  margin: 0 auto;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  height: auto;
  margin: 10px;
`

export const WrapperText = styled(Link)`
  font-size: 25px;
  color: #D3756B;
  font-weight: bold;
  font-family: cursive;
  text-align: left;
  padding: 10px;
  border-radius: 10px;

  &:hover{
    background: #D3756B;
    color: white;
  }
  
`

export const WrapperHeaderAccout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(167, 93, 93);
  font-weight: bolder;
  font-size: 12px;
  gap: 5px;
  padding: 7px;
  width: fit-content;
  border: 1px #D3756B solid;
  border-radius: 10px;
  
  &:hover{
    background: #D3756B;
    color: white;
  }
`

export const WrapperTextHeaderSmall = styled.span`
  font-size: 12px;
  white-space: nowrap;
  color: rgb(167, 93, 93); 
  font-weight: bolder;
  margin-left: 10px;
`

export const WrapperContentPopup = styled.p`
  cursor: pointer;
  &:hover{
    background: red;
    color: white;
  }
`

export const WrapperShop = styled.div`
  width: fit-content;
  border: 1px #D3756B solid;
  padding: 5px;
  border-radius: 10px;
  &:hover{
    background: #D3756B;
    color: white;
  }
`