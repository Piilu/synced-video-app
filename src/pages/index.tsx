import { GetServerSideProps, type NextPage } from "next";
import { Container, Title, Anchor, Paper, Box, TextInput, Button, Divider, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { requireAuth } from "../utils/requireAuth";
import { ClientSafeProvider, getProviders, getCsrfToken, LiteralUnion, signIn } from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers";
import { IconMail } from "@tabler/icons";
import BrandButtons from "../components/custom/BrandButtons";
import Head from "next/head";
import { useRouter } from "next/router";


export const getServerSideProps: GetServerSideProps = async (ctx) =>
{
  const providers = await getProviders()
  const csrfToken = await getCsrfToken(ctx)
  return requireAuth(ctx, ({ session }: any) =>
  {
    return { props: { providers, csrfToken } }
  })

};

const errors = {
  Signin: "Try signng in with a different account.",
  OAuthSignin: "Try signing in with a different account.",
  OAuthCallback: "Try signing in with a different account.",
  OAuthCreateAccount: "Try signing in with a different account.",
  EmailCreateAccount: "Try signing in with a different account.",
  Callback: "Try signing in with a different account.",
  OAuthAccountNotLinked: "To confirm yout identity, sign in with the same account you used originally ",
  EmailSignin: "Failed to send the verification  token",
  CredentialsSignin: "Sign in failed.",
  SessionRequired: "Please sign in to access this page",
  default: "Unable to sign in."
}

const getErrorMessage = (errorType: string) =>
{
  console.log(errorType)
  if (!errorType) return;
  //@ts-ignore
  return errors[errorType]
}

type HomePageProps = {
  providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null
  csrfToken: string | undefined
}

const Home: NextPage<HomePageProps> = (props) =>
{
  const { providers, csrfToken } = props;
  const router = useRouter();
  const { callbackUrl = "/", error: errorType } = router.query;

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => value.length! >= 8 ? null : "Password must be 8 chr long.",

    },
  });

  const handleLogin = (providerId: LiteralUnion<BuiltInProviderType, string>) =>
  {
    signIn(providerId)
  }

  const error = getErrorMessage(errorType as string);
  return (
    <main style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
      <Head>
        <title>Login</title>
      </Head>
      <Container style={{ width: "30em" }} >
        <Title
          align="center"
          sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
        >
          Welcome back!
        </Title>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">

          <Text color="red">{error}</Text>
          {providers && Object.values(providers).map(provider =>
          {
            if (provider.name == "Email")
            {
              return (

                <form key={provider.name} method="post" action="/api/auth/signin/email">
                  <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                  <TextInput
                    style={{ marginBottom: "1em" }}
                    withAsterisk
                    label="Email"
                    name="email"
                    placeholder="your@email.com"
                    {...form.getInputProps('email')}
                  />
                  <Button type="submit" leftIcon={<IconMail />} fullWidth mt="xl">Sign in with Email</Button>
                  <Divider label="Or" labelPosition="center" my="sm" />
                </form>
              )
            }
            return (
              <BrandButtons key={provider.name} onClick={() => signIn(provider.id)} brand={provider.name} />
            )
          })}
        </Paper>
      </Container>

    </main>
  );
};

export default Home;
