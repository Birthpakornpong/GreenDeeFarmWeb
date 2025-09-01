import axios from "axios";
import { Component } from "react";
import { setHeaderAuth } from "utils/index";
const ISSERVER = typeof window === "undefined";
class ApiMasters extends Component {
    static getAddress = async () => {
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}masters/address` : `masters/address`,
            method: "get",
        });
        return result;
    };
    static getBox = async () => {
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}masters/box` : `masters/box`,
            method: "get",
        });
        return result;
    };
    static getPrice = async () => {
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}masters/price` : `masters/price`,
            method: "get",
        });
        return result;
    };
    static getConfig = async () => {
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}masters/config` : `masters/config`,
            method: "get",
        });
        return result;
    };
    static getDropOff = async () => {
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}masters/dropoff` : `masters/dropoff`,
            method: "get",
        });
        return result;
    };
    static getContentByCode = async (code) => {
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}masters/content/${code}` : `masters/content/${code}`,
            method: "get",
        });
        return result;
    };
    static getProductType = async () => {
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}masters/productType` : `masters/productType`,
            method: "get",
        });
        return result;
    };
    static getExceptAddress = async () => {
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}masters/addressExcept` : `masters/addressExcept`,
            method: "get",
        });
        return result;
    };
    static getConfigMaster = async () => {
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}masters/configMaster` : `masters/configMaster`,
            method: "get",
        });
        return result;
    };
    static getClaim = async () => {
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}masters/claim` : `masters/claim`,
            method: "get",
        });
        return result;
    };
    static getComplain = async () => {
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}masters/complain` : `masters/complain`,
            method: "get",
        });
        return result;
    };
    static getComplainOrder = async () => {
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}masters/complainOrder` : `masters/complainOrder`,
            method: "get",
        });
        return result;
    };
    static getZone = async () => {
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}masters/zone` : `masters/zone`,
            method: "get",
        });
        return result;
    };
    static getInsuranceMaster = async () => {
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}masters/insurance` : `masters/insurance`,
            method: "get",
        });
        return result;
    };
    static getInsurancePrice = async (price) => {
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}masters/insurance/${price}` : `masters/insurance/${price}`,
            method: "get",
        });
        return result;
    };
    static getPromotions = async () => {
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}masters/promotions` : `masters/promotions`,
            method: "get",
        });
        return result;
    };
    static getPromotionsSeasoning = async () => {
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}masters/promotions/seasoning` : `masters/promotions/seasoning`,
            method: "get",
        });
        return result;
    };
    static getVoucher = async (voucher_code) => {
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}masters/voucher/${voucher_code}` : `masters/voucher/${voucher_code}`,
            method: "get",
        });
        return result;
    };
}

export default ApiMasters;
