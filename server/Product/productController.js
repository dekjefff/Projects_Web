const express = require('express');
const router = express.Router();
const DBcon = require('../Database/DBconnect')

//section of admin management
exports.GetProduct = (req,res) => {
    // const search = req.body.
    DBcon.query("SELECT * FROM product", function(error,results){
        if(error) throw error;
        return  res.send({
            error: false,
            data: results,
            message: "product"
        });
    });
};



exports.AddProduct = (req,res) => {

    let add = req.body.product;
    
    if(!add){
        return res.status(404).send({error:true});
    };

    DBcon.query("SELECT * FROM product WHERE product_name = ?", add.product_name , function (error, results){
        if(error) throw error;
        if(results.length > 0){
            return res.status(409).send({error:true, message: "Product already exists"});
        }   
    });

    DBcon.query("INSERT INTO product SET ?", add, function (error, results){
        if(error) throw error;
        return res.send({
            error: false,
            data: results,
            message: "new porduct has been added successfully"
        });
    });
};


exports.UpdateProduct = (req,res) => {

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
};


exports.DeleteProduct =  (req,res) => {

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
};




//section of Homepage
//recommend by brand
exports.homepagebrand = (req,res) => {

    const brand = req.query.frombrand;

    DBcon.query("SELECT * FROM product JOIN brand on product.brand_ID = brand.brand_ID WHERE brand.brand_name = ? ",
        [brand] , function(error,results){
        if(error) throw error;
        return  res.send({
            error: false,
            data: results,
            message: "product"
        });
    });
};


//recommend by category
exports.homepagecategory = (req,res) => {

    const category_season = req.query.category_season;
    const category_sex = req.query.category_sex;

    let sql = `
    SELECT * FROM product JOIN product_category on product.product_ID = product_category.product_ID 
    JOIN category on product_category.category_ID = category.category_ID 
    WHERE category.category_name IN ( ? , ? ) 
    `;//select product have both season and product that customer select

    DBcon.query(sql,
        [category_sex , category_season] , function(error,results){
        if(error) throw error;
        return  res.send({
            error: false,
            data: results,
            message: "product"
        });
    });
    console.log("season:", category_season, "sex:", category_sex);
};

