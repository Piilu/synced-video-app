import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppShell, Aside, Burger, Center, ColorSchemeProvider, Footer, Group, Header, Loader, LoadingOverlay, MantineProvider, MediaQuery, Navbar } from '@mantine/core';
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
import { ModalsProvider } from "@mantine/modals";

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
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  //definitely temporary
  useEffect(() => {
    console.log(router.asPath)
    if (router.asPath != "") setLoading(false)
    if (router.pathname === "/") {
      setHideNav(true)
    }
    console.log(router.pathname)
  }, [])

  if (loading) return null;

  return (

    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <SessionProvider session={session}>
          <NotificationsProvider position="bottom-left">
            <ModalsProvider>
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
            </ModalsProvider>
          </NotificationsProvider>
        </SessionProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default MyApp;
