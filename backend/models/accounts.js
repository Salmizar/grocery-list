/**
 * Accounts Model
 * 
 * @returns {AccountsClass} returns the Accounts model
 */
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('accounts', {
        account_id: {
            field: 'account_id',
            type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            field: 'user_id',
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