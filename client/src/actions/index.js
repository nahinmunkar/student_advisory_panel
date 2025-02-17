import { toast } from "react-toastify";
import { forgotPassword } from "../api/forgotPassword";
import { sendRecaptcha } from "../api/recaptcha";
import { showToast } from "../components/toast/toast";

export const sendForgotPassword = (email, setShowModal) => async (dispatch) => {
    try {
        const { data } = await forgotPassword(email);
        setShowModal(false);
        if (data.code === 200) {
            showToast("info", data.msg, 10000, toast.POSITION.TOP_RIGHT);
        } else {
            showToast("error", data.msg, 10000, toast.POSITION.TOP_RIGHT);
        }
        console.log("data in forgot passowrd", data);
    } catch (error) {
        console.log(error);
    }
};
/*
export const verifyRecaptcha = (token, setRecaptcha) => async (dispatch) => {
    try {
        const { data } = await sendRecaptcha(token);
        if (data.code === 200) {
            setRecaptcha(!data.data.success);
        } else {
            showToast("error", data.msg, 10000, toast.POSITION.TOP_RIGHT);
            setRecaptcha(true);
        }
        console.log("data in recaptcha", data);
    } catch (error) {
        console.log(error);
    }
};
*/

export const verifyRecaptcha = (token) => async (dispatch) => {
    try {
      const { data } = await sendRecaptcha(token);
      return data.success; // Return verification status
    } catch (error) {
      console.error("reCAPTCHA verification failed:", error);
      return false;
    }
  };
