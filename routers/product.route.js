
const express = require("express")
const { listProduct, getProducts, getProductsBy } = require("../controllers/product.controller")
const { verifyUser } = require("../controllers/user.controller")
// const { getProducts, getProductsBy } = require("../controllers/product.controller")
const router = express.Router()


router.post("/addProduct", verifyUser, listProduct)

router.get("/getProducts", verifyUser, getProducts  )
router.get("/getProductsBy/", verifyUser, getProductsBy)

module.exports = router
