import { type IUserCredentials } from "./IUserCredentials";

export interface IAuthResponse extends IUserCredentials {
   isRegistered: boolean;
}
