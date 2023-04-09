import { ActionIcon, Anchor, Avatar, Badge, Box, Breadcrumbs, Button, Group, Menu, Stack, Table, Tabs, Text, TextInput, Title, Tooltip } from '@mantine/core';
import type { LoaderFunction, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { AiFillDelete, AiFillWarning, AiOutlineArrowRight, AiOutlinePlus } from 'react-icons/ai';
import { auth_middleware } from '~/services/helpers.server';
import prisma from '~/services/prisma';
import type { Activity, Task } from '~/types';
import moment from 'moment';
import { modals } from "@mantine/modals";
import NewActivity from '~/components/NewActivity';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Countdown from "react-countdown";
import { use_user_store } from '~/services/states';
import AddMemberToTask from '~/components/AddMemberToTask';
import AddTagsToTask from '~/components/AddTagsToTask';
import ProjectTaskCard from '~/components/ProjectTaskCard';

export const loader: LoaderFunction = async ({ request, params }) => {
  const { id } = params;
  const auth = await auth_middleware(request);
  if (auth && id) {
    const task = await prisma.task.findFirst({
      where: {
        id
      },
      include: {
        user: true,
        activities: {
          include: {
            user: true,
            activity_users: {
              include: {
                user: true
              }
            }
          }
        },
        comment: true,
        task_man_tags: true,
        user_tasks: {
          include: {
            user: true,
          }
        }
      },
      orderBy: [{ created_at: "desc" }]
    });
    return json(task);
  }
  return null;
}

export const meta: V2_MetaFunction = ({ data }) => {
  return [
    {
      title: `Task: ${data.title}`
    }
  ];
}


function TaskViewPanel() {
  const data = useLoaderData<Task | null>();
  const [tabs_value, setTabs_value] = useState<string | null>("activities");
  const [hours, setHours] = useState(0);
  const user = use_user_store(s => s.user);
  const [percentage, setPercentage] = useState(0);
  const nav = useNavigate();

  const _add_activity = () => {
    modals.open({
      id: "new-activity-modal",
      children: <NewActivity task={data as unknown as Task} />,
    });
  }

  const _add_tags_to_task = (task: Task) => {
    modals.open({
      title: `Add Tags to ${task.title}`,
      children: <AddTagsToTask task={task} />
    });
  }

  useEffect(() => {
    if (data) {
      const duration = moment.duration(moment(data.start_date).diff(data.end_date));
      const hours = duration.asHours();
      setHours(Math.ceil(hours));
      const perc = ((data.activities.filter(a => a.status == "completed").length / data.activities.length) * 100).toFixed(0);
      if (Number(perc)) {
        setPercentage(Number(perc));
      };
    }
  }, [data]);

  const _delete_activity = async (act: Activity) => {
    modals.openConfirmModal({
      id: "delete-activity",
      title: "Delete Activity",
      labels: {
        confirm: "Confirm",
        cancel: "Cancel"
      },
      children: <Group noWrap>
        <AiFillWarning style={{ fontSize: 40 }} />
        <Text>Are you sure you want to delete this activity <Text span color="red" fs="italic">{act.title}</Text>?</Text>
      </Group>,
      async onConfirm() {
        try {
          const resp = (await axios.get<boolean | null>(`/api/activity/delete/${act.id}`)).data;
          if (resp) {
            window.location.reload();
          }
        } catch (error) {
          console.log(error);
        }
      },
    });
  }

  const _change_activity_status = async (status: string, activity_id: string) => {
    try {
      const resp = (await axios.post<{ success: boolean; message: string }>(`/api/activity/status/${activity_id}`, { status: status })).data;
      if (resp.success) {
        window.location.reload();
      } else {
        alert(resp.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const _add_members_to_task = (task: Task) => {
    modals.open({
      title: `Add a members to ${task.title}`,
      children: <AddMemberToTask task={task} />
    });
  }

  const _delete_task = (task: Task) => {
    modals.openConfirmModal({
      children: <ProjectTaskCard task={task} />,
      async onConfirm() {
        try {
          const resp = (await axios.get<boolean | null>(`/api/task/delete/${task.id}`)).data;
          if (resp) {
            window.location.href = "/dashboard";
          }
        } catch (error) {
          console.log(error);
        }
      },
      labels: {
        cancel: "Cancel",
        confirm: "Delete"
      }
    });
  }

  return (
    <>
      {data && (
        <Stack>
          <Breadcrumbs>
            {[{ title: 'Tasks', href: "/dashboard/task" }, { title: data.title, href: data.id }].map((m, i) => <Anchor size="xs" color='dimmed' key={i} href={m.href}>{m.title}</Anchor>)}
          </Breadcrumbs>
          <Stack spacing={0}>
            <Title>{data.title}</Title>
            {data.description && (
              <Text color="dimmed">{data.description}</Text>
            )}
          </Stack>
          <Stack>
            <Group grow>
              <Text color="dimmed">Status:</Text>
              <Box>
                {percentage == 100 ?
                  <Badge>Completed</Badge> : <Badge color={data.status == "complete" ? "green" : "red"}>{data.status}</Badge>
                }
              </Box>
            </Group>
            <Group grow>
              <Text color="dimmed">Created by:</Text>
              <Box>
                <Text weight="bold">{data.user.name}</Text>
              </Box>
            </Group>
            <Group grow>
              <Text color="dimmed">Members:</Text>
              <Box>
                <Group>
                  {data.user_tasks.map((t, i) => (
                    <Badge key={i}>{t.user.name}</Badge>
                  ))}
                  <Avatar onClick={() => _add_members_to_task(data as unknown as Task)} color='green' radius="xl"><AiOutlinePlus /></Avatar>
                </Group>
              </Box>
            </Group>
            <Group grow>
              <Text color="dimmed">Deadline:</Text>
              <Box>
                <Text>{moment(data.end_date).format('LL')}</Text>
              </Box>
            </Group>
            <Group grow>
              <Text color="dimmed">Tags:</Text>
              <Box>
                <Group>
                  {data.task_man_tags.map((t, i) => <Badge key={i}>{t.task_tag.title}</Badge>)}
                  <Text onClick={() => _add_tags_to_task(data as unknown as Task)} color="dimmed" size="xs" component='a' href="#">Add more</Text>
                </Group>
              </Box>
            </Group>
            <Box>
              <Button onClick={() => _delete_task(data as unknown as Task)} color="red">Delete</Button>
            </Box>
          </Stack>
          <Tabs variant="outline" value={tabs_value} onTabChange={setTabs_value}>
            <Tabs.List style={{ borderBottom: "none" }} p={5}>
              <Tabs.Tab value="activities">
                <Group>
                  Activities <ActionIcon onClick={() => _add_activity()}><AiOutlinePlus /></ActionIcon>
                </Group>
              </Tabs.Tab>
              <Tabs.Tab value="calendar">Calendar</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel bg="#f8f8f8" p={10} value='activities'>
              <Table>
                <thead>
                  <tr>
                    <th>Assigner</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Members</th>
                    <th>Activity Timer</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.activities.map((d, i) => (
                    <tr key={i}>
                      <td>{d.user.name}</td>
                      <td>{d.title}</td>
                      <td>
                        <Group>
                          <Text color={d.status == "incomplete" ? "red" : "green"}>{d.status}</Text>
                          {user && d.user && d.user.id == user.id && (
                            <Menu>
                              <Menu.Target>
                                <ActionIcon>
                                  <AiOutlineArrowRight />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Item onClick={() => _change_activity_status("completed", d.id)} color="green">Completed</Menu.Item>
                                <Menu.Item onClick={() => _change_activity_status("incomplete", d.id)} color="red">Incompleted</Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          )}
                        </Group>
                      </td>
                      <td>
                        <Avatar.Group>
                          {d.activity_users.map((a, i) => (
                            <Tooltip key={i} label={`${a.user.name}`}>
                              <Avatar />
                            </Tooltip>
                          ))}
                        </Avatar.Group>
                      </td>
                      <td>
                        <Countdown date={moment(d.end_date).toDate()} />
                      </td>
                      <td>
                        <Group>
                          <ActionIcon onClick={() => _delete_activity(d as unknown as Activity)} color="red">
                            <AiFillDelete />
                          </ActionIcon>
                        </Group>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      )}
    </>
  )
}

export default TaskViewPanel;