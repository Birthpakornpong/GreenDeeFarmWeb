import axios from "axios";
import { Component } from "react";
import { setHeaderAuth } from "utils/index";
const ISSERVER = typeof window === "undefined";
class ApiNews extends Component {
    static get = async () => {
        await setHeaderAuth();
        const result = await axios({
            url: `news`,
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}news` : `news`,
            method: "get",
        });
        return result;
    };
    static getBanner = async () => {
        console.log('getBanner::', ISSERVER ? `${process.env.API_INTERNAL_URL}news/banner` : `news/banner`)
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}news/banner` : `news/banner`,
            method: "get",
        });
        return result;
    };
    static getFAQ = async () => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}news/faq` : `news/faq`,
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

}

export default ApiNews;
