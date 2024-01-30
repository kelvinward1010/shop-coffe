import { useQuery } from '@tanstack/react-query'
import React,{Fragment, useEffect} from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
// nạp vào để có thể chuyển trang bằng đường dẫn từ thư viên react-router-dom
import DefaultComponents from './components/DefaultComponents/DefaultComponent'
import {routes} from './route'
// nạp các đường dẫn từ folder route
import axios from 'axios'
import { isJsonString } from './utils'
import { jwtDecode } from "jwt-decode";
//JSON Web Mã (JWT) là một chuẩn mở (RFC 7519) định nghĩa một cách nhỏ gọn và khép kín
// để truyền một cách an toàn thông tin giữa các bên dưới dạng đối tượng JSON
import * as UserService from './services/UserServices'
// Nạp UserService từ folder UserService
import { updateUser,resetUser } from "./redux/slide/userSlide";
// Nạp dữ liệu của updateUser từ folder redux/slide
import { useDispatch, useSelector } from "react-redux";
// useDispatch giúp chuyển dữ liệu từ store.js ra giao diện người dùng



function App() {

// useEffect(()=>{
//   fetchApi()
// },[])

// const fetchApi = async() => {
//   const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all`)
//   return res.data
// }

// const query = useQuery({ queryKey: ['todos'], queryFn: fetchApi })
// console.log('query', query);

const dispatch = useDispatch()
const user = useSelector((state)=>state.user)

useEffect(() =>{
  const {storageData, decoded} = handleDecoded()
      if(decoded?.id){
        handleGetDetailsUser(decoded?.id, storageData)
      }
},[])

const handleDecoded = () => {
  let storageData = user?.access_token || localStorage.getItem('access_token')
  let decoded = {}
  if (storageData && isJsonString(storageData) && !user?.access_token) {
    storageData = JSON.parse(storageData)
       decoded = jwtDecode(storageData)
  }
  return {decoded, storageData}
}

UserService.axiosJWT.interceptors.request.use(async (config) => {
  // Do something before request is sent
  const currentTime = new Date()
  const {decoded} = handleDecoded()
  let storageRefreshToken = localStorage.getItem('refresh_token')
  const refreshToken = JSON.parse(storageRefreshToken)
  const decodedRefreshToken =  jwtDecode(refreshToken)
  if(decoded?.exp < currentTime.getTime() / 1000) {
    if(decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
    const data = await UserService.refreshToken(refreshToken)
    if(data){
      config.headers['token'] = `Bearer ${data.access_token}` // Tại sao lại bỏ dấu ? thì lại chạy được ??
    }
  }else {
    dispatch(resetUser())
  }
// Nhưng lại tạo ra thông báo lỗi này
//     Uncaught runtime errors:
// ERROR
// Request failed with status code 404
// AxiosError: Request failed with status code 404
//     at settle (http://localhost:3000/static/js/bundle.js:123908:12)
//     at XMLHttpRequest.onloadend (http://localhost:3000/static/js/bundle.js:122593:66)
  }
  return config;
}, 
 (err)  => {
  // Do something with request error
  return Promise.reject(err);
});


const handleGetDetailsUser = async (id, token) => {
  const res = await UserService.getDetailsUser(id, token)
  let storageRefreshToken = localStorage.getItem('refresh_token')
  const refreshToken = JSON.parse(storageRefreshToken)
  // UserService.getDetailsUser(id, token) đang gọi hàm getDetailsUser trong folder UserService bên back-end
  dispatch(updateUser({...res?.data, access_token: token, refreshToken: refreshToken}))
}

  return (
    <div>
      <Router>
      <Routes>
        {routes.map((route)=>{
          const Page = route.page
          const isCheckAuth = !route.isPrivate || user.isAdmin
          const Layout = route.isShowHeader ? DefaultComponents : Fragment
          return(
            <Route key={route.path} path={isCheckAuth && route.path} element={
            <Layout>
            <Page />
            </Layout>
            } />
          )
        })}
      </Routes>
      </Router>
    </div>
  )
}

export default App