/// <reference path="../typings/jquery/jquery.d.ts" />

module Terrain.HttpClients {

    export class BaseHttpClient {

        private static CSRF_TOKEN_KEY:string = "access_token";
        private static CSRF_TOKEN_EXPIRATION_KEY: string = "access_token_expiration";
        private static AUTHORIZATION_HEADER: string = "Authorization";
        private static AUTHORIZATION_HEADER_AUTHENTICATED: (data: string) => void = accessToken => "Bearer " + accessToken;        

        constructor() {
        }

        public _doRequestJson(verb: string, url: string, data: any, success: (data: any) => void, failure?: (textStatus: string, errorThrown: string) => void): boolean {

            var accountManager = Terrain.Account.AccountManager.GetInstance();
            var token = accountManager.GetToken();

            if (token.access_token == null) {
                return false;
            }

            var headers: { [key: string]: any; } = {};
            headers[BaseHttpClient.AUTHORIZATION_HEADER] = BaseHttpClient.AUTHORIZATION_HEADER_AUTHENTICATED(token.access_token);

            var jQryAjxSetting: JQueryAjaxSettings = {
                url: url,
                type: verb,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: true,
                data: data,
                headers: headers,
                error: (jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => {
                    if (failure) {
                        failure(textStatus, errorThrown);
                    }
                },
                success: (data: any, textStatus: string, jqXHR: JQueryXHR) => { success(data); },
            };

            $.ajax(jQryAjxSetting);

            return true;
        }

        public _doRequest(verb: string, url: string, data: any, success: (data: any) => void, failure?: (textStatus: string, errorThrown: string) => void): boolean {

            var accountManager = Terrain.Account.AccountManager.GetInstance();
            var token = accountManager.GetToken();

            if (token.access_token == null) {
                return false;
            }

            var headers: { [key: string]: any; } = {};
            headers[BaseHttpClient.AUTHORIZATION_HEADER] = BaseHttpClient.AUTHORIZATION_HEADER_AUTHENTICATED(token.access_token);

            var jQryAjxSetting: JQueryAjaxSettings = {
                url: url,
                type: verb,
                //contentType: "application/json; charset=utf-8",
                //dataType: "json",
                async: true,
                data: data,
                headers: headers,
                error: (jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => {
                    if (failure) {
                        failure(textStatus, errorThrown);
                    }
                },
                success: (data: any, textStatus: string, jqXHR: JQueryXHR) => { success(data); },
            };

            $.ajax(jQryAjxSetting);

            return true;
        }        
    }
}   