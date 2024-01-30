import styled from "styled-components"

export const WrapperHeaderUser = styled.div`
  align-items: center;
  justify-content: space-between;
  margin-right: 20px;
  padding-right: 20px;
  border-right: 2px solid #9A3B3B;
`

export const WrapperInfoUser = styled.div`
  margin-bottom: 20px;
  border: 1px solid #9A3B3B;
  padding: 10px;
`

export const WrapperLabel = styled.div`
  color: #C08261;
  font-weight: bold;
  font-size: 13px;
  text-transform: uppercase;
  margin-bottom: 15px;
`
export const WrapperContentInfo = styled.div`
  height: 118px;
  width: 320px;
  background-color: #fff;
  border-radius: 6px;
  padding: 10px;
  border: 1px solid #9A3B3B;
`

export const WrapperStyleContent = styled.table`
  display:flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  width: fit-content;
  border: 1px solid rgb(154, 59, 59);
  height: fit-content;
`

export const WrapperProduct = styled.div`
  display:flex;
  align-items:flex-start;
  margin-top: 10px;
`

export const WrapperNameProduct = styled.div`
  display:flex;
  align-items: flex-start;
  width: 670px;
`

export const WrapperItem = styled.td`
  color: rgb(154, 59, 59);
  text-align: left;
  font-weight: bold;
  border: 1px solid #C08261;
  border-collapse: collapse;
  padding-top: 10px;
  padding-bottom: 20px;
  padding-left: 30px;
  padding-right: 40px;
  width: 200px;
  color: #9A3B3B;
`
export const WrapperItemLabel = styled.th`
  width: fit-content;
  border: 1px solid #C08261;
  border-collapse: collapse;
  padding-top: 10px;
  padding-bottom: 20px;
  padding-left: 30px;
  padding-right: 40px;
  width: 200px;
  color: #C08261;
`

export const WrapperAllPrice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end
`