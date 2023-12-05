module.exports = {
  routes: [
    {
      method: "GET",
      path: "/vessel-tracking",
      handler: "vessel-history.findAll",
    },
  ],
};
