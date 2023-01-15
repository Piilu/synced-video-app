import { type NextPage } from "next";
import { Text, Container, Title, Anchor, Paper, Box, TextInput, Button } from "@mantine/core";
import { useForm } from "@mantine/form";

const Home: NextPage = () => {
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

  const handleLogin = () => {
    console.log(form.values)
  }
  return (
    <main style={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "100vh" }}>
      <Container >
        <Paper style={{ padding: "2em"}} withBorder shadow="md" p={30} mt={30} radius="md">
          <div style={{ marginBottom: "1em" }}>
            <Title
              align="center">
              Welcome back!
            </Title>
          </div>

          <Box sx={{ maxWidth: 300 }} mx="auto">
            <form onSubmit={form.onSubmit(() => handleLogin())}>
              <TextInput
                style={{ marginBottom: "1em" }}
                withAsterisk
                label="Email"
                placeholder="your@email.com"
                {...form.getInputProps('email')}
              />

              <TextInput
                withAsterisk
                label="Password"
                placeholder="Password"
                type="password"
                {...form.getInputProps('password')}
              />
                <Button type='submit' fullWidth mt="xl">
                  Sign in
                </Button>
            </form>
          </Box>
          <Text color="dimmed" size="sm" align="center" mt={5}>
            Do not have an account yet?{' '}
            <Anchor<'a'> href="/signup" size="sm" onClick={(event) => event.preventDefault()}>
              Create account
            </Anchor>
          </Text>
        </Paper>
      </Container>

    </main>
  );
};

export default Home;
