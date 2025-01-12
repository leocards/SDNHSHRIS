import { Deferred } from "@inertiajs/react";
import React, { ReactElement } from "react";
import { Skeleton } from "./ui/skeleton";
import { usePagination } from "./Provider/paginate-provider";

type TableDataSkeletonLoaderProps = {
    children: (column: string) => ReactElement | number | string;
    columns: Array<string> | number;
    data: string | Array<string>;
    length?: number;
};

const TableDataSkeletonLoader: React.FC<TableDataSkeletonLoaderProps> = ({
    children,
    columns,
    data,
    length = 10,
}) => {
    const { loading } = usePagination();
    const gridtemplatecolumns =
        typeof columns == "number"
            ? Array.from({ length: columns }).map(() => "1fr")
            : columns;

    return (
        <Deferred
            data={data}
            fallback={<Loader gridtemplatecolumns={gridtemplatecolumns} length={length} />}
        >
            {loading ? (
                <Loader gridtemplatecolumns={gridtemplatecolumns} length={length} />
            ) : children(gridtemplatecolumns.join(" "))}
        </Deferred>
    );
};

export const Loader: React.FC<{ gridtemplatecolumns: Array<string>, length: number }> = ({
    gridtemplatecolumns, length
}) => (
    <div className="">
        <div
            className="grid gap-2 px-2 h-14 border-b border-border"
            style={{ gridTemplateColumns: gridtemplatecolumns.join(" ") }}
        >
            {Array.from({ length: gridtemplatecolumns.length }).map(
                (_, index) => (
                    <div key={index} className="py-2.5">
                        <Skeleton className="size-full rounded-full" />
                    </div>
                )
            )}
        </div>

        {Array.from({ length: length }).map((_, index) => (
            <div
                key={index}
                className="grid gap-2 px-2 h-12"
                style={{
                    gridTemplateColumns: gridtemplatecolumns.join(" "),
                }}
            >
                {Array.from({ length: gridtemplatecolumns.length }).map(
                    (_, index) => (
                        <div key={index} className="py-2.5">
                            <Skeleton className="size-full rounded-full" />
                        </div>
                    )
                )}
            </div>
        ))}
    </div>
);

export default TableDataSkeletonLoader;
