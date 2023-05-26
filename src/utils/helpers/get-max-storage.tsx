import axios from "axios";
import { EndPoints } from "../../constants/GlobalEnums";
import { UserResBody } from "../../pages/api/profile/user";
import { UsersResBody } from "../../pages/api/admin";

export const getUserMaxStorage = async (): Promise<number | null | undefined> =>
{
    const response = (await axios.get(`${window.origin}${EndPoints.ADMIN}`)).data as UsersResBody;
    return response.maxGb;
}