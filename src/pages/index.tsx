import { GetServerSideProps, type NextPage } from "next";
import { Container, Title, Anchor, Paper, Box, TextInput, Button, Divider } from "@mantine/core";
import { useForm } from "@mantine/form";
import { requireAuth } from "../utils/requireAuth";
import { ClientSafeProvider, getProviders, getCsrfToken, LiteralUnion, signIn } from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers";
import { IconMail } from "@tabler/icons";
import BrandButtons from "../components/custom/BrandButtons";
import Head from "next/head";


export const getServerSideProps: GetServerSideProps = async (ctx) =>
{
  const providers = await getProviders()
  const csrfToken = await getCsrfToken(ctx)
  return requireAuth(ctx, ({ session }: any) =>
  {
    console.log(session)
    return { props: { providers, csrfToken } }
  })

};


type HomePageProps = {
  providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null
  csrfToken: string | undefined
}

const Home: NextPage<HomePageProps> = (props) =>
{
  const { providers, csrfToken } = props;
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
    console.log(form.values)
    signIn(providerId).catch(err =>
    {
      console.log(err)
      return;
    })
  }
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

          {providers && Object.values(providers).map(provider =>
          {

            if (provider.name == "Email")
            {
              return (
                <div key={provider.name}>
                  <TextInput
                    style={{ marginBottom: "1em" }}
                    withAsterisk
                    label="Email"
                    placeholder="your@email.com"
                    {...form.getInputProps('email')}
                  />
                  <Button onClick={() => handleLogin(provider.id)} leftIcon={<IconMail />} fullWidth mt="xl">Sign in with Email</Button>
                  <Divider label="Or" labelPosition="center" my="sm" />
                </div>
              )
            }
            return (
              <>
                <BrandButtons key={provider.name} onClick={() => signIn(provider.id)} brand={provider.name} />
              </>

            )
          })}
        </Paper>
      </Container>

    </main>
  );
};

export default Home;
