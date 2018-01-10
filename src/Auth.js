import { UserAgentApplication, Logger } from 'msal';
import Promise from 'promise';

const adAppId = process.env.REACT_APP_AD_CLIENT_ID;
const adGraphScope = ["user.read"];
const TokenStoreKey = 'AD.Token';

function adHandleToken(token, resolve) {
    localStorage.setItem(TokenStoreKey, token);
    resolve();
}

function adHandleError(error) {
    console.error(`AD: ${error}`);
}

function authCallback(errorMessage, token, error, tokenType) {
    if (!errorMessage && token) {
        console.log('received token');
    } else {
        this.adHandleError(error);
    }
}

export default class AuthClient {
    init() {
        this.adApp = new UserAgentApplication(
            adAppId,
            "https://login.microsoftonline.com/microsoft.onmicrosoft.com",
            authCallback,
            {
                cacheLocation: 'localStorage',
                logger: new Logger((level, message, containsPII) => {
                    const logger = level === 0 ? console.error : level === 1 ? console.warn : console.log;
                    logger(`AD: ${message}`);
                })
            }
        )

        return this;
    }
    adLogin(callback) {
        return new Promise((resolve, reject) => {
            if (this.adApp) {
                this.adApp.loginPopup(adGraphScope).then(idToken => {
                    this.adApp.acquireTokenSilent(adGraphScope)
                        .then(token=>adHandleToken(token, resolve))
                        .catch(error => {
                            this.adApp.acquireTokenPopup(adGraphScope)
                                .then(tokenErr=>adHandleToken(tokenErr, resolve))
                                .catch(adHandleError);
                        });
                }).catch(adHandleError);
            } else {
                reject('trying to call adLogin before authclient is initialized');
            }
        });
    }
    getUsername() {
        return this.adApp.getUser().name;
    }
    isLoggedIn() {
        return this.adApp.getUser() && this.adApp.getUser().name && this.getToken();
    }
    getToken() {
        return localStorage.getItem(TokenStoreKey);
    }
    adLogout() {
        return new Promise((resolve, reject) => {
            this.adApp.logout();
            localStorage.removeItem(TokenStoreKey);
            resolve();
        }).catch(adHandleError);
    }
}