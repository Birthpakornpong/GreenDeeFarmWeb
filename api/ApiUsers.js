import axios from "axios";
import { Component } from "react";
import { setHeaderAuth } from "utils/index";
const ISSERVER = typeof window === "undefined";
class ApiUsers extends Component {
    static insert = async (data, username) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}users/${username}` : `users/${username}`,
            method: "post",
            data: data,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return result;
    };
    static requestOTP = async (data) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}users/requestOTP` : `users/requestOTP`,
            method: "post",
            data: data,
        });
        return result;
    };
    static complain = async (data) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}users/complain` : `users/complain`,
            method: "post",
            data: data,
        });
        return result;
    };
    static insertAddress = async (data) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}users/address` : `users/address`,
            method: "post",
            data: data,
        });
        return result;
    };
    static editAddress = async (data) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}users/address` : `users/address`,
            method: "put",
            data: data,
        });
        return result;
    };
    static editProfile = async (data) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}users/profile` : `users/profile`,
            method: "put",
            data: data,
        });
        return result;
    };
    static login = async (data) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}users/login` : `users/login`,
            method: "post",
            data: data,
        });
        return result;
    };
    static loginNoAuth = async (data) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}users/loginNoAuth` : `users/loginNoAuth`,
            method: "post",
            data: data,
        });
        return result;
    };
    static changePassword = async (data) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}users/changePassword` : `users/changePassword`,
            method: "post",
            data: data,
        });
        return result;
    };
    static resetPassword = async (data) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}users/resetPassword` : `users/resetPassword`,
            method: "post",
            data: data,
        });
        return result;
    };
    static resetPasswordConfirm = async (data) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}users/resetPasswordConfirm` : `users/resetPasswordConfirm`,
            method: "post",
            data: data,
        });
        return result;
    };
    static getProfileList = async (data) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}users/profileList` : `users/profileList`,
            method: "post",
            data: data,
        });
        return result;
    };
    static getUserProfile = async () => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}users/me` : `users/me`,
            method: "get",
        });
        return result;
    };
    static getNotification = async () => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}users/notification` : `users/notification`,
            method: "get",
        });
        return result;
    };
    static getUserAddressById = async (id) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}users/address/${id}` : `users/address/${id}`,
            method: "get",
        });
        return result;
    };
    static getFilesRequired = async () => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}users/filesRequired` : `users/filesRequired`,
            method: "get",
        });
        return result;
    };
    static getDetail = async (id) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}news/${id}` : `news/${id}`,
            method: "get",
        });
        return result;
    };

    static GetDeliveryKPIDeliveryStatus = async (data) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}users/deliveryStatus` : `users/deliveryStatus`,
            method: "post",
            data: data
        });
        return result;
    };

    static GetDeliveryKPIDeliveryStatusDate = async (data) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}users/deliveryStatus/deliveryDate` : `users/deliveryStatus/deliveryDate`,
            method: "post",
            data: data
        });
        return result;
    };
    static ExportDeliveryKPIDeliveryStatus = async (data) => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}users/deliveryStatus/export` : `users/deliveryStatus/export`,
            method: "post",
            data: data
        });
        return result;
    };
}

export default ApiUsers;
