const baseUrl = "https://api.backendless.com";
const apiId = "4ADC6220-9988-B2BF-FFFF-6D0C6BA55A00";
const restApiKey = "03FB34BD-E699-428D-ABEC-7EA79BFB92BF";


function createHeader(httpMethod, data, authToken) {
    const header = {
        method: httpMethod,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (authToken !== null) {
        header.headers["user-token"] = authToken;
    }

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
    const url = `${baseUrl}/${apiId}/${restApiKey}/${folderName}/${endpoint}`;

    return fetch(url, headers).then(errorHandler).then(deserializeData);
}

export function getData(folderName, endpoint, authToken) {
    const header = createHeader("GET", {} , authToken);

    return fetchData(folderName, endpoint, header);
}

export function postData(folderName, endpoint, data, authToken) {
    const header = createHeader("POST", data, authToken);

    return fetchData(folderName, endpoint, header);
}

export function putData(folderName, endpoint, data, authToken) {
    const header = createHeader("PUT", data, authToken);

    return fetchData(folderName, endpoint, header);
}

export function deleteData(folderName, endpoint, authToken) {
    const header = createHeader("DELETE", {}, authToken);
    const url = `${baseUrl}/${apiId}/${restApiKey}/${folderName}/${endpoint}`;

    return fetch(url, header).then(errorHandler);
}

export function logOutUser(folderName, endpoint, authToken) {
    const header = createHeader("GET", {} , authToken);
    const url = `${baseUrl}/${apiId}/${restApiKey}/${folderName}/${endpoint}`;

    
    return fetch(url, header).then(errorHandler);
}


export function registerUser(authToken, folderName, endpoint, data) {
    const header = createHeader(authToken, "POST", data);

    return fetchData(folderName, endpoint, header);
}