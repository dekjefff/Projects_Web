const express = require('express');
const router = express.Router();
const productCURD = require('./productController');


//Admin Management
// URL for get http://localhost:3030/api/SearchProduct
router.get("/api/SearchProduct", productCURD.SearchProduct);


// URL:  http://localhost:3030/api/AddProduct
// Add Product test (post)
// {"product": {
//             "product_ID": 1000000002,
//             "product_name": "Aventus For Her",
//             "_description": "smell good",
//             "price": "10000",
//             "image_url": "C:WebApp_ProjectProjects_Webserverphotocreed2.jpg",
//             "stock_quantity": 100,
//             "size": "100ml",
//             "scent_description": "sexy",
//             "brand_ID": null,
//             "supplier_ID": null
//         }
// }
router.post("/api/AddProduct", productCURD.AddProduct);


// URL:  http://localhost:3030/api/UpdateProduct
// Update product test (put)
// {"product": {
//             "product_ID": 1000000002,
//             "product_name": "Aventus For Her",
//             "_description": "smell good",
//             "price": "10000",
//             "image_url": "C:WebApp_ProjectProjects_Webserverphotocreed2.jpg",
//             "stock_quantity": 100,
//             "size": "100ml",
//             "scent_description": "sexy and so sweet",
//             "brand_ID": null,
//             "supplier_ID": null
//         }
// }
router.put("/api/UpdateProduct", productCURD.UpdateProduct);

// Delete Product test (delete)
// http://localhost:3030/admin/DeleteProduct/1000000002
router.delete("/api/DeleteProduct", productCURD.DeleteProduct);


//Home Page
//URL for test: http://localhost:3030/api/homepage/brand?frombrand=Creed
router.get("/api/homepage/brand", productCURD.homepagebrand);


router.get("/api/homepage/category", productCURD.homepagecategory);

router.get("/api/get/detail", productCURD.homemostpopular);


module.exports = router;
