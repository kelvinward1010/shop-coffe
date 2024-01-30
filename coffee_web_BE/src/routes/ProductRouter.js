const express = require("express");
const router = express.Router()
const ProductController = require('../controllers/ProductController');
const { authMiddleware } = require("../middleware/authMiddleWare");

router.post('/create', ProductController.createProduct)
router.put('/update/:id',authMiddleware, ProductController.updateProduct)
router.get('/get-detail/:id', ProductController.getDetailProduct)
router.delete('/delete/:id',authMiddleware, ProductController.deleteProduct)
router.get('/get-all', ProductController.getAllProduct)
router.post('/delete-many',authMiddleware, ProductController.deleteMany)
router.get('/get-all-type', ProductController.getAllType)


module.exports = router