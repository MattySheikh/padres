/**
 * Handles our `pitchers` table
 */

let pitches;
export default pitches = (sequelize: SequelizeType, DataTypes: SequelizeDataTypes) => {
	const pitches = sequelize.define('pitches', {
		gameId: DataTypes.STRING,
		pitcherId: DataTypes.TINYINT,
		pitchNo: DataTypes.TINYINT,
		time: DataTypes.TIME,
		inning: DataTypes.TINYINT,
		topBottom: DataTypes.ENUM('Bottom', 'Top'),
		outs: DataTypes.TINYINT,
		strikes: DataTypes.TINYINT,
		balls: DataTypes.TINYINT,
		paOfInning: DataTypes.TINYINT,
		pitchOfPa: DataTypes.TINYINT,
		pitcherSet: DataTypes.ENUM('Windup', 'Stretch'),
		batterSide: DataTypes.ENUM('Left', 'Right'),
		pitchType: DataTypes.STRING,
		pitchCall: DataTypes.STRING,
		kOrBb: DataTypes.ENUM('Strikeout', 'Walk'),
		hitType: DataTypes.STRING,
		playResult: DataTypes.STRING,
		outsOnPlays: DataTypes.TINYINT,
		runsScored: DataTypes.TINYINT,
		relSpeed: DataTypes.DOUBLE,
		zoneSpeed: DataTypes.DOUBLE,
		relHeight: DataTypes.DOUBLE,
		relSide: DataTypes.DOUBLE,
		vertRelAngle: DataTypes.DOUBLE,
		horzRelAngle: DataTypes.DOUBLE,
		spinRate: DataTypes.DOUBLE,
		spinAxis: DataTypes.DOUBLE,
		tilt: DataTypes.STRING,
		extension: DataTypes.DOUBLE,
		vertBreak: DataTypes.DOUBLE,
		horzBreak: DataTypes.DOUBLE,
		plateLocHeight: DataTypes.DOUBLE,
		plateLocSide: DataTypes.DOUBLE,
		zoneTime: DataTypes.DOUBLE,
		exitSpeed: DataTypes.DOUBLE,
		hitAngle: DataTypes.DOUBLE,
		hitDirection: DataTypes.DOUBLE,
		distance: DataTypes.DOUBLE,
		bearing: DataTypes.DOUBLE,
		hangtime: DataTypes.DOUBLE
	});

	// There are pitches in a game and belong to a pitcher, set up that association here
	pitches.associate = (models: SequelizeModels) => {
		pitches.belongsTo(models.pitchers, {
			foreignKey: 'pitcherId'
		});

		pitches.belongsTo(models.games, {
			foreignKey: 'gameId'
		});
	}

	return pitches;
};
