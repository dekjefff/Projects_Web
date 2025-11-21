//
const express = require('express');
const router = express.Router();
const productCURD = require('./productController');

// Admin Management
router.get("/api/SearchProduct", productCURD.SearchProduct);
router.post("/api/AddProduct", productCURD.AddProduct);
router.put("/api/UpdateProduct", productCURD.UpdateProduct);
router.delete("/api/DeleteProduct/:id", productCURD.DeleteProduct); // Fixed param :id

// Home Page
router.get("/api/homepage/brand", productCURD.homepagebrand);
router.get("/api/homepage/category", productCURD.homepagecategory);

// Search Page (Advanced Filter)
router.get("/api/products/search", productCURD.searchAndFilter);

// Dropdown Options
router.get("/api/options/sex", productCURD.getOptionSex);
router.get("/api/options/size", productCURD.getOptionSize);
router.get("/api/options/season", productCURD.getOptionSeason);

module.exports = router;