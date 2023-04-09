/* eslint-disable jsx-a11y/anchor-has-content */
import { AppShell, Avatar, Box, Button, Card, Divider, Grid, Group, Header, NavLink, Navbar, Stack, Text, TextInput } from "@mantine/core";
import type { LoaderFunction, V2_MetaFunction } from "@remix-run/node";
import { Link, Outlet, useLocation, useMatches, useRouteLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { AiOutlineProject } from "react-icons/ai";
import { GrHome, GrTask } from "react-icons/gr";
import { use_user_store } from "~/services/states";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export const loader: LoaderFunction = () => {
  return null;
}

export default function Index() {

  const user = use_user_store(s => s.user);
  const loc = useLocation();
  console.log(loc);
  return (
    <>
      {user && (
        <AppShell
          padding="md"
          navbar={
            <Navbar bg="#f8f8f8" p="xs" width={{ base: 250 }}>
              <Stack>
                <Text weight="bold" size="xl">Dashboard</Text>
                <Divider />
                <NavLink icon={<GrHome />} component={Link} to="/" label="Home" />
                <NavLink icon={<GrTask />} label="Tasks">
                  <NavLink component={Link} to="task/add" label="Add" />
                  <NavLink label="List" />
                </NavLink>
              </Stack>
              <Box sx={{ flex: 1 }} />
              <Card p={2} withBorder>
                <Group>
                  <Avatar radius="xl">S</Avatar>
                  <Stack spacing={0} sx={{ flex: 1 }} align="stretch">
                    <Text color="dimmed" size="xs">{user.name}</Text>
                    <Button variant="light" color="red">Logout</Button>
                  </Stack>
                </Group>
              </Card>
            </Navbar>
          }
        >
          {loc.pathname == "/" ?
            <Grid>
              { }
            </Grid> :
            <Outlet />
          }
        </AppShell>
      )}
    </>
  );
}