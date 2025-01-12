import { PageProps } from "@/Types";
import { Head } from "@inertiajs/react";
import Login from "./Auth/Login";
import sdnhslogo from "@/Assets/images/sdnhs-logo.png";
import GridPattern from "@/Components/ui/grid-pattern";
import { cn } from "@/Lib/utils";

export default function Welcome({ auth }: PageProps) {
    return (
        <>
            <Head title="Welcome" />
            <div className="bg-fuchsia-700 text-black/50 w-full">
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-fuchsia-700 selection:text-white z-10">
                    <div className="relative w-full px-6 max-w-7xl">
                        <main className="my-6">
                            <div className="grid gap-6 grid-cols-5 items-center">
                                <div className="col-span-3 gap-6 flex flex-col items-center">
                                    <div className="size-fit p-1 rounded-full bg-white mx-auto shadow-lg">
                                        <img
                                            src={sdnhslogo}
                                            alt="sdnhs-log"
                                            className="size-36"
                                        />
                                    </div>
                                    <div className="text-center text-white size-fit">
                                        <div className="font-semibold text-2xl uppercase">Welcome to</div>
                                        <div className="font-black text-5xl uppercase text-fuchsia-100">Human Resource <br /> Information System</div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start text-foreground md:row-sp an-3 col-start-4 col-end-7 gap-6 overflow-hidden rounded-lg bg-background p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] transition duration-300 focus:outline-none lg:p-10 lg:pb-10 dark:focus-visible:ring-[#FF2D20]">
                                    <Login />
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                <GridPattern
                    width={40}
                    height={40}
                    squares={[
                        [4, 4],
                        [4, 1],
                        [14, 2],
                        [24, 2],
                        [9, 3],
                        [9, 6],
                        [2, 6],
                        [6, 10],
                        [10, 10],
                        [12, 15],
                        [15, 11],
                        [15, 10],
                        [10, 15],
                        [24, 15],
                        [30, 14],
                        [35, 14],
                        [35, 10],
                      ]}
                    className={cn(
                        "[mask-image:linear-gradient(to_bottom_right,#e9d5ff,transparent,#e9d5ff)] stroke-fuchsia-400/30 fill-fuchsia-600/30",
                    )}
                />
            </div>

        </>
    );
}
