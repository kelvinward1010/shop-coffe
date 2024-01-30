const Order = require ('../models/OrderProduct')
const Product = require("../models/ProductModel")
const EmailService = require("../services/EmailService")

const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
      const { orderItems,paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone,user, isPaid, paidAt,email } = newOrder
      try {
          const promises = orderItems.map(async (order) => {
              const productData = await Product.findOneAndUpdate(
                  {
                  _id: order.product,
                  countInStock: {$gte: order.amount}
                  },
                  {$inc: {
                      countInStock: -order.amount,
                      selled: +order.amount
                  }},
                  {new: true}
              )
              if(productData) {
                  return {
                      status: 'OK',
                      message: 'SUCCESS'
                  }
              }
               else {
                  return{
                      status: 'OK',
                      message: 'ERR',
                      id: order.product
                  }
              }
          })
          const results = await Promise.all(promises)
          const newData = results && results.filter((item) => item.id)
          if(newData.length) {
              const arrId = []
              newData.forEach((item) => {
                  arrId.push(item.id)
              })
              resolve({
                  status: 'ERR',
                  message: `San pham voi id: ${arrId.join(',')} khong du hang`
              })
          } else {
              const createdOrder = await Order.create({
                  orderItems,
                  shippingAddress: {
                      fullName,
                      address,
                      city, phone
                  },
                  paymentMethod,
                  itemsPrice,
                  shippingPrice,
                  totalPrice,
                  user: user,
                  isPaid, paidAt
              })
              if (createdOrder) {
                  await EmailService.sendEmailCreateOrder(email,orderItems)
                  resolve({
                      status: 'OK',
                      message: 'success'
                  })
              }
          }
      } catch (e) {
          reject(e)
      }
  })
}

const getAllOrderDetails = (id) => {
  return new Promise( async (resolve, reject)=>{
    try {
      const order =  await Order.find({
        user: id
      })
      if (order === null){
        resolve({
          status: 'ERR',
          message: 'Đơn hàng này không tồn tại !'
        })
      }
        resolve({
          status: 'OK',
          message: 'Tìm thấy dữ liệu sản phẩm',  
          data: order
        })

    }catch (e){
      reject(e)
    }
  })
}

const getOrderDetails = (id) => {
  return new Promise( async (resolve, reject)=>{
    try {
      const order =  await Order.findById({
        _id: id
      })
      if (order === null){
        resolve({
          status: 'ERR',
          message: 'Đơn hàng này không tồn tại !'
        })
      }
        resolve({
          status: 'OK',
          message: 'Tìm thấy dữ liệu sản phẩm',  
          data: order
        })

    }catch (e){
      reject(e)
    }
  })
}

const cancelOrderDetails = (id,data) => {
  return new Promise( async (resolve, reject)=>{
    try {
        let order =  []
        const promises = data.map(async (order) => {
          const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            selled:{$gte: order.amount}
          },
          {$inc: {
            countInStock: +order.amount,
            selled: -order.amount
          }},
          {new: true}
        )

        if(productData){
          order =  await Order.findByIdAndDelete(id)    
          if (order === null){
            resolve({
              status: 'ERR',
              message: 'Đơn hàng này không tồn tại !'
            })
          }
        } else {
          return({
            status: 'OK',
            message: 'Không tạo thành công',
            id: order.product
          })
        }
      })
      const results = await Promise.all(promises)
      const newData = results && results.filter((item) => item)
      if(newData.length){
        resolve({
          status: 'ERR',
          message: `Sản phẩm có id ${newData.join(',')} không tồn tại`,
        })
      }
  
      resolve({
        status: 'OK',
        message: 'Thành công',
        data: order,
      })

    }catch (e){
      reject(e)
    }
  })
}

const getAllOrder = () => {
  return new Promise( async (resolve, reject)=>{
    try {
      const allOrder = await Order.find()
        resolve({
          status: 'OK',
          message: 'Đã tải thành công dữ liệu !',  
          data: allOrder
        })

    }catch (e){
      reject(e)
    }
  })
}

module.exports = {
  createOrder, 
  getAllOrderDetails,
  getOrderDetails,
  cancelOrderDetails,
  getAllOrder
}