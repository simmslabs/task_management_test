import { Button, Card, Container, Group, Stack, Text, TextInput, Textarea, Title } from '@mantine/core';
import React, { useState } from 'react'
import { DateInput } from '@mantine/dates';
import { useForm } from 'react-hook-form';
import { task } from '@prisma/client';
import { Form, useNavigate } from '@remix-run/react';
import axios from 'axios';

function AddTaskPanel() {

  const form = useForm<task>();

  const [start_date, setStart_date] = useState<Date | null>(new Date());
  const [end_date, setEnd_date] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const _submit = async (data: task) => {
    if (start_date) {
      data.start_date = start_date;
    }
    if (end_date) {
      data.end_date = end_date;
    }
    setLoading(true);
    try {
      try {
        const resp = (await axios.post<task | null>("/api/task", data)).data;
        if (resp) {
          window.location.href = `/dashboard/task/${resp.id}`;
        }
      } catch (error) {
        console.log(data);
      }
    } catch (error) {
    }
    setLoading(false);
  }

  return (
    <Container size="xs">
      <Card shadow="xl">
        <Form onSubmit={form.handleSubmit(_submit)}>
          <Stack>
            <Group>
              <Stack spacing={0}>
                <Title>Add Task</Title>
                <Text color="dimmed">Enter task details to add.</Text>
              </Stack>
            </Group>
            <TextInput required placeholder="Title" {...form.register("title")} />
            <Textarea placeholder="Description" {...form.register("description")} />
            <Group grow>
              <DateInput required placeholder='Start Date' onChange={(d) => setStart_date(d)} value={start_date} />
              <DateInput required placeholder='End Date' onChange={(d) => setEnd_date(d)} value={end_date} />
            </Group>
            <Button loading={loading} type="submit">Save</Button>
          </Stack>
        </Form>
      </Card>
    </Container>
  )
}

export default AddTaskPanel;