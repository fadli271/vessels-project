"use strict";

/**
 * vessel controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const axios = require("axios");
const { element } = require("prop-types");

module.exports = createCoreController("api::vessel.vessel", ({ strapi }) => ({
  async findOne(ctx) {
    const { key } = ctx.params;
    const vesselLocation = await strapi.db.query("api::vessel.vessel").findOne({
      where: { imo: key },
    });
    ctx.body = vesselLocation;
  },
  async findAll(ctx) {
    let group = {};
    const prefix = await strapi.db
      .query("api::vessel-prefix.vessel-prefix")
      .findMany();
    for (const element of prefix) {
      const key = element.prefix;

      group[key] = { prefix: element.prefix };
      group[key]["vessel"] = await strapi.db
        .query("api::vessel.vessel")
        .findMany({
          where: { name: { $contains: `${element.prefix} ` } },
        });
    }
    ctx.body = group;
  },
}));
