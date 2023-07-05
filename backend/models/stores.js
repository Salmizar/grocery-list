/**
 * Stores Model
 * 
 * @returns {StoresClass} returns the Stores model
 */
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('stores', {
        store_id: {
            field: 'store_id',
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
        }
    }, {
        timestamps: false
    });
}