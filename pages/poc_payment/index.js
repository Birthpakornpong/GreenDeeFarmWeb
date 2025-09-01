import React from "react";
import ApiPOCFlashPay from "api/ApiPOCFlashPay";
import { useState } from "react";

const POCPayment = () => {
  const [resp, setResp] = useState({});
  const [message, setMessage] = useState("message");
  const [payload, setPayload] = useState("");
  const [result, setResult] = useState("Result");

  const onSubmit = async () => {
    try {
      const response = await ApiPOCFlashPay.precreatePayment(payload);
      if (response.status === 200) {
        const data = response.data;
        if (data.code != 0) {
          setResp(data);
          setMessage(data.message);
        } else {
          setResp(data);
          setMessage(data.message);
          window.open(data.data.redirectUrl, "_blank");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onCheckResult = async () => {
    try {
      const response = await ApiPOCFlashPay.checkResultPayment(payload);
      if (response.status === 200) {
        const data = response.data;
        console.log(data);
        const status = data.data.tradeStatus;
        switch (status) {
          case 0:
            setResult("to bepaid");
            break;
          case 2:
            setResult("processing");
            break;
          case 3:
            setResult("transaction succeeded");
            break;
          case 4:
            setResult("transaction failed");
            break;
          case 5:
            setResult("transaction closed");
            break;
          default:
            setResult("no transaction status");
            break;
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className="flex justify-center gap-3 pt-10">
        <label>outTradeNo</label>
        <input
          type="text"
          className="border-2"
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
        />
      </div>
      <div className="flex justify-center py-10">
        <button
          className="px-8 py-4 bg-[#000000] rounded-lg text-white font-semibold"
          onClick={onSubmit}
        >
          Pay
        </button>
      </div>
      <div className="flex justify-center py-5">{message}</div>
      <div className="py-10">
        <div className="flex justify-center gap-3 pt-10">
          <label>outTradeNo</label>
          <input
            type="text"
            className="border-2"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
          />
        </div>
        <div className="flex justify-center py-10">
          <button
            className="px-8 py-4 bg-[#000000] rounded-lg text-white font-semibold"
            onClick={onCheckResult}
          >
            Check Result
          </button>
        </div>
        <div className="flex justify-center py-5">{result}</div>
      </div>
    </div>
  );
};

export default POCPayment;
