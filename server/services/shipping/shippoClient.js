import { Shippo } from "shippo";

const shippo = new Shippo({
  apiKeyHeader: process.env.SHIPPO_API_KEY,
});

export default shippo;
