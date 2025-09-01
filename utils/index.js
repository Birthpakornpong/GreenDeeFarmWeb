import React, { useState, useEffect, useRef } from 'react';
import moment from "moment";
import axios from 'axios';
const ISSERVER = typeof window === "undefined";
import "moment/locale/th";
import validator from 'validator';
export const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export const checkUserBool = (user) => {
    if (user.id) {
        return true;
    } else {
        return false;
    }
};


export const setHeaderAuth = async () => {
    const token = await getLocalStorage("token");
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};



export const ConvertDateShort = (date, format = "DD MMMM HH:mm A") => {
    return moment(date).locale('en').format(format);
};

export const ConvertDateShortThai = (date, format = "DD MMMM HH:mm A") => {
    return moment(date).locale('th').add(543, 'years').format(format);
};

export const CurrencyThai = (number = 0, digits = 2) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: digits }).format(isNaN(number) ? 0 : number).replace("฿", "");
}

export const setLocalStorage = (key, data) => {
    (!ISSERVER) && localStorage.setItem(key, data);
};

export const getLocalStorage = async (key) => {
    const result = (!ISSERVER) && await localStorage.getItem(key);
    return result;
};

export const removeLocalStorage = async (key) => {
    (!ISSERVER) && await localStorage.removeItem(key);
};

export const CheckFile = ({ file, size, type = [], message = "" }) => {
    if (!type.includes(file.type) && type.length > 0) {
        return message ? message : `รองรับเฉพาะไฟล์ประเภท ${type.join(",")}`
    }
    if (file.size / 1000 / 1000 > size) {
        return `Please upload a file smaller than ${size} MB`
    } else {
        return "";
    }
};


export const ConvertHMS = (value) => {
    const sec = parseInt(value, 10); // convert value to number if it's string
    let hours = Math.floor(sec / 3600); // get hours
    let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
    let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
    // add 0 if value < 10; Example: 2 => 02
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds; // Return is HH : MM : SS
}


export const ConvertMS = (value) => {
    const sec = parseInt(value, 10); // convert value to number if it's string
    let hours = Math.floor(sec / 3600); // get hours
    let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
    let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
    // add 0 if value < 10; Example: 2 => 02
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return minutes + ':' + seconds; // Return is HH : MM : SS
}

export const ValidateInput = (value, type) => {
    var responseMessage = "";
    if (type == "email") {
        if (!validator.isEmail(value)) {
            responseMessage = "รูปแบบอีเมลไม่ถูกต้อง"
        };
    }
    else if (type == "mobile") {
        if (!validator.isMobilePhone(value)) {
            responseMessage = "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง"
        } else {
            var phoneno = /^\d{10}$/;
            if (value.length == 0) {
                return "";
            }
            if (value.match(phoneno)) {
                return "";
            } else {
                responseMessage = "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง"
            }
        }
    }
    else if (type == "phone") {
        if (!validator.isMobilePhone(value)) {
            responseMessage = "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง"
        } else {
            var phoneno = /^\d{9}$/;
            if (value.length == 0) {
                return "";
            }
            if (value.match(phoneno)) {
                return "";
            } else {
                responseMessage = "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง"
            }
        }
    } else if (type == "idcard") {
        var sum = 0;
        if (value.substring(0, 1) == 0) return "รูปแบบบัตรประชาชนไม่ถูกต้อง";
        if (value.length != 13) return "รูปแบบบัตรประชาชนไม่ถูกต้อง";
        for (var i = 0; i < 12; i++)
            sum += parseFloat(value.charAt(i)) * (13 - i);
        if ((11 - sum % 11) % 10 != parseFloat(value.charAt(12))) return "รูปแบบบัตรประชาชนไม่ถูกต้อง";
        return ""
    }
    return responseMessage;
}

export const CheckPriceBox = (priceObject, item) => {
    if (item.type_name == "Cool Box") {
        if (item.service_name == "แช่เย็น") {
            return priceObject[`cool_chilled_${item.size_name.toLowerCase()}`]
        }
        else if (item.service_name == "แช่แข็ง") {
            return priceObject[`cool_frozen_${item.size_name.toLowerCase()}`]
        }
    }
    else if (item.type_name == "Foam Box") {
        return priceObject[`foam_${item.size_name.toLowerCase()}`]
    }
    else if (item.type_name == "Test Box") {
        return 200;
    }
}