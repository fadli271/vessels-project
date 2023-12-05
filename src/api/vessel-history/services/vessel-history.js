'use strict';

/**
 * vessel-history service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::vessel-history.vessel-history');
