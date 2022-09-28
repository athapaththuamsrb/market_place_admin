import axios from "axios";
const api = axios.create({ baseURL: process.env.STRAPI_URL });
// api.defaults.headers.common[
//   "Authorization"
// ] = `Bearer 010e26afdec92776ac00c664326c6d3504497efcf045caf43ddff047e0a1f831003277a5b2029c4b25ea99c5d4275fe2175cf92ca112f92a37bca53a22fdefb4ed29f8004092775c6a4853f2208b256244d4711260817c00c2e9aab50b0cd0a9e6ec8237122982c078d814d0ef642defb4b49ea65ab30ee960cdf3f1801309f4`;
export default api;
