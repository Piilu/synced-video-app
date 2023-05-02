import axios from "axios";
import { EndPoints } from "../../constants/GlobalEnums";
import { UserResBody } from "../../pages/api/profile/user";
import { Role } from "@prisma/client";

export const getUserRole = async (): Promise<Role | null | undefined> =>
{
    const response = (await axios.get(`${window.origin}${EndPoints.USER}`, { params: { storage: false } })).data as UserResBody;
    return response.role;
}