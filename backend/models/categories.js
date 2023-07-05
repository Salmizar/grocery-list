/**
 * Categories Model
 * 
 * @returns {CategoriesClass} returns the Categories model
 */
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('categories', {
        category_id: {
            field: 'category_id',
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        account_id: {
            field: 'account_id',
            allowNull: false,
            type: DataTypes.INTEGER
        },
        name: {
            field: 'name',
            allowNull: false,
            type: DataTypes.STRING
        },
        order_id: {
            field: 'order_id',
            allowNull: false,
            type: DataTypes.INTEGER
        }
    }, {
        timestamps: false
    });
}