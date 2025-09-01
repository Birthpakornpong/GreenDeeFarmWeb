import axios from "axios";
import { Component } from "react";
import { setHeaderAuth } from "utils/index";
const ISSERVER = typeof window === "undefined";
class ApiOrders extends Component {
    static createOrders = async (data) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}orders` : `orders`,
            method: "post",
            data: data,
        });
        return result;
    };
    static paymentOrders = async (data) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}orders/payment` : `orders/payment`,
            method: "post",
            data: data,
        });
        return result;
    };
    static paymentOrderOver = async (data) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}orders/paymentOver` : `orders/paymentOver`,
            method: "post",
            data: data,
        });
        return result;
    };
    static exportOrderSummary = async (data) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}orders/exportordersummaryreport` : `orders/exportordersummaryreport`,
            method: "post",
            data: data,
            // headers: {
            //     'Content-Type': 'multipart/form-data'
            // }
        });
        return result;
    };
    static printTracking = async (trackings) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}orders/printTracking` : `orders/printTracking`,
            method: "post",
            data: { trackings: trackings },
            responseType: 'blob',
        });
        return result;
    };
    static printReceipt = async (order_code) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}orders/printReceipt` : `orders/printReceipt`,
            method: "post",
            data: { order_code: order_code },
            responseType: 'blob',
        });
        return result;
    };
    static printInvoice = async (payload) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}orders/printInvoice` : `orders/printInvoice`,
            method: "post",
            data: payload,
            responseType: 'blob',
        });
        return result;
    };
    static cliamOrder = async (data, order_ref) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}orders/claim/${order_ref}` : `orders/claim/${order_ref}`,
            method: "post",
            data: data,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return result;
    };
    static complainOrder = async (data, order_ref) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}orders/complain/${order_ref}` : `orders/complain/${order_ref}`,
            method: "post",
            data: data,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return result;
    };
    static cancelOrder = async (data) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}orders/cancelOrder` : `orders/cancelOrder`,
            method: "put",
            data: data,
        });
        return result;
    };
    static uploadOrder = async (data) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}orders/upload` : `orders/upload`,
            method: "post",
            data: data,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return result;
    };
    static historyOrders = async (data) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}orders/history` : `orders/history`,
            method: "post",
            data: data,
        });
        return result;
    };
    static historyOrdersClaim = async (data) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}orders/historyClaim` : `orders/historyClaim`,
            method: "post",
            data: data,
        });
        return result;
    };
    static historyOrdersClaimDetail = async (id) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}orders/historyClaim/${id}` : `orders/historyClaim/${id}`,
            method: "get",
        });
        return result;
    };
    static historyOrdersComplainDetail = async (id) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}orders/historyComplain/${id}` : `orders/historyComplain/${id}`,
            method: "get",
        });
        return result;
    };
    static findOrder = async (order_code) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}orders/${order_code}` : `orders/${order_code}`,
            method: "get",
        });
        return result;
    };
    static findTracking = async (order_code) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}orders/tracking/${order_code}` : `orders/tracking/${order_code}`,
            method: "get",
        });
        return result;
    };

    static UpdateOrderTaxInvoice = async (payload) => {
        await setHeaderAuth();
        let res = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}orders/updateOrderTaxInvoice` : `orders/updateOrderTaxInvoice`,
            method: "put",
            data: payload
        });
        return res;
    };
}

export default ApiOrders;
