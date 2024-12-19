const { Sequelize } = require('sequelize');

// Membuat koneksi ke database MYSQL
const sequelize = new Sequelize('productdb', 'root', 'Devel@root28', {
    host: process.env.DB_HOST,      //Host database yang akan digunakan
    dialect:'mysql',                //Jenis database yang akan digunakan
    port: 3306                      //Port default MySQL
});

module.exports = sequelize