import { Upload } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled.h1`
  color: rgb(154, 59, 59);
  font-size: 20px;
  text-transform: uppercase;
  text-align: center;
  padding: 20px;
  font-weight: bolder;
`
export const WrapperContentProfile = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  width: 600px;
  margin: 0 auto;
  padding: 30px;
  border-radius: 10px;
  gap: 30px;
  border: 2px rgb(154, 59, 59) solid;
  background-color: white;
`

export const WrapperLabel = styled.div`
  color: black;
  font-size: 12px;
  line-height: 30px;
  font-weight: 600;
  width: 80px;
  text-align: left;
`

export const WrapperInput = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`

export const WrapperUploadFile = styled(Upload)`
    & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
        width: 60px;
        height: 60px;
        border-radius: 50%;
    }
    & .ant-upload-list-item-info {
        display: none
    }
`