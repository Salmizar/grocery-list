/**
 * Lists Model
 * 
 * @returns {ListsClass} returns the Lists model
 */
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('lists', {
        list_id: {
            field: 'list_id',
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
        name: {
            field: 'name',
            allowNull: false,
            type: DataTypes.STRING
        }
    }, {
        timestamps: false
    });
}