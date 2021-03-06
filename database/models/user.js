/* eslint-disable func-names */
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: {
            args: /^[a-z ]+$/i,
            msg: 'Full name must only contain letters'
          }
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: {
            args: /^[a-z ]+$/i,
            msg: 'Last name must only contain letters'
          }
        }
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Username is required'
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: 'Email is required'
          },
          isEmail: {
            msg: 'Invalid Email'
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'password is required'
          }
        }
      },
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      verified: DataTypes.BOOLEAN
    },
    {}
  );
  User.beforeCreate(async user => {
    // eslint-disable-next-line no-param-reassign
    user.password = await user.generatePasswordHash();
  });
  User.prototype.generatePasswordHash = async function() {
    const saltRounds = 10;
    return bcrypt.hash(this.password, saltRounds);
  };
  User.prototype.validatePassword = async function(password) {
    const isValid = await bcrypt.compareSync(password, this.password);
    return isValid;
  };
  User.prototype.verifyEmail = async function() {
    return this.update({ verified: true });
  };
  User.associate = models => {
    User.hasMany(models.Survey, {
      foreignKey: 'userId',
      as: 'surveys',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.Feedback, {
      foreignKey: 'userId',
      as: 'feedback',
      onDelete: 'CASCADE'
    });
  };
  return User;
};
