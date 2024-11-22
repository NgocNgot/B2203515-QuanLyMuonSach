import axios from "axios";

const commonConfig = {
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
};

const createApiClient = (baseURL) => {
    return axios.create({
        baseURL,
        ...commonConfig,
    });
};

export default createApiClient;
