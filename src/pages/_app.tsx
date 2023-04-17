import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ActionIcon, AppShell, Aside, Burger, Center, ColorSchemeProvider, Footer, Group, Header, Loader, LoadingOverlay, MantineProvider, MediaQuery, Navbar } from '@mantine/core';
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
import { useRouter, Router } from "next/router";
import { ModalsProvider } from "@mantine/modals";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import NProgress from 'nprogress'
NProgress.configure({ showSpinner: false })
import "nprogress/nprogress.css";
import ToggleNavbar from "../components/custom/buttons/ToggleNavbar";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
  router,
}) =>
{
  const deviceDefaultTheme = useMediaQuery('(prefers-color-scheme:dark)');
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({ key: "color-scheme", defaultValue: "light" });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  const [opened, setOpened] = useState<boolean>(true);
  const [hideNav, setHideNav] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(false);
  const routerR = useRouter();

  //definitely temporary
  useEffect(() =>
  {
    if (router.asPath != "") setLoading(false)
    if (!session)
    {
      setHideNav(true)
    }
    console.log(router.pathname)
  }, [])

  useEffect(() =>
  {
    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();
    router.events.on("routeChangeStart", handleRouteStart);
    router.events.on("routeChangeComplete", handleRouteDone);
    router.events.on("routeChangeError", handleRouteDone);

    return () =>
    {
      router.events.off("routeChangeStart", handleRouteStart);
      router.events.off("routeChangeComplete", handleRouteDone);
      router.events.off("routeChangeError", handleRouteDone);
    };
  }, [Router])

  if (loading) return null;

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{
        colorScheme: colorScheme,
        primaryColor: "blue",
        globalStyles: (theme) => ({
          '.nav-btn-second-bg': {
            borderRadius: "1.1em",
            width:"100%",
            color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[3],

            '&:hover': {
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
            },
            transition: "0.2s",
          },
        }),
        colors: {
          'dark': ['#C1C2C5', '#A6A7AB', '#909296', '#5C5F66', '#373A40', '#2C2E33', '#25262B', '#1A1B1E', '#141517', '#101113'],
        }
      }} withGlobalStyles withNormalizeCSS>
        <SessionProvider session={session}>
          <NotificationsProvider position="bottom-left">
            <ModalsProvider>
              <>

                {/* Find A system to turn navbar off and on in every page  */}
                <ToggleNavbar setHideNav={setHideNav} hideNav={hideNav} absolute top={15} left={15} />
                <AppShell hidden={hideNav} style={{ height: "100%" }}
                  navbarOffsetBreakpoint="sm"
                  asideOffsetBreakpoint="sm"
                  navbar={
                    <AppSideNav hideNav={hideNav} setHideNav={setHideNav} />
                  }
                // aside={
                //   <NavSideBar />
                // }
                // footer={
                //   <NavFooter />
                // }
                // header={
                //   <NavHeader opened={opened} setOpened={setOpened} />
                // }
                >
                  {/* App content */}
                  <Head><title>VideoSync</title></Head>
                  <Component {...pageProps} />
                  <LoadingOverlay visible={visible} overlayBlur={2} />
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