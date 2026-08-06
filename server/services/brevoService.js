import axios from "axios";

export const addSubscriberToBrevo = async (email) => {
  return axios.post(
    "https://api.brevo.com/v3/contacts",
    {
      email,

      listIds: [Number(process.env.BREVO_LIST_ID)],

      updateEnabled: true,

      attributes: {
        SOURCE: "Website",
      },
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    },
  );
};
