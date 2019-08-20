module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Username is required',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'Email is required',
        },
        isEmail: {
          msg: 'Invalid Email',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'password is required',
        },
      },
    },
  }, {});
  User.associate = (models) => {
    User.hasMany(models.Survey, {
      foreignKey: 'userId',
      as: 'surveys',
      onDelete: 'CASCADE',
    });
    User.hasMany(models.Feedback, {
      foreignKey: 'userId',
      as: 'feedback',
      onDelete: 'CASCADE',
    });
  };
  return User;
};
