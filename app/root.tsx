import type { LinksFunction, LoaderFunction, MetaFunction, V2_MetaFunction } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react';
import { MantineProvider, createEmotionCache } from '@mantine/core';
import { StylesPlaceholder } from '@mantine/remix';
import Header from './components/Header';
import main_style from "~/tailwind.css";
import { auth_middleware } from './services/helpers.server';
import { useEffect } from 'react';
import { use_user_store } from './services/states';
import { ModalsProvider } from '@mantine/modals';
import { AddAssignee } from './components/my_context_modals';
// import { theme } from './theme';

export const meta: V2_MetaFunction = () => ([{
  charset: 'utf-8',
  title: 'Task Manager',
  viewport: 'width=device-width,initial-scale=1',
}]);

export const links: LinksFunction = () => ([
  {
    rel: "stylesheet",
    href: main_style
  }
]);

export const loader: LoaderFunction = async ({ request }) => {
  let _data: any = {};
  const auth = await auth_middleware(request);
  if (auth) {
    _data.user = auth.user;
    const tasks = await prisma?.task.findMany({
      where: {
        OR: [
          {
            user_id: auth.user.id
          },
          {
            user_tasks: {
              some: {
                user_id: auth.user.id
              }
            }
          }
        ]
      },
      include: {
        activities: {
          include: {
            activity_users: true,
            comments: true,
            task: true,
            user: true
          }
        }
      },
      orderBy: [{
        created_at: "desc"
      }]
    });
    _data.tasks = tasks;
  }
  return _data;
}

createEmotionCache({ key: 'mantine' });

export default function App() {

  const set_user = use_user_store(s => s.set);
  const user = use_user_store(s => s.user);

  const data = useLoaderData();

  useEffect(() => {
    if (data) {
      if (data.user) {
        set_user(data.user);
      }
    }
  }, [data, set_user])

  return (
    <MantineProvider theme={{
      components: {
        Badge: {
          defaultProps: (theme) => ({
            radius: 2
          })
        },
        TextInput: {
          defaultProps: (theme) => ({
            sx: {
              input: {
                // borderWidth: 2
              }
            }
          })
        },
        Button: {
          defaultProps: (theme) => ({
            color: "teal"
          })
        }
      }
    }} withGlobalStyles withNormalizeCSS>
      <ModalsProvider>
        <html lang="en">
          <head>
            <StylesPlaceholder />
            <Meta />
            <Links />
          </head>
          <body className='h-screen flex flex-col'>
            {!user && (
              <Header />
            )}
            <Outlet />
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </body>
        </html>
      </ModalsProvider>
    </MantineProvider>
  );
}