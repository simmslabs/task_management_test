import { Badge, Card, Group, HoverCard, Popover, RingProgress, Text, createStyles, rem } from '@mantine/core';
import { useNavigate } from '@remix-run/react';
import React, { useEffect, useState } from 'react'
import { Activity, Task } from '~/types';

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  label: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
    lineHeight: 1,
  },

  lead: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
    fontSize: rem(22),
    lineHeight: 1,
  },

  inner: {
    display: 'flex',

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  ring: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',

    [theme.fn.smallerThan('xs')]: {
      justifyContent: 'center',
      marginTop: theme.spacing.md,
    },
  },
}));

interface StatsRingCardProps {
  task: Task;
}

function ProjectTaskCard({ task }: StatsRingCardProps) {
  const { classes, theme } = useStyles();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [percentage, setPercentage] = useState(0);
  const [items, setItems] = useState<any[]>([]);

  const nav = useNavigate();

  useEffect(() => {
    if (task) {
      setActivities(task.activities);
    }
  }, [task]);

  useEffect(() => {
    if (Array.isArray(activities)) {
      setItems(activities.map((a, i) => (
        <div key={a.title}>
          <Text size="xs" className={classes.label}>{a.title}</Text>
          <Badge color={a.status == "completed" ? "green" : "red"} size="xs">
            {a.status}
          </Badge>
        </div>
      )));
      const perc = ((activities.filter(a => a.status == "completed").length / activities.length) * 100).toFixed(0);
      if (Number(perc)) {
        setPercentage(Number(perc));
      };
    }
  }, [activities, classes.label]);

  return (
    <HoverCard withArrow >
      <HoverCard.Target>
        <Card onClick={() => nav(`task/${task.id}`)} withBorder p="xl" radius="md" className={classes.card}>
          <div className={classes.inner}>
            <div>
              <Text fz="xl" className={classes.label}>
                {task.title}
              </Text>
              {percentage == 100 ?
                <Badge>Completed</Badge> : <Badge color={task.status == "complete" ? "green" : "red"}>{task.status}</Badge>
              }
              <div>
                <Text className={classes.lead} mt={30}>
                  {activities.filter(a => a.status == "completed").length}
                </Text>
                <Text fz="xs" color="dimmed">
                  Completed
                </Text>
              </div>
            </div>

            <div className={classes.ring}>
              <RingProgress
                roundCaps
                thickness={6}
                size={150}
                sections={[{ value: (activities.filter(a => a.status == "completed").length / activities.length) * 100, color: theme.primaryColor }]}
                label={
                  <div>
                    <Text ta="center" fz="lg" className={classes.label}>
                      {percentage}%
                    </Text>
                    <Text ta="center" fz="xs" c="dimmed">
                      Completed
                    </Text>
                  </div>
                }
              />
            </div>
          </div>
        </Card>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Group mt="lg">{items}</Group>
      </HoverCard.Dropdown>
    </HoverCard>
  )
}

export default ProjectTaskCard;