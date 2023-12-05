'use strict';

/**
 * vessel-tracker service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::vessel-tracker.vessel-tracker');
