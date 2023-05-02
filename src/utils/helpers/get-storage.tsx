import axios from "axios";
import { EndPoints } from "../../constants/GlobalEnums";
import { UserResBody } from "../../pages/api/profile/user";

export const getUserStorage = async (): Promise<number | null | undefined> =>
{
    const response = (await axios.get(`${window.origin}${EndPoints.USER}`, { params: { storage: true } })).data as UserResBody;
    return response.usedStorage;
}