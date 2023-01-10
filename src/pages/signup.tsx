import { type NextPage } from "next";
import { Box, Button, Paper, TextInput, Container, Title, Text, Anchor } from '@mantine/core'
import { useForm } from '@mantine/form';
import React from 'react'

const Signup: NextPage = () => {
    const form = useForm({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        },

        validate: {
            username: (value) => value.length > 3 ? null : "Username must be greater than 3",
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => value.length! >= 8 ? null : "Password must be 8 chr long.",
            // confirmPassword: (value) => value == this.values.password ? null : "Password doesn't match"
        },
    });

    const handleLogin = () => {
        console.log(form.values)
    }
    return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "100vh" }}>
            <Container>

                <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                    <div style={{ marginBottom: "1em" }}>

                        <Title
                            align="center"
                        >
                            Let's get started!
                        </Title>
                    </div>

                    <Box sx={{ maxWidth: 300 }} mx="auto">
                        <form onSubmit={form.onSubmit(() => handleLogin())}>
                            <TextInput
                                style={{ marginBottom: "1em" }}
                                withAsterisk
                                label="Username"
                                placeholder="Username"
                                {...form.getInputProps('username')}
                            />
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

                            {/* <TextInput
                    withAsterisk
                    label="Confirm password"
                    placeholder="Confirm password"
                    type="password"
                    {...form.getInputProps('confirmPassword')}
                /> */}

                            <Button type='submit' fullWidth mt="xl">
                                Sign up
                            </Button>
                        </form>
                    </Box>
                    <Text color="dimmed" size="sm" align="center" mt={5}>
                        Already have an account?{' '}
                        <Anchor<'a'> href="/" size="sm" onClick={(event) => event.preventDefault()}>
                            Login
                        </Anchor>
                    </Text>
                </Paper>
            </Container>
        </div>
    )
}

export default Signup