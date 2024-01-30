const nodemailer = require('nodemailer')
const dotenv = require('dotenv')

dotenv.config()

const sendEmailCreateOrder = async(email, orderItems) => {
  const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.MAIL_ACCOUNT,
    pass: process.env.MAIL_PASSWORD
  }
});

  let listItem = '';
  const attachImage = []
  orderItems.forEach((order) => {
    listItem += `<div>
    <div>Bạn đã đặt sản phẩm <b>${order.name}</b> với số lương:<b>${order.amount}</b> và giá là: <b>${order.price} VND</b></div>
    <div><img src=${order.img} alt='sản phẩm'/></div>
    </div>`
    attachImage.push({path: order.image})
  })

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: process.env.MAIL_ACCOUNT, // sender address
    to: process.env.MAIL_ACCOUNT, // list of receivers
    subject: "Thư thông báo đặt hàng", // Subject line
    text: "Hello world?", // plain text body
    html: `<div><b>Bạn đã đặt hàng thành công</b></div>${listItem}`, // html body
    attachImage: attachImage,
  });
}

module.exports = {
  sendEmailCreateOrder
}