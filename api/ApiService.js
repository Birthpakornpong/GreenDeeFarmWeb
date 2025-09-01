import axios from "axios";
import { Component } from "react";
import { setHeaderAuth } from "utils/index";
const ISSERVER = typeof window === "undefined";
class ApiServices extends Component {
    static get = async () => {
        await setHeaderAuth();
        const result = await axios({
            url: ISSERVER ? `${process.env.API_INTERNAL_URL}services` : `services`,
            method: "get",
        });
        return result;
    };
}

export default ApiServices;
