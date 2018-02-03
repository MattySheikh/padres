let games;
export default games = (sequelize: any, DataTypes: any) => {
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

	games.associate = (models: any) => {
		games.hasMany(models.pitches, {
			foreignKey: 'gameId',
			sourceKey: 'gameId'
		})
	};

	return games;
};
