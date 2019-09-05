const { mergeResolvers } = require('merge-graphql-schemas');
const userResolver = require('./user');
const surveyResolver = require('./survey');
const feedbackResolver = require('./feedback');

module.exports = mergeResolvers([userResolver, surveyResolver, feedbackResolver]);
