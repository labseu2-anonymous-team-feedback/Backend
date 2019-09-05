const { mergeTypes } = require('merge-graphql-schemas');
const userTypes = require('./user');
const surveyTypes = require('./survey');
const feedbackTypes = require('./feedback');

module.exports = mergeTypes([userTypes, surveyTypes, feedbackTypes]);
