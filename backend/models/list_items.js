/**
 * List_Items Model
 * 
 * @returns {ListItemsClass} returns the List_Items model
 */
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('list_items', {
        list_item_id: {
            field: 'list_item_id',
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        list_id: {
            field: 'list_id',
            allowNull: false,
            type: DataTypes.INTEGER
        },
        item_id: {
            field: 'item_id',
            allowNull: false,
            type: DataTypes.INTEGER
        },
        count: {
            field: 'count',
            allowNull: false,
            type: DataTypes.INTEGER
        }
    }, {
        timestamps: false
    });
}