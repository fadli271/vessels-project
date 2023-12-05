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

    const variabels =
      '{"bool":{"must":[{"prefix":{"document.vessel_description.general_information.vessel_name":"' +
      key.toLowerCase() +
      '"}}]}}';
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
      return {
        key,
        response: response.data.data,
      };
    } catch (error) {
      console.error("Error:", error);
    }
  }
};

const getPrefixId = async (key) => {
  const prefix = await strapi.db
  .query("api::vessel-prefix.vessel-prefix")
  .findOne({
    where: { prefix: key}
  });
  return prefix
}

const storeVisselsWithPrefix = async (params) => {
  const { imo, mmsi, name, position, key } = params;

  const prefixId = await getPrefixId(key)
  const existVessel = await strapi.db
    .query("api::vessel-detail.vessel-detail")
    .findOne({
      select: ["imo", "histories"],
      where: { imo: imo },
    });

  if (!existVessel) {
    await strapi.db.query("api::vessel-detail.vessel-detail").create({
      data: {
        imo,
        mmsi,
        name,
        position,
        histories: [position],
        vessel_prefix: prefixId.id,
      },
    });
  } else {
    let historiesArray = existVessel.histories;

    if (!Array.isArray(historiesArray)) {
      historiesArray = [];
    }

    historiesArray.push(position);

    await strapi.db.query("api::vessel-detail.vessel-detail").update({
      where: { imo },
      data: {
        imo,
        mmsi,
        name,
        position,
        histories: historiesArray,
        vessel_prefix: prefixId.id,
      },
    });
  }

  console.log("SUCCESSS CREATED VESSEL");
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
    const vesselWithPrefix = await getVesselWithPrefix();
    vesselWithPrefix.response.vessels.edges.forEach(async (element) => {
      element.node;
      const params = {
        key: vesselWithPrefix.key,
        imo: element.node.imo,
        mmsi: element.node.mmsi,
        name: element.node.name,
        position: element.node.ais.position,
      };
      await storeVisselsWithPrefix(params);
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

exports.main = main;
