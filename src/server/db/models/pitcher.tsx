let pitchers;
export default pitchers = (sequelize: any, DataTypes: any) => {
	const pitchers = sequelize.define('pitchers',
		{
			pitcher: DataTypes.STRING,
			pitcherId: {
				primaryKey: true,
				type: DataTypes.TINYINT
			},
			pitcherThrows: DataTypes.ENUM('Right', 'Left')
		}
	);

	pitchers.associate = (models: any) => {
		pitchers.hasMany(models.pitches, {
			foreignKey: 'pitcherId',
			sourceKey: 'pitcherId'
		});
	};

	return pitchers;
};
