/* eslint-disable jsx-a11y/anchor-has-content */
import { AppShell, Avatar, Box, Button, Card, Divider, Grid, Group, LoadingOverlay, NavLink, Navbar, Stack, Text, TextInput } from "@mantine/core";
import type { LoaderFunction, V2_MetaFunction } from "@remix-run/node";
import { Link, Outlet, useLocation, useNavigate, useNavigation, useRouteLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { GrHome, GrTask } from "react-icons/gr";
import ProjectTaskCard from "~/components/ProjectTaskCard";
import { use_user_store } from "~/services/states";
import type { Task } from "~/types";
import { NavigationProgress, resetNavigationProgress, startNavigationProgress } from "@mantine/nprogress";
import axios from "axios";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Task Manager" }];
};

export const loader: LoaderFunction = () => {
  return null;
}

export default function Index() {

  const user = use_user_store(s => s.user);
  const loc = useLocation();
  const [_tasks, setTasks] = useState<Task[]>([]);
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const root_data = useRouteLoaderData("root") as unknown as { tasks: Task[] } | null;
  useEffect(() => {
    if (root_data && "tasks" in root_data) {
      if (Array.isArray(root_data.tasks)) {
        setTasks(root_data.tasks);
      }
    }
  }, [root_data]);

  const transition = useNavigation();
  const location = useLocation();

  useEffect(() => {
    resetNavigationProgress();
    if (transition.state == "loading") {
      startNavigationProgress()
    }
    if (transition.state == "idle") {
      resetNavigationProgress();
    }
  }, [transition.state, location.pathname, location.key]);

  const _log_out = async () => {
    const resp = (await axios.get<boolean | null>("/api/auth/logout")).data;
    if (resp) {
      nav("/login");
    }
  }

  return (
    <>
      {user && (
        <>
          <NavigationProgress withinPortal={false} color="orange" />
          <AppShell
            padding="md"
            navbar={
              <Navbar bg="#f8f8f8" p="xs" width={{ base: 250 }}>
                <Stack>
                  <Text weight="bold" size="xl">Dashboard</Text>
                  <Divider />
                  <NavLink icon={<GrHome />} component={Link} to="/dashboard" label="Home" />
                  <NavLink component={Link} to="task/add" icon={<GrTask />} label="Add Tasks" />
                </Stack>
                <Box sx={{ flex: 1 }} />
                <Card p={2} withBorder>
                  <Group>
                    <Avatar radius="xl">S</Avatar>
                    <Stack spacing={0} sx={{ flex: 1 }} align="stretch">
                      <Text color="dimmed" size="xs">{user.name}</Text>
                      <Button onClick={() => _log_out()} variant="light" color="red">Logout</Button>
                    </Stack>
                  </Group>
                </Card>
              </Navbar>
            }
          >
            {loc.pathname == "/dashboard" ?
              <Stack>
                <LoadingOverlay visible={loading} />
                <TextInput type="search" placeholder='Search for tasks, tags, team members' variant="filled" radius="md" />
                <Grid>
                  {_tasks.map((task, i) => (
                    <Grid.Col key={i} md={3}>
                      <ProjectTaskCard task={task} />
                    </Grid.Col>
                  ))}
                </Grid>
              </Stack>
              :
              <Outlet />
            }
          </AppShell>
        </>
      )}
    </>
  );
}