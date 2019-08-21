const { mergeTypes } = require('merge-graphql-schemas');
const userTypes = require('./user');
const surveyTypes = require('./survey');

module.exports = mergeTypes([userTypes, surveyTypes]);
