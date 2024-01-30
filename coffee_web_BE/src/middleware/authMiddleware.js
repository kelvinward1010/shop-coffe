// check xem user có có quyền hay ko
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

//Token giúp mình xác thực danh tính người dùng có phải là admin hay không, 
//để check xem người đó có quyền hay ko
const authMiddleware = (req,res,next) =>{
  const token = req.headers.token.split(' ')[1] 
  jwt.verify(token, process.env.ACCESS_TOKEN, function(err,user){ 
    if(err){
      return res.status(404).json({
        message:'Không xác định được quyền quản trị',
        status: 'ERROR'
      })
    }

    if(user?.isAdmin){
      next()
    } else {
      return res.status(404).json({
        message:'Không xác định được quyền quản trị',
        status: 'ERROR'
      })
    }
  })
}

const authUserMiddleware = (req,res,next) =>{
  const token = req.headers.token.split(' ')[1] // Thêm dấu ? trước split 
  const userId = req.params.id
  jwt.verify(token, process.env.ACCESS_TOKEN, function(err,user){ 
    if(err){
      return res.status(404).json({
        message:'Không xác định được quyền quản trị',
        status: 'ERROR'
      })
    }
  
    if(user?.isAdmin || user?.id === userId){
      next()
    } else {
      return res.status(404).json({
        message:'Không xác định được quyền quản trị',
        status: 'ERROR'
      })
    }
  })
}

module.exports = {
  authMiddleware, 
  authUserMiddleware
}