import { createSlice } from '@reduxjs/toolkit'

// Khởi tạo giá trị ban đầu là rỗng
const initialState = {
  name: '',
  email: '',
  phone: '',
  address: '',
  avatar: '',
  access_token: '',
  id: '',
  isAdmin: false,
  city: '',
  refreshToken: '',
}

export const userSlide = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // update dữ liệu mới vào initialState
   updateUser: (state, action) => {
      const {name= '', email= '', access_token= '',avatar='',address= '',phone= '', _id ='', isAdmin, city=''
    ,refreshToken =''} = action.payload
      state.name = name;
      state.email = email;
      state.phone = phone;
      state.address = address;
      state.avatar = avatar;
      state.id = _id;
      state.access_token = access_token;
      state.isAdmin = isAdmin;
      state.city = city;
      state.refreshToken = refreshToken;
      //Token kiểu như nó giúp mình xác thực danh tính người dùng, 
      //để check xem người đó có quyền thực hiện gọi API
   },
   resetUser: (state) => {
    state.name = '';
    state.email = '';
    state.phone = '';
    state.address = '';
    state.avatar = '';
    state.id = '';
    state.access_token = '';
    state.isAdmin = false;
    state.city = '';
    state.refreshToken = ''
 },
  },
})

// Action creators are generated for each case reducer function
export const { updateUser,resetUser } = userSlide.actions

export default userSlide.reducer