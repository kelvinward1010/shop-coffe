import { Col, Image, InputNumber } from "antd";
// Nạp InputNumber từ Ant-design
import styled from "styled-components";

export const WrapperStyleImageSmall = styled(Image)`
  height: 65px;
  width: 65px;
`

export const WrapperStyleColImage = styled(Col)`
  flex-basis: unset;
  display: flex;
`

export const WrapperStyleNameProduct = styled.h1`
  color: rgb(154, 59, 59);
  font-size: 25px;
  font-weight: bolder;
  line-height: 30px;
  word-break: break-word;
`

export const WrapperStyleTextSell = styled.span`
  font-size: 15px;
  line-height: 24px;
  color: rgb(120,120,120);
`

export const WrapperPriceProduct = styled.div`
  background: rgb(250,250,250);
  border-radius: 5px; 
  border: 1px solid rgb(154, 59, 59);
  margin: 20px 0;
`

export const WrapperPriceTextProduct = styled.h1`
  font-size: 30px;
  line-height: 40px;
  margin-right: 10px;
  font-weight: 500;
  padding: 10px;
  margin-top: 10px;
`

export const WrapperAddressProduct = styled.div`
  span.address {
    text-decoration: underline;
    font-size: 15px;
    line-height: 25px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  };
  span.change-address{
    color: rgb(11,116,229);
    font-size: 15px;
    line-height: 25px;
    font-weight: 500;
  }
`

export const WrapperQualityProduct = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  border-radius: 5px;
  width: 120px;
  border: 1px solid rgb(154, 59, 59);
  width: 100px;
`

export const WrapperInputNumber = styled(InputNumber)`
  &.ant-input-number.ant-input-number-sm{
    width: 40px;
    border-bottom: none;
    border-top: none;
    .ant-input-number-handle-wrap {
      display: none !important;
    }
  }
`