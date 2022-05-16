const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "dog",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      weight: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      height: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      life_span: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      temperament: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
};
