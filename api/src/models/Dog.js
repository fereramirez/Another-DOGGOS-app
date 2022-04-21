const {DataTypes} = require('sequelize');

// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.

module.exports = (sequelize) => {
	// defino el modelo
	sequelize.define(
		'dog',
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
			},
		},
		{
			freezeTableName: true,
			timestamps: false,
		}
	);
};
