import "../css/app.css";
import "./bootstrap";

import { createInertiaApp, router } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { SidebarProvider } from "./Components/ui/sidebar";
import Authenticated from "./Layouts/AuthenticatedLayout";
import { MessageProvider } from "./Components/Provider/message-provider";
import { AccountProvider } from "./Components/Provider/auth-account-provider";
import Guest from "./Layouts/GuestLayout";
import { ThemeProvider } from "./Components/Provider/theme-provider";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.tsx", { eager: true });
        let page: any = pages[`./Pages/${name}.tsx`];

        page.default.layout = name.startsWith("Auth/")
            ? (page: any) => <Guest children={page} />
            : name !== "Welcome" && !name.startsWith("Auth")
            ? (page: any) => <Authenticated children={page} />
            : undefined;

        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        const auth = props.initialPage.props.auth.user;

        root.render(
            <AccountProvider auth={auth}>
                <ThemeProvider disabled={(!auth)} defaultTheme="light" storageKey="vite-ui-theme">
                    <MessageProvider>
                        <SidebarProvider>
                            <App {...props} />
                        </SidebarProvider>
                    </MessageProvider>
                </ThemeProvider>
            </AccountProvider>
        );
    },
    progress: false,
});

router.on('navigate', (event) => {
    const searchParams = new URLSearchParams(window.location.search);
    const ps = searchParams.get('ps');

    if(!ps)
        document.body.scrollTo({ top: 0 })
});
