const { DataTypes, Model } = require("sequelize");

module.exports = class Group extends Model {
  static init(sequelize) {
    return super.init(
        {
        date: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
          primaryKey: true,
        },
        date: {
          type: DataTypes.STRING
        },
        time: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        user: {
          type: DataTypes.STRING,
          allowNull: false,
            },
        channel: {
          type: DataTypes.STRING,
          allowNull: false,
            },
        message: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        tableName: "Log",
        timestamps: false,
        sequelize,
      }
    );
  }
};
