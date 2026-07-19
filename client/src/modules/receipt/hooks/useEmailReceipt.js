import emailjs from "@emailjs/browser";
import { notifyError, notifySuccess } from "../../../utils/notifications";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const useEmailReceipt = () => {
  const sendReceipt = async (templateParams) => {
    console.log({
      SERVICE_ID,
      TEMPLATE_ID,
      PUBLIC_KEY,
    });
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

      notifySuccess("Receipt emailed successfully.");
    } catch (error) {
      console.error("EmailJS Error:", error);

      console.log("Status:", error.status);
      console.log("Text:", error.text);

      notifyError("Unable to send receipt.");
    }
  };

  return {
    sendReceipt,
  };
};

export default useEmailReceipt;
