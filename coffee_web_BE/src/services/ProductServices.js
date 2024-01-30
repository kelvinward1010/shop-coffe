const Product = require("../models/ProductModel")
const bcrypt = require("bcrypt")

const createProduct = (newProduct) => {
  return new Promise( async (resolve, reject)=>{
    const {name,image,type,price,countInStock,rating,description,discount} = newProduct

    try {
      const checkProduct =  await Product.findOne({
        name: name
      })
      if (checkProduct !== null){
        resolve({
          status: 'OK',
          message: 'Tên sản phẩm này đã tồn tại rồi !'
        })
      }
      const newProduct = await Product.create({
        name,
        image,
        type,
        price,
        countInStock: Number(countInStock),
        rating,
        description, 
        discount: Number(discount),
      })
      if(newProduct) {
        resolve({
          status: 'OK',
          message: 'Tạo thành công',
          data: newProduct
        })
      }
    }catch (e){
      reject(e)
    }
  })
}

const updateProduct = (id, data) => {
  return new Promise( async (resolve, reject)=>{
    try {
      const checkProduct =  await Product.findOne({
        _id: id
      })
      if (checkProduct === null){
        resolve({
          status: 'OK',
          message: 'Sản phẩm này không tồn tại !'
        })
      }

      const updateProduct = await Product.findByIdAndUpdate(id,data, {new : true})
        resolve({
          status: 'OK',
          message: 'Tạo thành công',  
          data: updateProduct
        })

    }catch (e){
      reject(e)
    }
  })
}

const deleteProduct = (id) => {
  return new Promise( async (resolve, reject)=>{
    try {
      const checkProduct =  await Product.findOne({
        _id: id
      })
      if (checkProduct === null){
        resolve({
          status: 'OK',
          message: 'Sản phẩm này không tồn tại !'
        })
      }

      await Product.findByIdAndDelete(id)

        resolve({
          status: 'OK',
          message: 'Xóa thành công sản phẩm',  
        })

    }catch (e){
      reject(e)
    }
  })
}

const getAllProduct = (limit, page, sort,filter) => {
  return new Promise( async (resolve, reject)=>{
    try {
      const totalProduct = await Product.count()
      let allProduct = []
      if(filter){
        const label = filter[0]
        const allObjectFilter = await Product.find({[label]: {$regex: new RegExp(filter[1], 'i')}}).limit(limit).skip(page * limit).sort({createdAt: -1, updatedAt: -1})
        resolve({
          status: 'OK',
          message: 'Đã tải thành công dữ liệu !',  
          data: allObjectFilter,
          total: totalProduct,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalProduct/limit)
        })
      }
      if(sort){
        const objectSort = {}
        objectSort[sort[1]] = sort[0]
        const allProductSort = await Product.find().limit(limit).skip(limit * page).sort(objectSort).sort({createdAt: -1, updatedAt: -1})
        resolve({
          status: 'OK',
          message: 'Đã tải thành công dữ liệu !',  
          data: allProductSort,
          total: totalProduct,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalProduct/limit)
        })
      }
      if(!limit){
        allProduct = await Product.find()
      }
      else{
        allProduct = await Product.find().limit(limit).skip(limit * page)
      }
        resolve({
          status: 'OK',
          message: 'Đã tải thành công dữ liệu !',  
          data: allProduct,
          total: totalProduct,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalProduct/limit)
        })

    }catch (e){
      reject(e)
    }
  })
}

const getDetailProduct = (id) => {
  return new Promise( async (resolve, reject)=>{
    try {
      const product =  await Product.findOne({
        _id: id
      })
      if (product === null){
        resolve({
          status: 'OK',
          message: 'Sản phẩm này không tồn tại !'
        })
      }
        resolve({
          status: 'OK',
          message: 'Tìm thấy dữ liệu sản phẩm',  
          data: product
        })

    }catch (e){
      reject(e)
    }
  })
}

const deleteManyProduct = (ids) => {
  return new Promise( async (resolve, reject)=>{
    try {
       await Product.deleteMany({_id: ids})

        resolve({
          status: 'OK',
          message: 'Xóa thành công sản phẩm',  
        })

    }catch (e){
      reject(e)
    }
  })
}

const getAllType = () => {
  return new Promise( async (resolve, reject)=>{
    try {
      const allType = await Product.find().distinct('type')
        resolve({
          status: 'OK',
          message: 'Đã tải thành công dữ liệu !',  
          data: allType,
        })

    }catch (e){
      reject(e)
    }
  })
}

module.exports = {
  createProduct,
  updateProduct,
  getDetailProduct,
  deleteProduct,
  getAllProduct,
  deleteManyProduct,
  getAllType
}