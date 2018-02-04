let games;

export default games = (sequelize: SequelizeType, DataTypes: SequelizeDataTypes) => {
	const games = sequelize.define('games',
		{
			gameId: {
				primaryKey: true,
				type: DataTypes.STRING
			},
			gameDate: DataTypes.DATE,
			stadium: DataTypes.STRING
		}
	);

	games.associate = (models: SequelizeModels) => {
		games.hasMany(models.pitches, {
			foreignKey: 'gameId',
			sourceKey: 'gameId'
		});
	};

	return games;
};
