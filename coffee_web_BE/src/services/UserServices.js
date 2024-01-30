const User = require("../models/UserModel")
const bcrypt = require("bcrypt")
const { generalAccessToken, generalRefreshToken } = require("./JwtServices")

const createUser = (newUser) => {
  return new Promise( async (resolve, reject)=>{
    const {name,email,password} = newUser
    try {
      const checkUser =  await User.findOne({
        email: email
      })
      if (checkUser !== null){
        resolve({
          status: 'ERR',
          message: 'Email này đã tồn tại rồi !'
        })
      }
      const hash = bcrypt.hashSync(password,10)
      const createUser = await User.create({
        name, 
        email, 
        password: hash, 
      })
      if(createUser) {
        resolve({
          status: 'OK',
          message: 'Tạo thành công',
          data: createUser
        })
      }
    }catch (e){
      reject(e)
    }
  })
}

const loginUser = (userLogin) => {
  return new Promise( async (resolve, reject)=>{
    const {email,password} = userLogin
    try {
      const checkUser =  await User.findOne({
        email: email
      })
      if (checkUser === null){
        resolve({
          status: 'ERR',
          message: 'Tài khoản này không tồn tại !'
        })
      }
      const comparePassword = bcrypt.compareSync(password, checkUser.password)

      if(!comparePassword){
        resolve({
          status: 'ERR',
          message: 'Mật khẩu hoặc tài khoản không đúng !'
        })
      }
        const access_token = await generalAccessToken({
          id: checkUser.id,
          isAdmin: checkUser.isAdmin
        })

        const refresh_token = await generalRefreshToken({
          id: checkUser.id,
          isAdmin: checkUser.isAdmin
        })

        resolve({
          status: 'OK',
          message: 'Đăng nhập thành công !',
          access_token,
          refresh_token
        })

    }catch (e){
      reject(e)
    }
  })
}

const updateUser = (id, data) => {
  return new Promise( async (resolve, reject)=>{
    try {
      const checkUser =  await User.findOne({
        _id: id
      })
      if (checkUser === null){
        resolve({
          status: 'ERR',
          message: 'Tài khoản này không tồn tại !'
        })
      }

      const updateUser = await User.findByIdAndUpdate(id,data, {new : true})
        resolve({
          status: 'OK',
          message: 'Tạo thành công',  
          data: updateUser
        })

    }catch (e){
      reject(e)
    }
  })
}

const deleteUser = (id) => {
  return new Promise( async (resolve, reject)=>{
    try {
      const checkUser =  await User.findOne({
        _id: id
      })
      if (checkUser === null){
        resolve({
          status: 'OK',
          message: 'Tài khoản này không tồn tại !'
        })
      }

      await User.findByIdAndDelete(id)

        resolve({
          status: 'OK',
          message: 'Xóa thành công tài khoản',  
        })

    }catch (e){
      reject(e)
    }
  })
}

const getAllUser = () => {
  return new Promise( async (resolve, reject)=>{
    try {
      const allUser = await User.find()
        resolve({
          data: allUser
        })

    }catch (e){
      reject(e)
    }
  })
}

const getDetailUser = (id) => {
  return new Promise( async (resolve, reject)=>{
    try {
      const user =  await User.findOne({
        _id: id
      })
      if (user === null){
        resolve({
          status: 'ERR',
          message: 'Tài khoản này không tồn tại !'
        })
      }
        resolve({
          status: 'OK',
          message: 'Tìm thấy dữ liệu người dùng',  
          data: user
        })

    }catch (e){
      reject(e)
    }
  })
}

const deleteManyUser = (ids) => {
  return new Promise( async (resolve, reject)=>{
    try {

      await User.deleteMany({_id:ids})

        resolve({
          status: 'OK',
          message: 'Xóa thành công tài khoản',  
        })

    }catch (e){
      reject(e)
    }
  })
}



module.exports = {
  createUser, 
  loginUser, 
  updateUser, 
  deleteUser, 
  getAllUser,
  getDetailUser,
  deleteManyUser
}