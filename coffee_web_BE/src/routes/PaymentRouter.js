const express = require("express");
const router = express.Router()
const { authUserMiddleware } = require("../middleware/authMiddleWare");
const dotenv = require("dotenv");

dotenv.config()

router.get('/config',(req,res)=> {
  return res.status(200).json({
    status: 'OK',
    data: process.env.CLIENT_ID
  })
})


module.exports = router