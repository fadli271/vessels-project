'use strict';

/**
 * vessel service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::vessel.vessel');
