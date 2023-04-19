import axios from "axios";
import { EndPoints } from "../../constants/GlobalEnums";
import { UserResBody } from "../../pages/api/profile/user";

export const getCustomNavs = async (): Promise<number | null | undefined> =>
{
    const response = (await axios.get(`${window.origin}${EndPoints.USER}`)).data as UserResBody;
    return response.usedStorage;
}