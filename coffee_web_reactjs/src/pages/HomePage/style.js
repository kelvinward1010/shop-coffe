import styled from "styled-components"
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent"

export const WrapperTypeProduct = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 25px;
  margin-top: 10px;
  font-size: 15px;
  height: 44px;
  color: white;
  background-color: #D3756B;
  width: 90%;
  margin: 0 auto;
  text-transform: uppercase;
`

export const WrapperButtonMore = styled(ButtonComponent)`
  &:hover {
    color: #fff;
    background: rgb(211, 117, 107);
    span {
      color: #fff;
    }
  }
  width: 100%;
  text-align: center;
  cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointers'};
  margin: 20px 450px;
  color: rgb(211, 117, 107);
`

export const WrapperProduct = styled.div`
  display: flex;
  gap: 15px;
  margin-left: 40px;
  flex-wrap: wrap;
  width: 90%;
` 