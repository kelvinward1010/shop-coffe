import React from 'react'
import { WrapperInputStyle } from './style'

// Component này tạo ra các ô để điền thông tin vào, hiện đang được sử dụng cho đang kí và đăng nhập
const InputForm = (props) => {
    const {placeholder='Nhập text',...rests} = props
    const handleOnchangeInput = (e) => {
        props.onChange(e.target.value)
    }

    return(
        <div>
    <WrapperInputStyle placeholder={placeholder} value={props.value} {...rests} 
    onChange={handleOnchangeInput}/>
        </div>
    )
}

export default InputForm