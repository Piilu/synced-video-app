import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ColorSchemeProvider, MantineProvider } from '@mantine/core';
import type { ColorScheme } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { api } from "../utils/api";
import { useEffect } from 'react';
import "../styles/globals.css";
import { useState } from "react";
import { useLocalStorage, useMediaQuery } from "@mantine/hooks";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const deviceDefaultTheme = useMediaQuery('(prefers-color-scheme:dark)');
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({ key: "color-scheme", defaultValue: "light" });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));


  return (

    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <NotificationsProvider position="bottom-left">
          <SessionProvider session={session}>
            <Component {...pageProps} />
          </SessionProvider>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default api.withTRPC(MyApp);
