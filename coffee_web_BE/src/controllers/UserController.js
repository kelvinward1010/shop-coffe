const UserService = require('../services/UserServices')
const JwtServices = require('../services/JwtServices')

const createUser = async (req, res) =>{
  try{
    const {email,password} = req.body
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    const isCheckEmail = reg.test(email)
    if( !email || !password ){
      return res.status(200).json({
        status: 'ERR',
        message: 'Hãy nhập đầy đủ thông tin !'
      })
    }
    else if (!isCheckEmail) {
      return res.status(200).json({
          status: 'ERR',
          message: 'Hãy nhập lại Email !'
      })
  } 
    const response = await UserService.createUser(req.body)
    return res.status(200).json(response)
  }
  catch(e){
    return res.status(404).json({
      message: e
    }
    )
  }
}

const loginUser = async (req, res) =>{
  try{
    const {email,password} = req.body
    if(!email || !password){
      return res.status(200).json({
        status: 'ERR',
        message: 'Hãy nhập đầy đủ thông tin !'
      })
    }
    const response = await UserService.loginUser(req.body)
    const {refresh_token,...newReponse} = response
    res.cookie('refresh_token', refresh_token,{
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path:'/'
    })
    return res.status(200).json({
      "data": "???"
    })
  }
  catch(e){
    return res.status(404).json({
      message: e
    }
    )
  }
}

const updateUser = async (req, res) =>{
  try{
    const userId = req.params.id
    const data = req.body
    if(!userId){
      return res.status(200).json({
        status: 'ERR',
        message: 'Hãy nhập Id tài khoản'
      })
    }
    const response = await UserService.updateUser(userId,data)
    return res.status(200).json(response)
  }
  catch(e){
    return res.status(404).json({
      message: e
    })
  }
}

const deleteUser = async (req, res) =>{
  try{
    const userId = req.params.id
    if(!userId){
      return res.status(200).json({
        status: 'ERR',
        message: 'Hãy nhập Id tài khoản'
      })
    }
    const response = await UserService.deleteUser(userId)
    return res.status(200).json(response)
  }
  catch(e){
    return res.status(404).json({
      message: e
    })
  }
}

const getAllUser = async (req, res) =>{
  try{
 
    const response = await UserService.getAllUser()
    return res.status(200).json(response)
  }
  catch(e){
    return res.status(404).json({
      message: e
    })
  }
}

const getDetailUser = async (req, res) =>{
  try{
    const userId = req.params.id
    if(!userId){
      return res.status(200).json({
        status: 'ERR',
        message: 'Hãy nhập Id tài khoản'
      })
    }
    const response = await UserService.getDetailUser(userId)
    return res.status(200).json(response)
  }
  catch(e){
    return res.status(404).json({
      message: e
    })
  }
}

//Thằng refresh token giúp để lấy thông tin của người dùng để mình check quyền xem nó có được 
//cấp mới access token không và khi có quyền thì mình sẽ thaya những thông tin từ refresh token
// để tạo access token mới e nhé
const refreshToken = async (req, res) =>{
  try{
    const token = req.headers.token.split(' ')[1]
    if(!token){
      return res.status(200).json({
        status: 'ERR',
        message: 'Hãy nhập token tài khoản'
      })
    }
    const response = await JwtServices.refreshTokenJwtService(token)
    return res.status(200).json(response)
  }
  catch(e){
    return res.status(404).json({
      message: e
    })
  }
}

const logoutUser = async (req, res) =>{
  try{
    res.clearCookie('refresh_token')
    return res.status(200).json({
      status: 'OK',
      message: 'Đăng xuất tài khoản thành công'
    })
  }
  catch(e){
    return res.status(404).json({
      message: e
    })
  }
}

const deleteMany = async (req, res) =>{
  try{
    const ids = req.body.ids
    if(!ids){
      return res.status(200).json({
        status: 'ERR',
        message: 'Hãy nhập Ids tài khoản'
      })
    }
    const response = await UserService.deleteManyUser(ids)
    return res.status(200).json(response)
  }
  catch(e){
    return res.status(404).json({
      message: e
    })
  }
}

module.exports = {
  createUser, 
  loginUser, 
  updateUser, 
  deleteUser, 
  getAllUser, 
  getDetailUser, 
  refreshToken,
  logoutUser,
  deleteMany
}