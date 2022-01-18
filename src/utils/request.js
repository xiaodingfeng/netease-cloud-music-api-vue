import axios from "axios";
export default async function request(method, url, dataType, data) {
    return await axios({
        baseURL: "http://121.37.30.8:3000",
        url: url,
        allowCredentials: true,
        method: method,
        dataType: dataType ? 'application/x-www-form-urlencoded': "application/json",
        params: data
    });
}
