const { DataTypes, Model } = require("sequelize");

module.exports = class Group extends Model {
  static init(sequelize) {
    return super.init(
      {
        group_name: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        group_creator: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        creation_date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        users: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        tableName: "Groups",
        timestamps: false,
        sequelize,
      }
    );
  }
};
