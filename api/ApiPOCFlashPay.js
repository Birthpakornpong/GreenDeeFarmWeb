import axios from "axios";
import { Component } from "react";
const ISSERVER = typeof window === "undefined";
class ApiPOCFlashPay extends Component {
  static precreatePayment = async (payload) => {
    const result = await axios({
      url: `poc_payment/precreate_payment`,
      method: "post",
      data: { payload: payload },
    });
    return result;
  };
  static checkResultPayment = async (payload) => {
    const result = await axios({
      url: `poc_payment/checkresult_payment`,
      method: "post",
      data: { payload: payload },
    });
    return result;
  };
}

export default ApiPOCFlashPay;
