module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      fullname: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: {
            args: /^[a-z ]+$/i,
            msg: "Full name must only contain letters"
          }
        }
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Username is required"
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "Email is required"
          },
          isEmail: {
            msg: "Invalid Email"
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "password is required"
          }
        }
      },
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {}
  );
  User.associate = models => {
    User.hasMany(models.Survey, {
      foreignKey: "userId",
      as: "surveys",
      onDelete: "CASCADE"
    });
    User.hasMany(models.Feedback, {
      foreignKey: "userId",
      as: "feedback",
      onDelete: "CASCADE"
    });
  };
  return User;
};
