// server-monolithic.js - ปัญหาเดิม
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json());

// Database connection (ปนกับทุกอย่าง)
const db = new sqlite3.Database('./products.db');

// Create table
db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    stock INTEGER DEFAULT 0,
    category TEXT NOT NULL
)`);

// GET /api/products - ดึงสินค้าทั้งหมด
app.get('/api/products', (req, res) => {
    const { category } = req.query;
    
    let sql = 'SELECT * FROM products';
    let params = [];
    
    if (category) {
        sql += ' WHERE category = ?';
        params.push(category);
    }
    
    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        // Business logic: คำนวณมูลค่ารวม (ปนกับทุกอย่าง)
        const totalValue = rows.reduce((sum, p) => sum + (p.price * p.stock), 0);
        
        res.json({ 
            products: rows, 
            totalValue: totalValue.toFixed(2) 
        });
    });
});

// POST /api/products - เพิ่มสินค้า
app.post('/api/products', (req, res) => {
    const { name, price, stock, category } = req.body;
    
    // Validation (ปนกับ HTTP handling)
    if (!name || !price || !category) {
        return res.status(400).json({ error: 'Name, price, and category are required' });
    }
    
    // Business logic: validate price (ปนกับทุกอย่าง)
    if (price <= 0) {
        return res.status(400).json({ error: 'Price must be greater than 0' });
    }
    
    // Database insert
    const sql = 'INSERT INTO products (name, price, stock, category) VALUES (?, ?, ?, ?)';
    
    db.run(sql, [name, price, stock || 0, category], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        db.get('SELECT * FROM products WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json(row);
        });
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));