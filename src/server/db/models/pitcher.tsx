/**
 * Handles our `pitchers` table
 */

let pitchers;
export default pitchers = (sequelize: SequelizeType, DataTypes: SequelizeDataTypes) => {
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

	// A pitcher has many pitches so we set up that association here
	pitchers.associate = (models: SequelizeModels) => {
		pitchers.hasMany(models.pitches, {
			foreignKey: 'pitcherId',
			sourceKey: 'pitcherId'
		});
	};

	return pitchers;
};
