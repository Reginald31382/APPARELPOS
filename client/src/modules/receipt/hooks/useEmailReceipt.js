import emailjs from "@emailjs/browser";
import { notifyError, notifySuccess } from "../../../utils/notifications";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const useEmailReceipt = () => {
  const sendReceipt = async (templateParams) => {
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

      notifySuccess("Receipt emailed successfully.");
    } catch (error) {
      console.error("EmailJS Error:", error);

      notifyError("Unable to send receipt.");
    }
  };

  return {
    sendReceipt,
  };
};

export default useEmailReceipt;
