module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define(
    'Feedback',
    {
      userId: DataTypes.INTEGER,
      questionId: DataTypes.INTEGER,
      comment: DataTypes.TEXT
    },
    {}
  );
  Feedback.associate = (models) => {
    // associations can be defined here
  };
  return Feedback;
};
