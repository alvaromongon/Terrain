module Terrain.Account {

    export interface IAccountManager {

        IsLoggedIn(): boolean;

        SetAccountId(accountId: string): void;
        
        GetAccountId(): string;

        SetToken(token: IToken): void;

        GetToken(): IToken;

        Clear(): void;

    }
}  
 