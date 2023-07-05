/**
 * AccountUsers Model
 * 
 * @returns {AccountUsersClass} returns the Account_Users model
 */
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('account_users', {
        account_user_id: {
            field: 'account_user_id',
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        account_id: {
            field: 'account_id',
            allowNull: false,
            type: DataTypes.INTEGER
        },
        user_id: {
            field: 'user_id',
            allowNull: false,
            type: DataTypes.INTEGER
        }
    }, {
        timestamps: false
    });
}