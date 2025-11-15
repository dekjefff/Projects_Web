const express = require('express');
const dotenv = require('dotenv');
const mysql = require('mysql2');

dotenv.config();

const app = express();
const router = express.Router();
app.use(router);

router.use(express.json());
router.use(express.urlencoded({extended: true}));


var DBcon = mysql.createConnection({
    host : process.env.DB_host,
    user : process.env.DB_User,
    password : process.env.DB_Passwd,
    database : process.env.DB_name
});



router.get("/SearchProduct",(req,res) => {
    // const search = req.body.
    DBcon.query("SELECT * FROM product", function(error,results){
        if(error) throw error;
        return  res.send({
            error: false,
            data: results,
            message: "product"
        });
    });
});
// Search Product test
// http://localhost:3030/SearchProduct


router.post("/admin/AddProduct", (req,res) => {

    let add = req.body.product;
    
    if(!add){
        return res.status(404).send({error:true});
    };

    DBcon.query("INSERT INTO product SET ?", add, function (error, results){
        if(error) throw error;
        return res.send({
            error: false,
            data: results,
            message: "new porduct has been added successfully"
        });
    });
});
// Add Product test
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

router.put("/admin/UpdateProduct", (req,res) => {

    let update = req.body.product;
    let product_ID = req.body.product.product_ID;
    
    if(!update || !product_ID){
        return res.status(404).send({error:true});
    };

    DBcon.query("UPDATE product SET ?  WHERE product_ID = ?", [update,product_ID] , function (error, results){
        if(error) throw error;
        return res.send({
            error: false,
            data: results.affectedRows,
            message: "porduct has been updated successfully"
        });
    });
});
// Update product test
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

router.delete("/admin/DeleteProduct/:id", (req,res) => {

    let product_ID = req.params.id;
    
    if(!product_ID){
        return res.status(404).send({error:true});
    };

    DBcon.query("DELETE FROM product WHERE product_ID = ?", product_ID , function (error, results){
        if(error) throw error;
        return res.send({
            error: false,
            data: results.affectedRows,
            message: "porduct has been deleted successfully"
        });
    });
});
// Delete Product test
// http://localhost:3030/admin/DeleteProduct/1000000002


app.listen(process.env.port, () => {
    console.log(`Server is listening on ${process.env.port} port`);
});