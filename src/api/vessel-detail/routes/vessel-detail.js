module.exports = {
  routes: [
    {
      method: "GET",
      path: "/vessel-detail/history",
      handler: "vessel-detail.findVesselHistory",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/vessel-detail/:key",
      handler: "vessel-detail.findVessel",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/vessel-detail/group/tracking",
      handler: "vessel-detail.findGroupTracking",
      config: {
        policies: [],
      },
    },
  ],
};
