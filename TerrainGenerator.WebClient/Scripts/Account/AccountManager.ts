module Terrain.Account {

    export class AccountManager  {

        private static instance: AccountManager;
        private static accountKey: string = "accountKey";
        private static access_token: string = "access_token";
        private static token_type: string = "token_type";
        private static expires_in: string = "expires_in";

        constructor() {
            AccountManager.instance = this;
        }

        public static GetInstance(): AccountManager {
            if (AccountManager.instance == null) {
                AccountManager.instance = new AccountManager();
            }

            return AccountManager.instance;
        }

        public IsLoggedIn(): boolean {
            return sessionStorage.getItem(AccountManager.accountKey) != null
                && sessionStorage.getItem(AccountManager.access_token) != null;
        }

        public SetAccountEmail(accountEmail: string): void {
            sessionStorage.setItem(AccountManager.accountKey, accountEmail);
        }

        public GetAccountEmail(): string {
            return <string>sessionStorage.getItem(AccountManager.accountKey);
        }

        public SetToken(token: IToken): void {
            sessionStorage.setItem(AccountManager.access_token, token.access_token);
            sessionStorage.setItem(AccountManager.token_type, token.token_type);
            sessionStorage.setItem(AccountManager.expires_in, token.expires_in.toString());
        }

        public GetToken(): IToken {
            var token : IToken =    
            {
                access_token: <string>sessionStorage.getItem(AccountManager.access_token),
                token_type: <string>sessionStorage.getItem(AccountManager.token_type),
                expires_in: parseInt(sessionStorage.getItem(AccountManager.expires_in)),

            }
            return token;
        }

        public Clear(): void {
            sessionStorage.clear();
        }
    }
}  
 