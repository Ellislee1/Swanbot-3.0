const { DataTypes, Model } = require("sequelize");

module.exports = class Module extends Model {
  static init(sequelize) {
    return super.init(
      {
        module_code: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        module_title: {
          type: DataTypes.STRING,
          defaultValue: 0,
          allowNull: false,
        },
        channel_name: {
          type: DataTypes.STRING,
          defaultValue: 0,
          allowNull: false,
        },
        channel_type: {
          type: DataTypes.STRING,
          defaultValue: 0,
          allowNull: false,
        },
        module_courses: {
          type: DataTypes.STRING,
          defaultValue: 0,
          allowNull: false,
        },
        module_semester: {
          type: DataTypes.CHAR,
          defaultValue: 0,
          allowNull: true,
        },
      },
      {
        tableName: "Modules",
        timestamps: false,
        sequelize,
      }
    );
  }
};
