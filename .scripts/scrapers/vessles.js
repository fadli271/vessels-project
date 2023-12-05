const axios = require("axios");

const getToken = async () => {
  const apiUrl = "https://api.maritimeoptima.com/graphql-public";

  const requestData = {
    operationName: "Login",
    variables: {
      email: "fadli.mohamad62@gmail.com",
      password: "123456789",
      platform: "WEB",
    },
    query:
      "mutation Login($email: String!, $password: String!, $platform: Platform, $utm: UTMInput) {\n  login(email: $email, password: $password, platform: $platform, utm: $utm) {\n    jwt\n    refresh\n    numLoggedOut\n    __typename\n  }\n}",
  };

  try {
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        "App-Context": "pro",
      },
    });

    return response.data.data.login.jwt;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const getVesselWithPrefix = async () => {
  const prefixList = await strapi.db
    .query("api::vessel-prefix.vessel-prefix")
    .findMany();

  for (const element of prefixList) {
    const key = element.prefix;

    const requestConfig = {
      headers: {
        "X-Team": "322274",
        Authorization: `Bearer ${await getToken()}`,
      },
    };
    console.log("prefix: ", key);
    const variabels =
      '{"bool":{"must":[{"prefix":{"document.vessel_description.general_information.vessel_name":"' +
      key.toLowerCase() +
      '"}}]}}';
    console.log(variabels);
    const requestData = {
      operationName: "vesselSearch",
      variables: {
        must: [variabels],
        filter: [],
        sort: [],
        offset: 0,
        limit: 40,
      },
      query:
        "query vesselSearch($must: [String!]!, $filter: [String!]!, $sort: [String!]!, $offset: Int!, $limit: Int!, $should: [String!]) {\n  vessels(\n    must: $must\n    filter: $filter\n    sort: $sort\n    offset: $offset\n    limit: $limit\n    should: $should\n  ) {\n    totalHits {\n      value\n      relation\n      __typename\n    }\n    edges {\n      node {\n        ...VesselSearch\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment VesselSearch on Vessel {\n  id\n  imo\n  mmsi\n  name\n  buildYear\n  dwtSummer\n  draftSummer\n  beam\n  lengthOverAll\n  cubicCapacity\n  segment {\n    value\n    label\n    __typename\n  }\n  subSegment {\n    value\n    label\n    __typename\n  }\n  ais {\n    position {\n      latitude\n      longitude\n      __typename\n    }\n    __typename\n  }\n  flag\n  profilePictureUrl\n  profilePictureCaption\n  __typename\n}",
    };

    try {
      const response = await axios.post(
        "https://api.maritimeoptima.com/graphql",
        requestData,
        requestConfig
      );
      return response.data.data;
    } catch (error) {
      console.error("Error:", error);
    }
  }
};

const getVissels = async () => {
  const requestConfig = {
    headers: {
      "X-Team": "322274",
      Authorization: `Bearer ${await getToken()}`,
    },
  };

  const requestData = encodeURIComponent(
    '{"segments":[["other","FF69B4",[["asphalt_bitumen_tanker","FF69B4"],["barge","FF69B4"],["bunker_tanker_lng","FF69B4"],["bunker_tanker","FF69B4"],["cable_layer","FF69B4"],["car_roro","FF69B4"],["crane_ship","FF69B4"],["co2_gas_carrier","FF69B4"],["dredging","FF69B4"],["ferry","FF69B4"],["fishing","FF69B4"],["heavy_lift","FF69B4"],["hospital","FF69B4"],["ice_breaker","FF69B4"],["leisure","FF69B4"],["livestock","FF69B4"],["slop_receiving_vessel","FF69B4"],["passenger","FF69B4"],["passenger_general_cargo","FF69B4"],["pilot","FF69B4"],["pipe_layer","FF69B4"],["reefer","FF69B4"],["research","FF69B4"],["tug","FF69B4"],["training","FF69B4"],["water_Tanker","FF69B4"],["well_boats","FF69B4"],["unspecified","FF69B4"]]]],"mapStyle":"light","iconTemplate":"vessel-{{.Color}}-{{.NavigationalStatus}}-{{.MapStyle}}","vesselsAsGeometry":false}'
  );

  const response = await axios.get(
    `https://api.maritimeoptima.com/vessel-features?request=${requestData}`,
    requestConfig
  );
  return response.data;
};

const getVisselHistories = async () => {
  const requestConfig = {
    headers: {
      "X-Team": "322274",
      Authorization: `Bearer ${await getToken()}`,
    },
  };

  const requestData = encodeURIComponent(
    '{"segments":[["other","FF69B4",[["asphalt_bitumen_tanker","FF69B4"],["barge","FF69B4"],["bunker_tanker_lng","FF69B4"],["bunker_tanker","FF69B4"],["cable_layer","FF69B4"],["car_roro","FF69B4"],["crane_ship","FF69B4"],["co2_gas_carrier","FF69B4"],["dredging","FF69B4"],["ferry","FF69B4"],["fishing","FF69B4"],["heavy_lift","FF69B4"],["hospital","FF69B4"],["ice_breaker","FF69B4"],["leisure","FF69B4"],["livestock","FF69B4"],["slop_receiving_vessel","FF69B4"],["passenger","FF69B4"],["passenger_general_cargo","FF69B4"],["pilot","FF69B4"],["pipe_layer","FF69B4"],["reefer","FF69B4"],["research","FF69B4"],["tug","FF69B4"],["training","FF69B4"],["water_Tanker","FF69B4"],["well_boats","FF69B4"],["unspecified","FF69B4"]]]],"mapStyle":"light","iconTemplate":"vessel-{{.Color}}-{{.NavigationalStatus}}-{{.MapStyle}}","vesselsAsGeometry":true}'
  );

  const response = await axios.get(
    `https://api.maritimeoptima.com/vessel-features?request=${requestData}`,
    requestConfig
  );
  return response.data;
};

const storeVissels = async (name, imo, geometry) => {
  const existVessel = await strapi.db.query("api::vessel.vessel").findOne({
    select: ["imo"],
    where: { imo: imo },
  });

  if (!existVessel) {
    await strapi.db.query("api::vessel.vessel").create({
      data: {
        name: name,
        imo: imo,
        geometry: geometry,
      },
    });
  }
};

const storeVisselHistorie = async (name, imo, geometry) => {
  const existVessel = await strapi.db
    .query("api::vessel-history.vessel-history")
    .findOne({
      select: ["imo"],
      where: { imo: imo },
    });

  if (!existVessel) {
    await strapi.db.query("api::vessel-history.vessel-history").create({
      data: {
        name: name,
        imo: imo,
        geometry: geometry,
      },
    });
  }
};

const main = async () => {
  try {
    // const vissels = await getVissels();
    // const visselsHistory = await getVisselHistories();

    // // TODO: CREATE VISSELS
    // vissels.features.forEach(async (element) => {
    //   console.log("scraped vessel", element);
    //   await storeVissels(
    //     element.properties.name,
    //     element.properties.imo,
    //     element.geometry
    //   );
    // });

    // // TODO: CREATE VISSEL HISTORIES
    // visselsHistory.features.forEach(async (element) => {
    //   console.log("scraped vessel history", element);
    //   await storeVisselHistorie(
    //     element.properties.name,
    //     element.properties.imo,
    //     element.geometry
    //   );
    // });

    try {
      const vesselWithPrefix = await getVesselWithPrefix();
      console.log(vesselWithPrefix);
    } catch (error) {
      console.error("Error:", error);
    }
  } catch (error) {
    console.error("Error in main:", error);
  }
};

exports.main = main;
