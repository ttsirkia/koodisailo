import { withTRPC } from "@trpc/next";
import "bootstrap/dist/css/bootstrap.css";
import type { AppType } from "next/dist/shared/lib/utils";
import Head from "next/head";
import { useEffect, useState } from "react";
import { DefaultToastOptions, Toaster } from "react-hot-toast";
import { IntlProvider } from "react-intl";

import { SessionContext } from "../components/context/SessionContext";
import { ErrorPanel } from "../components/ErrorPanel";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Spinner } from "../components/Spinner";
import { Tabs } from "../components/Tabs";
import type { AppRouter } from "../server/router";
import "../styles/globals.css";
import "../styles/monokai.min.css";
import { getTranslations, Language } from "../utils/translation";
import { trpc } from "../utils/trpc";

let authKey = "";

const MyApp: AppType = ({ Component, pageProps }) => {
  const sessionQuery = trpc.useQuery(["session.getSessionInfo"], {
    onSuccess: (data) => {
      authKey = data.sessionId ?? "";
    },
  });
  const [lang, setLang] = useState((process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || "en") as Language);
  const strings = getTranslations(lang);

  const toastOptions: DefaultToastOptions = {
    success: {
      duration: 5000,
      style: {
        background: "green",
        color: "white",
      },
    },
    error: {
      duration: 5000,
      style: {
        background: "#700",
        color: "white",
      },
    },
  };

  // ************************************************************************************************

  useEffect(() => {
    if (sessionQuery.data && lang !== sessionQuery.data.language) {
      setLang(sessionQuery.data.language);
    }
  }, [lang, sessionQuery.data]);

  // ************************************************************************************************

  return (
    <>
      <SessionContext.Provider value={sessionQuery.data}>
        <IntlProvider messages={strings} key={lang.toString()} locale={lang.toString()} defaultLocale={lang.toString()}>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title key="title">{strings.title}</title>
          </Head>
          <Toaster position="top-right" toastOptions={toastOptions} />
          <Header />
          <main className="flex-shrink-0">
            <div className="container mt-4">
              {sessionQuery.data && !sessionQuery.isError && (
                <>
                  <h2 className="mb-4">{sessionQuery.data.courseName}</h2>
                  <Tabs />
                  <Component {...pageProps} />
                </>
              )}
              {!sessionQuery.data && !sessionQuery.isError && <Spinner />}
              {sessionQuery.isError && <ErrorPanel />}
            </div>
          </main>
          <Footer />
        </IntlProvider>
      </SessionContext.Provider>
    </>
  );
};

// ************************************************************************************************

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.browser) return "";
  return `http://localhost:${process.env.PORT ?? 3001}`;
};

// ************************************************************************************************

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = `${getBaseUrl()}/koodisailo/api/trpc`;

    return {
      headers() {
        return { Authorization: authKey };
      },
      url,
      queryClientConfig: { defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } } },
    };
  },
  ssr: false,
})(MyApp);

