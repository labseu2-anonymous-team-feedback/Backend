module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define(
    'Feedback',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      userId: DataTypes.STRING,
      surveyId: DataTypes.STRING,
      questionId: DataTypes.STRING,
      comment: DataTypes.TEXT,
      rating: DataTypes.INTEGER
    },
    {}
  );
  Feedback.associate = (models) => { // eslint-disable-line
    // associations can be defined here
  };
  return Feedback;
};
