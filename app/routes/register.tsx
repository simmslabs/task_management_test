import { Alert, Button, Container, Grid, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { useState } from 'react'
import type { RegistrationZodType } from '~/services/zod-types';
import { RegistrationZod } from '~/services/zod-types';
import axios from "axios";
import { useForm } from "react-hook-form";
import { Form, useNavigate } from '@remix-run/react';

function RegisterPage() {

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const form = useForm<RegistrationZodType>();

  const _register = async (data: RegistrationZodType) => {
    setError("");
    const _data = RegistrationZod.safeParse(data);
    if (!_data.success) {
      setError(_data.error.errors[0].message);
      return false;
    }
    setLoading(true);
    try {
      const _data = (await axios.post<{ success: boolean; message: string }>("/api/auth/register", data)).data;
      if (_data.success) {
        nav("/login")
      } else {
        setError(`${_data.message}`);
      }
    } catch (error) {
      setError(JSON.stringify(error));
    }
    setLoading(true);

  };

  return (
    <Container className="w-full flex-1 flex flex-col">
      <Grid justify="center" className='flex-1 justify-center p-0 m-0'>
        <Grid.Col sm={4} md={4}>
          <Form onSubmit={form.handleSubmit(_register)}>
            <Stack>
              <Stack spacing={0}>
                <Title>Register</Title>
                <Text color="dimmed">Enter your credentials to register</Text>
              </Stack>
              <TextInput placeholder='Full name' {...form.register("full_name")} />
              <TextInput placeholder='Email address' {...form.register("email")} />
              <PasswordInput placeholder='Password' {...form.register("password")} />
              <PasswordInput placeholder='Confirm Password' {...form.register("confirm_password")} />
              {error && (<Alert color='red' variant='filled'>{error}</Alert>)}
              <Button loading={loading} type='submit'>Register</Button>
            </Stack>
          </Form>
        </Grid.Col>
      </Grid>
    </Container>
  )
}

export default RegisterPage;