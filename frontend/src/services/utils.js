export const __formatDateTime = dateTimeStr => {
    const parts = dateTimeStr.split("T");
    return parts[0].split('-').reverse().join('-') + " à " + parts[1].split('.')[0];
}

// source : https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
export const __parseJwt = token =>  {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};