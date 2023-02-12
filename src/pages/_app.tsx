import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppShell, Aside, Burger, ColorSchemeProvider, Footer, Header, MantineProvider, MediaQuery, Navbar } from '@mantine/core';
import type { ColorScheme } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import "../styles/globals.css";
import { useLocalStorage, useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import NavFooter from "../components/navigation/NavFooter";
import NavSideBar from "../components/navigation/NavSideBar";
import AppSideNav from "../components/navigation/AppSideNav";
import NavHeader from "../components/navigation/NavHeader";
import { useEffect } from "react"
import { useRouter } from "next/router";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const deviceDefaultTheme = useMediaQuery('(prefers-color-scheme:dark)');
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({ key: "color-scheme", defaultValue: "light" });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  const [opened, setOpened] = useState(false);
  const [hideNav, setHideNav] = useState(false);
  const router = useRouter();

  //definitely temporary
  useEffect(() => {
    if (router.pathname === "/signup" || router.pathname === "/") {
      setHideNav(true)
    }
    console.log(router.pathname)
  }, [])


  return (

    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <NotificationsProvider position="bottom-left">
          <SessionProvider session={session}>
            <>
              {/* Find A system to turn navbar off and on in every page  */}
              <AppShell hidden={hideNav} style={{ height: "100%" }}
                navbarOffsetBreakpoint="sm"
                asideOffsetBreakpoint="sm"
                navbar={
                  <AppSideNav opened={opened} setOpened={setOpened} />
                }
                // aside={
                //   <NavSideBar />
                // }
                // footer={
                //   <NavFooter />
                // }
                header={
                  <NavHeader opened={opened} setOpened={setOpened} />
                }
              >
                {/* App content */}
                <Component {...pageProps} />
              </AppShell>

            </>

          </SessionProvider>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default MyApp;
