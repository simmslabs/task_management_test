import { Button, Center, MultiSelect, Select, Stack, Text, TextInput, Textarea, Title } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { closeModal } from '@mantine/modals';
import type { activity, activity_users, user } from '@prisma/client';
import { Form } from '@remix-run/react';
import axios from 'axios';
import { useState } from 'react'
import { useForm } from 'react-hook-form';
import type { Activity, Task } from '~/types';

const NewActivity: React.FC<{ task: Task }> = ({ task }) => {
  const form = useForm<Activity>();
  const [start_end_date, setStart_end_date] = useState<[Date | null, Date | null]>([task.start_date, task.end_date]);
  const [loading, setLoading] = useState(false);
  const [task_users, setTask_users] = useState<string[]>([]);
  const _create_activity = async (data: Activity) => {
    if (!start_end_date[0]) {
      return;
    }
    if (!start_end_date[1]) {
      return;
    }
    if (task_users.length == 0) {
      return;
    }
    data.start_date = start_end_date[0];
    data.end_date = start_end_date[1];
    setLoading(true);
    try {
      const resp = (await axios.post<Activity | null>(`/api/activity/${task.id}`, { ...data, user_ids: task_users })).data;
      console.log(resp);
      if (resp && "id" in resp) {
        form.reset();
        closeModal('new-activity-modal');
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);

  }

  return (
    <Form onSubmit={form.handleSubmit(_create_activity)}>
      <Stack>
        <Title>New Activity</Title>
        <MultiSelect onChange={setTask_users} searchable data={task.user_tasks.map(t => ({ label: t.user.name, value: t.user.id }))} />
        <TextInput required placeholder="Title" {...form.register("title")} />
        <Textarea placeholder="Description" {...form.register("description")} />
        <Text>Start To End Date</Text>
        <Center>
          <DatePicker aria-required onChange={setStart_end_date} value={start_end_date} type="range" />
        </Center>
        <Button loading={loading} type="submit">Submit</Button>
      </Stack>
    </Form>
  )
}

export default NewActivity;