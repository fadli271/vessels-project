"use strict";

/**
 * vessel-detail controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::vessel-detail.vessel-detail",
  ({ strapi }) => ({
    async findVessel(ctx) {
      const { key } = ctx.params;
      const vesselLocation = await strapi.db
        .query("api::vessel-detail.vessel-detail")
        .findOne({
          select: ["imo", "name", "mmsi", "position"],
          where: {
            $or: [{ imo: key }, { mmsi: key }, { name: { $contains: key } }],
          },
        });
      ctx.body = vesselLocation;
    },
    async findGroupTracking(ctx) {
      const vesselLocation = await strapi.db
        .query("api::vessel-prefix.vessel-prefix")
        .findMany({
          populate: {
            vessel_details: true,
          },
        });
      ctx.body = vesselLocation;
    },
    async findVesselHistory(ctx) {
      const vesselHistories = await strapi.db
        .query("api::vessel-detail.vessel-detail")
        .findMany({
          select: ["imo", "name", "mmsi", "histories"],
        });
      ctx.body = vesselHistories;
    },
  })
);
