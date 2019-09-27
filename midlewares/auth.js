const { skip } = require('graphql-resolvers');
const { AuthenticationError } = require('apollo-server-express');
const models = require('../database/models');

/**
 *
 *
 * @param {*} parent
 * @param {*} args
 * @param {*} { user }
 * @returns
 */
const isAuthenticated = (parent, args, { user }) => {
  if (!user) {
    throw new AuthenticationError(
      'Unauthorized Request, Authentication required'
    );
  }
  return skip;
};

/**
 *
 *
 * @param {*} parent
 * @param {*} args
 * @param {*} { user }
 * @returns
 */
const isSurveyOwner = async (parent, { surveyId }, { user }) => {
  if (!user) {
    throw new AuthenticationError('Authentication required');
  }
  const { id } = user;
  const survey = await models.Survey.findOne({
    where: { id: surveyId },
    include: [
      {
        model: models.User,
        as: 'owner'
      }
    ]
  });
  if (id !== survey.owner.dataValues.id) {
    throw new AuthenticationError(
      'Unauthorized, You do not have access to this survey'
    );
  }
  return skip;
};

/**
 *
 *
 * @param {*} parent
 * @param {*} args
 * @param {*} { user }
 * @returns
 */
const refuseSurveyOwner = async (parent, { input: { surveyId } }, { user }) => {
  if (!user) {
    throw new AuthenticationError('Authentication required');
  }

  const { id } = user;
  const survey = await models.Survey.findOne({
    where: { id: surveyId },
    include: [
      {
        model: models.User,
        as: 'owner'
      }
    ]
  });
  if (id === survey.owner.dataValues.id) {
    throw new AuthenticationError(
      'You are not allowed to respond to a survey you created'
    );
  }
  return skip;
};

module.exports = {
  isAuthenticated,
  isSurveyOwner,
  refuseSurveyOwner
};
