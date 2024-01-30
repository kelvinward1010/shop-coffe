import { Input } from "antd";
// Tạo sẵn thẻ input từ Ant-design
import styled from "styled-components";

export const WrapperInputStyle = styled(Input)`
    border-top: none;
    border-right: none;
    border-left: none;
    outline: none;
    &:focus {
        background-color: rgb(232, 240, 254);
    }
`