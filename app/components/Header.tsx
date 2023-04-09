/* eslint-disable jsx-a11y/anchor-has-content */
import { Box, Container, Group, NavLink, Space, Text, createStyles } from '@mantine/core';
import { Link } from '@remix-run/react';
import React from 'react'

const useHeaderStyles = createStyles((theme) => ({
  main_header: {
    borderColor: '#ccc',
    borderBottom: '1px solid #ccc',
  },
  inner_box: {
    paddingTop: 10,
    paddingBottom: 10
  }
}));

function Header() {
  const { classes } = useHeaderStyles();
  return (
    <Box className={classes.main_header}>
      <Box className={classes.inner_box}>
        <Container>
          <Group sx={{ flex: 1, display: "flex" }}>
            <Text>Logo</Text>
            <Space sx={{ flex: 1 }} />
            <Group noWrap>
              {/* <NavLink component={Link} to="/" label="Home" /> */}
              <NavLink component={Link} to="login" label="Login" />
              <NavLink component={Link} to="register" label="Register" />
            </Group>
          </Group>
        </Container>
      </Box>
    </Box>
  )
}

export default Header;