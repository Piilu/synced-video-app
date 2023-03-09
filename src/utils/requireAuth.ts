import { Session } from "inspector";
import { GetServerSidePropsContext, PreviewData } from "next/types";
import { ParsedUrlQuery } from "querystring";
import { getServerAuthSession } from "../server/common/get-server-auth-session";

export const requireAuth = async (ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>, cb: any) =>
{
  const session = await getServerAuthSession(ctx);
  if (session)
  {
    if (session.user?.name != null)
    {

      return {
        redirect: {
          destination: `/profile/${session?.user?.name}`,
          permanent: false,
        },
      }
    }
    else
    {
      return {
        redirect: {
          destination: `/profile/setup`,
          permanent: false,
        },
      }
    }
  }
  return cb({ session });
}


//Figure out correct types :)