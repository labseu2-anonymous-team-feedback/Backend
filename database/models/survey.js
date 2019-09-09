module.exports = (sequelize, DataTypes) => {
  const Survey = sequelize.define(
    'Survey',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Title is required'
          }
        }
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'User ID is required'
          }
        }
      },
      closed: DataTypes.BOOLEAN
    },
    {}
  );
  Survey.associate = models => {
    // associations can be defined here
    Survey.hasMany(models.Question, {
      foreignKey: 'surveyId',
      as: 'questions',
      onDelete: 'CASCADE'
    });
    Survey.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'owner'
    });
    Survey.hasMany(models.Feedback, {
      foreignKey: 'surveyId',
      as: 'feedback',
      onDelete: 'CASCADE'
    });
  };
  return Survey;
};
