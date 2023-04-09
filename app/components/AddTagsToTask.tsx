import { Box, Button, MultiSelect, Stack } from '@mantine/core';
import React from 'react'
import { Task } from '~/types';

const AddTagsToTask: React.FC<{ task: Task }> = ({ task }) => {
  return (
    <Box>
      <Stack>
        <MultiSelect data={[]} />
        <Button>Save</Button>
      </Stack>
    </Box>
  )
}

export default AddTagsToTask;