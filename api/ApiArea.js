import axios from "axios";
import { Component } from "react";
import { setHeaderAuth } from "utils/index";
const ISSERVER = typeof window === "undefined";
class ApiArea extends Component {
    static get = async () => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}area` : `area`,
            method: "get",
        });
        return result;
    };
    static getZone = async () => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}area/zone` : `area/zone`,
            method: "get",
        });
        return result;
    };
    
}

export default ApiArea;
