const vessels = require("../.scripts/scrapers/vessles.js");

module.exports = {
  vesselScraped: {
    task: async ({ strapi }) => {
      vessels.main();
    },
    options: {
      rule: "* * * * *",
    },
  },
};
