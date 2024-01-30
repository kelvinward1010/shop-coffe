const ProductService = require('../services/ProductServices')

const createProduct = async (req, res) =>{
  try{
    const {name,image,type,price,countInStock,rating,description, discount} = req.body
    if(!name || !image || !type|| !price || !countInStock || !rating || !discount){
      return res.status(200).json({
        status: 'ERR',
        message: 'Hãy nhập đầy đủ thông tin !'
      })
    }
    const response = await ProductService.createProduct(req.body)
    return res.status(200).json(response)
  }
  catch(e){
    return res.status(404).json({
      message: e
    }
    )
  }
}

const updateProduct = async (req, res) =>{
  try{
    const ProductId = req.params.id
    const data = req.body
    if(!ProductId){
      return res.status(200).json({
        status: 'ERR',
        message: 'Hãy nhập Id sản phẩm'
      })
    }
    const response = await ProductService.updateProduct(ProductId,data)
    return res.status(200).json(response)
  }
  catch(e){
    return res.status(404).json({
      message: e
    })
  }
}

const getDetailProduct = async (req, res) =>{
  try{
    const ProductId = req.params.id
    if(!ProductId){
      return res.status(200).json({
        status: 'ERR',
        message: 'Hãy nhập Id sản phẩm'
      })
    }
    const response = await ProductService.getDetailProduct(ProductId)
    return res.status(200).json(response)
  }
  catch(e){
    return res.status(404).json({
      message: e
    })
  }
}

const deleteProduct = async (req, res) =>{
  try{
    const ProductId = req.params.id
    if(!ProductId){
      return res.status(200).json({
        status: 'ERR',
        message: 'Hãy nhập Id sản phẩm'
      })
    }
    const response = await ProductService.deleteProduct(ProductId)
    return res.status(200).json(response)
  }
  catch(e){
    return res.status(404).json({
      message: e
    })
  }
}

const getAllProduct = async (req, res) =>{
  try{
    const {limit, page,sort,filter} = req.query
    const response = await ProductService.getAllProduct(Number(limit) || null, Number(page) || 0, sort, filter)
    return res.status(200).json(response)
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
        message: 'Hãy nhập Ids sản phẩm'
      })
    }
    const response = await ProductService.deleteManyProduct(ids)
    return res.status(200).json(response)
  }
  catch(e){
    return res.status(404).json({
      message: e
    })
  }
}

const getAllType = async (req, res) =>{
  try{
    const response = await ProductService.getAllType()
    return res.status(200).json(response)
  }
  catch(e){
    return res.status(404).json({
      message: e
    })
  }
}


module.exports = {
  createProduct, 
  updateProduct,
  getDetailProduct,
  deleteProduct,
  getAllProduct,
  deleteMany,
  getAllType
}