import styled from "styled-components";
import { Card } from "antd";
// Tạo sẵn khung thể sản phẩm từ Ant-design

export const WrapperCardStyle = styled(Card)`
  width: 200px;
  & img {
    padding: 10px;
    height: 200px;
    width: 110px;
  }
  position: relative;
  background-color: ${props => props.disabled ? '#ccc' : '#fff'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
`

export const StyleNameProduct = styled.div`
  font-size: 15px;
  font-weight: 400;
  line-height: 15px;
  color: #A75D5D;
  font-weight: 400;
`

export const WrapperReportText = styled.div`
  font-size: 10px;
  color: #A75D5D;
  display: flex;
  align-items: center;
  margin: 6px 0 0;
`

export const WrapperPriceText = styled.div`
  color: #A75D5D;
  font-size: 16px;
  font-weight: 500;
`

export const WrapperDiscountText = styled.span`
  color: #A75D5D;
  font-size: 12px;
  font-weight: 500;
`

export const WrapperStyleTextSell = styled.span`
  font-size: 15px;
  line-height: 24px;
  color: #A75D5D;
`