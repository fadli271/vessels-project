"use strict";

/**
 * vessel-prefix controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::vessel-prefix.vessel-prefix",
  ({ strapi }) => ({
    async findId(ctx) {
        const { key } = ctx.params;
        const prefix = await strapi.db
        .query("api::vessel-prefix.vessel-prefix")
        .findOne({
            where: {prefix: key}
        });
        ctx.body = prefix
    }
  })
);
