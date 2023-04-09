import { Button, Container, Grid, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { Form, useNavigate } from '@remix-run/react';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type LoginDataType = {
  email: string;
  password: string;
};

function LoginPage() {

  const form = useForm<LoginDataType>();
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const _login = async (data: LoginDataType) => {
    setLoading(true);
    try {
      const resp = (await axios.post<{ success: boolean; message: string }>("/api/auth/login", data)).data;
      if (resp.success) {
        nav("/");
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <Container className="w-full flex-1 flex flex-col">
      <Grid justify="center" className='flex-1 justify-center p-0 m-0'>
        <Grid.Col sm={4} md={4}>
          <Form onSubmit={form.handleSubmit(_login)}>
            <Stack>
              <Stack spacing={0}>
                <Title>Task Man</Title>
                <Text color="dimmed">Enter your credentials to login</Text>
              </Stack>
              <TextInput type="email" {...form.register("email")} />
              <PasswordInput {...form.register("password")} />
              <Button type="submit" loading={loading}>Login</Button>
            </Stack>
          </Form>
        </Grid.Col>
      </Grid>
    </Container>
  )
}

export default LoginPage;