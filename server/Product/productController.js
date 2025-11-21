//
const express = require('express');
const router = express.Router();
const DBcon = require('../Database/DBconnect');

// --- Admin Management ---

exports.SearchProduct = (req, res) => {
    DBcon.query("SELECT * FROM product", function(error, results) {
        if (error) throw error;
        return res.send({
            error: false,
            data: results,
            message: "product"
        });
    });
};

exports.AddProduct = (req, res) => {
    let add = req.body.product;
    if (!add) {
        return res.status(404).send({ error: true });
    };
    DBcon.query("INSERT INTO product SET ?", add, function(error, results) {
        if (error) throw error;
        return res.send({
            error: false,
            data: results,
            message: "new product has been added successfully"
        });
    });
};

exports.UpdateProduct = (req, res) => {
    let update = req.body.product;
    let product_ID = req.body.product.product_ID;
    if (!update || !product_ID) {
        return res.status(404).send({ error: true });
    };
    DBcon.query("UPDATE product SET ? WHERE product_ID = ?", [update, product_ID], function(error, results) {
        if (error) throw error;
        return res.send({
            error: false,
            data: results.affectedRows,
            message: "product has been updated successfully"
        });
    });
};

exports.DeleteProduct = (req, res) => {
    let product_ID = req.params.id;
    if (!product_ID) {
        return res.status(404).send({ error: true });
    };
    DBcon.query("DELETE FROM product WHERE product_ID = ?", product_ID, function(error, results) {
        if (error) throw error;
        return res.send({
            error: false,
            data: results.affectedRows,
            message: "product has been deleted successfully"
        });
    });
};

// --- Homepage & Search ---

// Recommend by brand
exports.homepagebrand = (req, res) => {
    const brand = req.query.frombrand;
    DBcon.query("SELECT * FROM product JOIN brand on product.brand_ID = brand.brand_ID WHERE brand.brand_name = ? ",
        [brand],
        function(error, results) {
            if (error) throw error;
            return res.send({
                error: false,
                data: results,
                message: "product"
            });
        });
};

// Recommend by category
exports.homepagecategory = (req, res) => {
    const category_season = req.query.category_season;
    const category_sex = req.query.category_sex;
    let sql = `
    SELECT * FROM product JOIN product_category on product.product_ID = product_category.product_ID 
    JOIN category on product_category.category_ID = category.category_ID 
    WHERE category.category_name IN ( ? , ? ) 
    `;
    DBcon.query(sql,
        [category_sex, category_season],
        function(error, results) {
            if (error) throw error;
            return res.send({
                error: false,
                data: results,
                message: "product"
            });
        });
};

// Advanced Search (SearchPage)
exports.searchAndFilter = (req, res) => {
    const { q, sex, size, season } = req.query;

    let sql = `
        SELECT DISTINCT p.* FROM product p 
        LEFT JOIN brand b ON p.brand_ID = b.brand_ID
        LEFT JOIN product_category pc ON p.product_ID = pc.product_ID
        LEFT JOIN category c ON pc.category_ID = c.category_ID
        WHERE 1=1
    `;
    const params = [];

    // 1. Text Search
    if (q) {
        sql += ` AND (p.product_name LIKE ? OR b.brand_name LIKE ?)`;
        params.push(`%${q}%`, `%${q}%`);
    }
    // 2. Size Filter
    if (size && size !== 'ALL') {
        sql += ` AND p.size = ?`;
        params.push(size.replace('ml', ''));
    }
    // 3. Sex Filter
    if (sex && sex !== 'ALL') {
        sql += ` AND EXISTS (
            SELECT 1 FROM product_category pc2 
            JOIN category c2 ON pc2.category_ID = c2.category_ID 
            WHERE pc2.product_ID = p.product_ID AND c2.category_name = ?
        )`;
        params.push(sex);
    }
    // 4. Season Filter
    if (season && season !== 'ALL') {
        sql += ` AND EXISTS (
            SELECT 1 FROM product_category pc3 
            JOIN category c3 ON pc3.category_ID = c3.category_ID 
            WHERE pc3.product_ID = p.product_ID AND c3.category_name = ?
        )`;
        params.push(season);
    }

    DBcon.query(sql, params, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send({ error: true, message: "Database error" });
        }
        return res.send({
            error: false,
            data: results,
            message: "Search results"
        });
    });
};

// Options for Dropdown
exports.getOptionSex = (req, res) => {
    res.send(['Men', 'Women', 'Unisex']);
};

exports.getOptionSeason = (req, res) => {
    res.send(['Summer', 'Winter', 'Rainy']);
};

exports.getOptionSize = (req, res) => {
    DBcon.query("SELECT DISTINCT size FROM product ORDER BY size ASC", (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: true });
        }
        const sizes = results.map(row => row.size).filter(s => s != null);
        res.send(sizes);
    });
};