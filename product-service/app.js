const express = require('express');
const app = express();
const sequelize = require('./database');
const { DataTypes } = require('sequelize');
const cors = require('cors');

// Middleware untuk parsing JSON
app.use(express.json());
app.use(cors());

// Model untuk Product
const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
});

// Inisialisasi Database
const initDb = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log("Products table synced with database");
    } catch (error) {
        console.error("Error creating database tables:", error);
    }
};

initDb();

// Response standar
const successResponse = (res, message, data = null) => {
    res.status(200).json({
        success: true,
        message: message,
        data: data
    });
};

const errorResponse = (res, status, message) => {
    res.status(status).json({
        success: false,
        message: message
    });
};

// API untuk mendapatkan semua produk
app.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll();
        successResponse(res, 'Products Retrieved Successfully', products);
    } catch (error) {
        console.log(error);
        errorResponse(res, 500, 'Error Retrieving Products');
    }
});

// API untuk mendapatkan produk berdasarkan ID
app.get('/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const product = await Product.findByPk(id);
        
        if (!product) {
            return errorResponse(res, 404, 'Product Not Found');
        }

        successResponse(res, 'Product Retrieved Successfully', product);
    } catch (error) {
        console.log(error);
        errorResponse(res, 500, 'Error Retrieving Product');
    }
});

// API untuk menambahkan produk baru
app.post('/products', async (req, res) => {
    try {
        const { name, description, price } = req.body;
        
        if (!name || !price) {
            return errorResponse(res, 400, 'Name and Price are required');
        }

        const newProduct = await Product.create({ name, description, price });
        successResponse(res, 'New Product Created', newProduct);
    } catch (error) {
        console.log(error);
        errorResponse(res, 500, 'Error Creating Product');
    }
});

// API untuk memperbarui produk
app.put('/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, description, price } = req.body;

        if (!name || !price) {
            return errorResponse(res, 400, 'Name and Price are required');
        }

        const product = await Product.findByPk(id);
        if (!product) {
            return errorResponse(res, 404, 'Product Not Found');
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;

        await product.save();
        successResponse(res, 'Product Updated', product);
    } catch (error) {
        console.log(error);
        errorResponse(res, 500, 'Error Updating Product');
    }
});

// API untuk menghapus produk
app.delete('/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const product = await Product.findByPk(id);

        if (!product) {
            return errorResponse(res, 404, 'Product Not Found');
        }

        await product.destroy();
        successResponse(res, 'Product Deleted');
    } catch (error) {
        console.log(error);
        errorResponse(res, 500, 'Error Deleting Product');
    }
});

// Menjalankan server
app.listen(3000, () => {
    console.log('Listening on port 3000');
});