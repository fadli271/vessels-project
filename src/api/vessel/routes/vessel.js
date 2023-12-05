module.exports = {
  routes: [
    {
      method: "GET",
      path: "/vessel-location/:key",
      handler: "vessel.findOne",
    },
    {
      method: "GET",
      path: "/vessel-group",
      handler: "vessel.findAll",
    },
  ],
};
