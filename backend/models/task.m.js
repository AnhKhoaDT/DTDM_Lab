'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Task extends Model {
        static associate(models) {
            Task.belongsTo(models.User, { foreignKey: 'user_id', as: 'User' });
        }
    }

    Task.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
            },
            due_date: {
                type: DataTypes.DATEONLY,
            },
            status: {
                type: DataTypes.ENUM("to_do", "doing", "done"),
                defaultValue: "to_do",
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "User",
                    key: "id"
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            }
        },
        {
            sequelize,
            tableName: 'Task',
        }
    );

    return Task;
};
