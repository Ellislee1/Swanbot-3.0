const { DataTypes, Model } = require("sequelize");

module.exports = class Group extends Model {
  static init(sequelize) {
    return super.init(
      {
        date: {
          type: DataTypes.STRING,
          primaryKey: true,
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
