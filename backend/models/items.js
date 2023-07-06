/**
 * Items Model
 * 
 * @returns {ItemsClass} returns the Items model
 */
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('items', {
        item_id: {
            field: 'item_id',
            type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
            primaryKey: true
        },
       account_id: {
            field: 'account_id',
            allowNull: false,
            type: DataTypes.INTEGER
        },
        category_id: {
            field: 'category_id',
            type: DataTypes.INTEGER
        },
        name : {
            field: 'name',
            allowNull: false,
            type: DataTypes.STRING
        },
        store_ids: {
            field: 'store_ids',
            type: DataTypes.TEXT
        }
    }, {
        timestamps: false
    });
}