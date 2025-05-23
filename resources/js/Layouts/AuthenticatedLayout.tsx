import MessageBox from "@/Components/Messages/MessageBox";
import HeaderNavigationBar from "@/Components/Navigations/HeaderNavigationBar";
import SideNavigationBar from "@/Components/Navigations/SideNavigationBar";
import { useAccount } from "@/Components/Provider/auth-account-provider";
import { Head, router, usePage } from "@inertiajs/react";
import { PropsWithChildren, useEffect } from "react";
import { createPortal } from "react-dom";
import AnimatedShinyText from "@/Components/ui/animated-shiny-text";
import { useMessage } from "@/Components/Provider/message-provider";
import { cn } from "@/Lib/utils";
import { Toaster } from "@/Components/ui/toaster";
import ProcessIndicator from "@/Components/ProcessIndicator";
import { ProcessIndicatorProvider } from "@/Components/Provider/process-indicator-provider";
import { format } from "date-fns";
import { useToast } from "@/Hooks/use-toast";
import { Button } from "@/Components/ui/button";

export default function Authenticated({ children }: PropsWithChildren) {
    const { logout, serviceRecordReminder, setServiceRecordReminder } = useAccount();
    const { minimize, openMessageBox } = useMessage();
    const { toast } = useToast();
    const page = usePage()

    useEffect(() => {
        if(page.props.flash.status === "warning") {
            toast({
                title: page.props.flash.title,
                description: page.props.flash.message,
                status: page.props.flash.status
            })
        } else if(page.props.flash.status === "info") {
            toast({
                title: page.props.flash.title,
                description: page.props.flash.message,
                status: page.props.flash.status
            })
        }
    }, [page.props.flash])

    return logout ? (
        <div className="mx-auto my-auto">
            <Head title="Logging out" />

            <div className="flex flex-col">
                <div className="loading loading-dots loading-md mx-auto"></div>
                <AnimatedShinyText className="">
                    Logging out, please wait...
                </AnimatedShinyText>
            </div>
        </div>
    ) : (
        <ProcessIndicatorProvider>
            <SideNavigationBar />

            <div className="grow">
                <HeaderNavigationBar />

                <main className={cn("p-4", minimize && "mb-16")}>

                    {(serviceRecordReminder && !page.props.hasservicerecords && page.props.auth.user.role === 'teaching') && <div className="flex max-sm:flex-col sm:items-center justify-between gap-5 bg-orange-100 p-2 px-3 border border-orange-600 rounded-md mb-3">
                        <div className="text-orange-900 text-sm font-medium">Upload your service records to earn service credits.</div>
                        <div className="flex [@media(max-width:350px)]:flex-col gap-2 [@media(max-width:350px)]:ml-0 max-sm:ml-auto">
                            <Button className="[@media(max-width:350px)]:w-full h-8" variant="outline" onClick={() => setServiceRecordReminder(true)}>
                                Ok, Do not remind me again.
                            </Button>
                            <Button className="[@media(max-width:350px)]:w-full h-8" variant="outline" onClick={() => setServiceRecordReminder()}>
                                Ok
                            </Button>
                        </div>
                    </div>}

                    {children}
                </main>
            </div>

            {openMessageBox && createPortal(<MessageBox />, document.body)}
            {createPortal(<Toaster />, document.body)}

            <ProcessIndicator />
        </ProcessIndicatorProvider>
    );
}
