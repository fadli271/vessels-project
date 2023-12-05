"use strict";

/**
 * vessel-history controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::vessel-history.vessel-history",
  ({ strapi }) => ({
    async findAll(ctx) {
      const page = ctx.query.page || "1";
      const pageSize = ctx.query.pageSize || "10";
      const visselHistories = await strapi.db
        .query("api::vessel-history.vessel-history")
        .findPage({
          start: page,
          limit: pageSize,
        });
      ctx.body = visselHistories;
    },
  })
);
