module Terrain.HttpClients {

    export class AccountHttpClient extends BaseHttpClient {

        private static instance: AccountHttpClient;

        private static LOGGING_DATA: any = { grant_type: 'password' };
        private static AUTHORIZATION_HEADER_LOGGING_IN: (accountLoggingIn: string) => void = accountLoggingIn => "Basic " + accountLoggingIn;        

        constructor() {            
            AccountHttpClient.instance = this;
            super();
        }

        public static GetInstance(): AccountHttpClient {
            if (AccountHttpClient.instance == null) {
                AccountHttpClient.instance = new AccountHttpClient();
            }

            return AccountHttpClient.instance;
        }

        public Register(accountEmail: string, accountPassword: string, confirmAccountPassword: string, success: (data: any) => void, failure?: (textStatus: string, errorThrown: string) => void): void {

            var accountManager = Terrain.Account.AccountManager.GetInstance();
            accountManager.Clear();

            var data = {
                Email: accountEmail,
                Password: accountPassword,
                ConfirmPassword: confirmAccountPassword
            };

            var jQryAjxSetting: JQueryAjaxSettings = {
                url: this.GetUrl('/api/Account/Register'),
                type: "POST",
                contentType: "application/json; charset=utf-8",
                //dataType: "json",
                async: true,
                data: JSON.stringify(data),
                error: (jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => {
                    if (failure) {
                        failure(textStatus, errorThrown);
                    }
                },
                success: (data: any, textStatus: string, jqXHR: JQueryXHR) => {
                    success(data);
                },
            };

            $.ajax(jQryAjxSetting);
        }

        public LogIn(accountEmail: string, accountPassword: string, success: (data: any) => void, failure?: (textStatus: string, errorThrown: string) => void): void {

            var accountManager = Terrain.Account.AccountManager.GetInstance();
            accountManager.Clear();

            var headers: { [key: string]: any; } = {};
            headers["Authorization"] = AccountHttpClient.AUTHORIZATION_HEADER_LOGGING_IN(btoa(accountEmail + ":" + accountPassword));

            var jQryAjxSetting: JQueryAjaxSettings = {
                url: this.GetUrl('/Token'),
                type: "POST",
                contentType: "application/json; charset=utf-8",
                //dataType: "json",
                async: true,
                data: AccountHttpClient.LOGGING_DATA,
                headers: headers,
                error: (jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => {
                    if (failure) {
                        failure(textStatus, errorThrown);
                    }
                },
                success: (data: any, textStatus: string, jqXHR: JQueryXHR) => {
                    accountManager.SetAccountEmail(accountEmail);
                    accountManager.SetToken(data);
                    success(data);
                },
            };

            $.ajax(jQryAjxSetting);
        }

        public UpdateLocation(data: any, success: (data: any) => void, failure?: (textStatus: string, errorThrown: string) => void): void {

            this._doRequestJson("PUT", "/api/Account/Location", data, success, failure);
        }
    }
}   