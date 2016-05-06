/// <reference path="../typings/jquery/jquery.d.ts" />

module Terrain.HttpClients {

    export class BaseHttpClient {

        private static USE_SSL: boolean = false;
        private static WEB_API_BASE_URL: string = "localhost:54516"; //"wtwd.cloudapp.net/TerrainGenerator"; //"localhost/TerrainGenerator"; //"localhost:54516"

        private static CSRF_TOKEN_KEY:string = "access_token";
        private static CSRF_TOKEN_EXPIRATION_KEY: string = "access_token_expiration";
        private static AUTHORIZATION_HEADER: string = "Authorization";
        private static AUTHORIZATION_HEADER_AUTHENTICATED: (data: string) => void = accessToken => "Bearer " + accessToken;        

        constructor() {
        }

        public _doRequestJson(verb: string, route: string, data: any, success: (data: any) => void, failure?: (textStatus: string, errorThrown: string) => void): boolean {

            var accountManager = Terrain.Account.AccountManager.GetInstance();
            var token = accountManager.GetToken();

            if (token.access_token == null) {
                return false;
            }

            var isGet: boolean = true;
            if (verb != "GET") {
                isGet = false;
            }

            var headers: { [key: string]: any; } = {};
            headers[BaseHttpClient.AUTHORIZATION_HEADER] = BaseHttpClient.AUTHORIZATION_HEADER_AUTHENTICATED(token.access_token);

            //dataType: isGet ? "json" : null,
            var jQryAjxSetting: JQueryAjaxSettings = {
                url: this.GetUrl(route),
                type: verb,
                contentType: "application/json; charset=utf-8",
                dataType: "json", 
                async: true,
                data: isGet ? data : JSON.stringify(data),
                headers: headers,
                error: (jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => {
                    if (failure) {
                        failure(textStatus, errorThrown);
                    }
                },
                success: (data: any, textStatus: string, jqXHR: JQueryXHR) => { success(data); }
            };

            $.ajax(jQryAjxSetting);

            return true;
        }

        public _doRequest(verb: string, route: string, data: any, success: (data: any) => void, failure?: (textStatus: string, errorThrown: string) => void): boolean {

            var accountManager = Terrain.Account.AccountManager.GetInstance();
            var token = accountManager.GetToken();

            if (token.access_token == null) {
                return false;
            }

            var headers: { [key: string]: any; } = {};
            headers[BaseHttpClient.AUTHORIZATION_HEADER] = BaseHttpClient.AUTHORIZATION_HEADER_AUTHENTICATED(token.access_token);

            var jQryAjxSetting: JQueryAjaxSettings = {
                url: this.GetUrl(route),
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

        public GetUrl(route: string): string {

            var protocol: string = "http://";

            if (BaseHttpClient.USE_SSL) {
                protocol = "https://";
            }

            return protocol + BaseHttpClient.WEB_API_BASE_URL + route;
        }
    }
}   