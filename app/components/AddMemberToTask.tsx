import { Box, Button, MultiSelect, Stack, Text } from '@mantine/core';
import { user } from '@prisma/client';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import type { Task } from '~/types';

const AddMemberToTask: React.FC<{ task: Task }> = ({ task }) => {

  const [users, set_users] = useState<user[] | null>([]);

  useEffect(() => {
    (async () => {
      try {
        const users = (await axios.get<user[] | null>("/api/user")).data;
        set_users(users);
        console.log(users);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <Box>
      <Stack>
        <MultiSelect data={[]} />
        <Button>Save</Button>
      </Stack>
    </Box>
  )
}

export default AddMemberToTask;