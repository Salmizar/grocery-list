/**
 * Users Model
 * 
 * @returns {UsersClass} returns the Users model
 */
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users', {
        user_id: {
            field: 'user_id',
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        name: {
            field: 'name',
            allowNull: false,
            type: DataTypes.STRING
        },
        email: {
            field: 'email',
            allowNull: false,
            type: DataTypes.STRING
        },
        password: {
            field: 'password',
            allowNull: false,
            type: DataTypes.STRING
        },
        auth_id: {
            field: 'auth_id',
            allowNull: false,
            type: DataTypes.STRING
        }
    }, {
        timestamps: false
    });
}