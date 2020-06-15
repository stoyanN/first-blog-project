const baseUrl = "https://baas.kinvey.com";
const apiKey = "kid_rkptHvQp8";
const appSecret = "e8e742a958e84fa9a3a42a4956313eab";

function createAuthorization(type) {
    return type === "Basic" ?
        `Basic ${btoa(`${apiKey}:${appSecret}`)}`
    : `Kinvey ${localStorage.getItem("authtoken")}`;
}

function createHeader(authType, httpMethod, data) {
    const header = {
        method: httpMethod,
        headers: {
            "Authorization": createAuthorization(authType),
            "Content-Type": "application/json"
        }
    };

    if (httpMethod === "PUT" || httpMethod === "POST") {
        header.body = JSON.stringify(data);
    }

    return header;
}


function errorHandler(e) {
    if (!e.ok) {
        throw new Error(e.statusText);
    }

    return e;
}

function deserializeData(x) {
    if (x.status === 204) {
        return x;
    }

    return x.json();
}

function fetchData(folderName, endpoint, headers) {
    const url = `${baseUrl}/${folderName}/${apiKey}/${endpoint}`;

    return fetch(url, headers).then(errorHandler).then(deserializeData);
}

export function getData(authType, folderName, endpoint) {
    const header = createHeader(authType, "GET");

    return fetchData(folderName, endpoint, header);
}

export function postData(authType, folderName, endpoint, data) {
    const header = createHeader(authType, "POST",data);

    return fetchData(folderName, endpoint, header)
}

export function putData(authType, folderName, endpoint, data) {
    const header = createHeader(authType, "PUT", data);

    return fetchData(folderName, endpoint, header);
}

export function deleteData(authType, folderName, endpoint) {
    const header = createHeader(authType, "DELETE");

    return fetchData(folderName, endpoint, header);
}

export function logOutUser(authType, folderName, endpoint, data) {
    const header = createHeader(authType, "POST", data);
    
    const url = `${baseUrl}/${folderName}/${apiKey}/${endpoint}`;
    
    return fetch(url, headers).then(errorHandler);
}


export function registerUser(authType, folderName, endpoint, data) {
    const header = createHeader(authType, "POST", data);

    return fetchData(folderName, endpoint, header);
}