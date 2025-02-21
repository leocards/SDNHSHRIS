import { Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";
import sdnhslogo from "@/Assets/images/sdnhs-logo.png";
import { ProcessIndicatorProvider } from "@/Components/Provider/process-indicator-provider";
import ProcessIndicator from "@/Components/ProcessIndicator";
import { Toaster } from "@/Components/ui/toaster";
import { createPortal } from "react-dom";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <ProcessIndicatorProvider>
            <div className="flex min-h-screen w-full flex-col items-center bg- !bg-[#FF00FF] fuchsia-700 max-sm:px-3 pt-16 sm:justify-center sm:pt-0">
                <div className="bg-white size-fit flex items-center justify-center rounded-full shadow-md">
                    <Link href="/">
                        <img src={sdnhslogo} alt="sdnhs-logo" className=" size-20 sm:size-32 m-1" />
                    </Link>
                </div>

                <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md rounded-lg">
                    {children}
                </div>
            </div>

            <ProcessIndicator />
            {createPortal(<Toaster />, document.body)}
        </ProcessIndicatorProvider>
    );
}
