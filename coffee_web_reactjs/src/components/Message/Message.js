import {message} from 'antd'
// Tạo ra tin nhắn từ Ant-design

//Thông báo này hiện lên khi tạo thành công tài khoản
const success = (mes = 'Thành công') => {
// Khai báo và nhập sẵn giá trị cho biến mes
  message.success(mes)
} 

//Thông báo này hiện lên khi không tạo thành công tài khoản
const error = (mes = 'Lỗi') => {
  message.error(mes)
}

//Thông báo này hiện lên khi ...
const warning = (mes = 'Cảnh báo') => {
  message.warning(mes)
}

export {success, error, warning}