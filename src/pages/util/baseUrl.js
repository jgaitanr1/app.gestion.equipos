// const localhostEndpoint = "http://localhost:8080/api/";
const productionEndpoint = "https://api.hx.com.pe/api/";

//se cambia la base URL
const defaultEndpoint = productionEndpoint;

const restrictions = {
    MIN_DATE_TO_MAKE_ORDER: new Date()
}

export const environment = {
    baseUrl: defaultEndpoint,
    businessRules: restrictions
}
