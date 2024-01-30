const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors")
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
// chưa rõ tác dụng nhưng cứ thêm vào theo hướng dẫn
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({ limit:'50mb'}));
// chưa rõ tác dụng nhưng cứ thêm vào theo hướng dẫn
app.use(bodyParser.json())
app.use(cookieParser())

routes(app)


mongoose.connect(`${process.env.MONGO_DB}`)
.then(()=>{
  console.log('Thành công kết nối dữ liệu')
})
.catch((err)=>{
  // console.log(err)
})

app.listen(port, ()=>{
  console.log('Máy chủ hiện đang chạy ở cổng', + port)
})
