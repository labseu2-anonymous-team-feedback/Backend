const { mergeResolvers } = require('merge-graphql-schemas');
const userResolver = require('./user');
const surveyResolver = require('./survey');

module.exports = mergeResolvers([userResolver, surveyResolver]);
