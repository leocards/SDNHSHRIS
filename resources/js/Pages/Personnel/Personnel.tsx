import Header, { TableHeader, TableRow } from "@/Components/Header";
import { Card } from "@/Components/ui/card";
import { PAGINATEDDATA, User } from "@/Types";
import { router, usePage } from "@inertiajs/react";
import PersonnelStatistics from "./PersonnelStatistics";
import { Button } from "@/Components/ui/button";
import {
    ArrowRight2,
    DocumentUpload,
    Edit,
    Eye,
    Message,
    UserAdd,
    UserOctagon,
} from "iconsax-react";
import TableDataSkeletonLoader from "@/Components/TableDataSkeletonLoader";
import { Fragment, HTMLAttributes, useState } from "react";
import { PaginationData } from "@/Components/ui/pagination";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";
import { cn } from "@/Lib/utils";
import { Departments } from "@/Types/types";
import {
    Menubar,
    MenubarContent,
    MenubarMenu,
    MenubarTrigger,
    MenubarItem,
    MenubarSeparator,
    FilterButton,
    FilterItem,
    MenubarLabel,
    SortButton,
    SortItem,
    MenubarSub,
    MenubarSubTrigger,
    MenubarSubContent,
} from "@/Components/ui/menubar";
import { TooltipLabel } from "@/Components/ui/tooltip";
import { EllipsisVertical } from "lucide-react";
import { ProfilePhoto } from "@/Components/ui/avatar";
import { useMessage } from "@/Components/Provider/message-provider";
import {
    PaginateProvider,
    usePagination,
} from "@/Components/Provider/paginate-provider";
import ImportExcelPds from "./ImportExcelPds";
import ViewDetails from "./ViewDetails";
import PersonnelConfirmation from "./PersonnelConfirmation";
import empty from "@/Assets/empty-personnel.svg";
import useWindowSize from "@/Hooks/useWindowResize";

type PersonnelProps = {
    personneltype: "teaching" | "non-teaching";
    jhs: number;
    shs: number;
    accounting: number;
};

type PersonnelType = User & {
    pds_excel: {
        id: number;
        user_id: number;
        file: string | null;
    } | null;
};

const Personnel: React.FC<
    PersonnelProps & { personnels: PAGINATEDDATA<PersonnelType> }
> = (props) => {
    return (
        <PaginateProvider<User>
            pageValue={props.personnels}
            url={route("personnel", [props.personneltype])}
        >
            <Main {...props} />
        </PaginateProvider>
    );
};

const Main: React.FC<PersonnelProps> = ({
    personneltype,
    jhs,
    shs,
    accounting,
}) => {
    const { width } = useWindowSize();
    const role = usePage().props.auth.user.role;
    const { page, onQuery } = usePagination<
        User & {
            pds_excel: {
                id: number;
                user_id: number;
                file: string | null;
            } | null;
        }
    >();
    const { setProcess } = useProcessIndicator();
    const [filter, setFilter] = useState<any>(undefined);
    const [{ sort, order }, setSortOrder] = useState<{
        sort?: any;
        order: "asc" | "desc";
    }>({
        sort: "name",
        order: "asc",
    });
    const [importPds, setImportPds] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [viewDetails, setViewDetails] = useState(false);
    const [showPersonnelConfirmation, setShowPersonnelConfirmation] =
        useState(false);
    const [personnelStatus, setPersonnelStatus] = useState<
        "retired" | "resigned" | "transferred" | null
    >(null);

    const Columns =
        width <= 640
            ? ["1fr", "5rem"]
            : width <= 978
            ? ["minmax(5rem,1fr)", "5rem", "5rem"]
            : [
                  "minmax(5rem,1fr)",
                  "minmax(5rem,1fr)",
                  "minmax(5rem,1fr)",
                  "10rem",
                  "5rem",
                  "5rem",
              ];

    return (
        <div>
            <Header title="New Personnel" className="mb-2">
                <div className="flex items-center gap-1">
                    Personnel{" "}
                    <ArrowRight2 className="size-4 [&>path]:stroke-[3]" />
                    <span className="">
                        {personneltype.charAt(0).toUpperCase() +
                            personneltype.slice(1)}
                    </span>
                </div>
            </Header>

            <PersonnelStatistics jhs={jhs} shs={shs} accounting={accounting} />

            <div className="mb-4 mt-7 h-fit flex">
                <div className="flex gap-4 max-sm:gap-2 items-center">
                    {personneltype == "teaching" && (
                        <FilterButton
                            isDirty={!!filter}
                            onClearFilter={() => {
                                setFilter(undefined);
                                onQuery({ filter: undefined, sort, order });
                            }}
                        >
                            <MenubarLabel>Department</MenubarLabel>
                            <FilterItem
                                value="junior"
                                activeFilter={filter}
                                children="Junior High School"
                                onClick={(value) => {
                                    setFilter(value);
                                    onQuery({ filter: value, sort, order });
                                }}
                            />
                            <FilterItem
                                value="senior"
                                activeFilter={filter}
                                children="Senior High School"
                                onClick={(value) => {
                                    setFilter(value);
                                    onQuery({ filter: value, sort, order });
                                }}
                            />
                        </FilterButton>
                    )}
                    <SortButton
                        order={order}
                        onOrderChange={(value) => {
                            setSortOrder({ sort, order: value });
                            onQuery({ filter, sort, order: value });
                        }}
                    >
                        <MenubarLabel>Sort by</MenubarLabel>
                        <SortItem
                            value="name"
                            activeSort={sort}
                            onClick={(value) => {
                                setSortOrder({ sort: value, order });
                                onQuery({ filter, sort: value, order });
                            }}
                            children="Name"
                        />
                        <SortItem
                            value="email"
                            activeSort={sort}
                            onClick={(value) => {
                                setSortOrder({ sort: value, order });
                                onQuery({ filter, sort: value, order });
                            }}
                            children="Email"
                        />
                        <SortItem
                            value="position"
                            activeSort={sort}
                            onClick={(value) => {
                                setSortOrder({ sort: value, order });
                                onQuery({ filter, sort: value, order });
                            }}
                            children="Position"
                        />
                    </SortButton>
                </div>

                {role === "hr" && (
                    <Button
                        className="ml-auto"
                        onClick={() =>
                            router.get(
                                route("personnel.create", [personneltype]),
                                undefined,
                                {
                                    onBefore: () => setProcess(true),
                                }
                            )
                        }
                    >
                        <UserAdd className="[&>path]:stroke-[2]" />
                        <div className="max-sm:hidden">New Personnel</div>
                    </Button>
                )}
            </div>

            <Card className="min-h-[26rem] relative">
                <TableDataSkeletonLoader
                    data="personnels"
                    columns={Columns}
                    length={7}
                >
                    {(column) => (
                        <Fragment>
                            <TableHeader
                                style={{ gridTemplateColumns: column }}
                            >
                                <div>Name</div>
                                <div className="[@media(max-width:978px)]:!hidden">Email</div>
                                <div className="[@media(max-width:978px)]:!hidden">Department</div>
                                <div className="[@media(max-width:978px)]:!hidden">
                                    Position
                                </div>
                                <div className="max-sm:!hidden">Credits</div>
                                <div></div>
                            </TableHeader>
                            {page?.data.length === 0 && (
                                <div className="flex flex-col items-center absolute inset-0 justify-center">
                                    <img
                                        className="size-24 opacity-40 dark:opacity-65"
                                        src={empty}
                                    />
                                    <div className="text-sm font-medium text-foreground/50 mt-1 text-center">
                                        No available personnel data.
                                    </div>
                                </div>
                            )}
                            {page?.data.map((personnel, index) => (
                                <ListRow
                                    key={index}
                                    style={{ gridTemplateColumns: column }}
                                    user={personnel}
                                    pt={personneltype}
                                    onPreselect={() =>
                                        setSelectedUser(personnel)
                                    }
                                    onImportPds={() => setImportPds(true)}
                                    onViewDetails={() => setViewDetails(true)}
                                    onPersonnelAction={(action) => {
                                        setShowPersonnelConfirmation(true);
                                        setSelectedUser(personnel);
                                        setPersonnelStatus(action);
                                    }}
                                />
                            ))}
                        </Fragment>
                    )}
                </TableDataSkeletonLoader>
            </Card>

            <PaginationData />

            <ImportExcelPds
                show={importPds}
                user={selectedUser}
                onClose={setImportPds}
            />

            <ViewDetails
                user={selectedUser}
                show={viewDetails}
                onClose={setViewDetails}
            />

            <PersonnelConfirmation
                show={showPersonnelConfirmation}
                action={personnelStatus}
                onClose={() => {
                    setShowPersonnelConfirmation(false);
                    setSelectedUser(null);
                    setPersonnelStatus(null);
                }}
                personnel={selectedUser}
            />
        </div>
    );
};

interface ListRowProps extends HTMLAttributes<HTMLDivElement> {
    user: PersonnelType;
    pt: "teaching" | "non-teaching";
    onImportPds: CallableFunction;
    onPreselect: CallableFunction;
    onViewDetails: CallableFunction;
    onPersonnelAction: (action: "retired" | "resigned" | "transferred") => void;
}

const ListRow: React.FC<ListRowProps> = ({
    user,
    onImportPds,
    onPreselect,
    onViewDetails,
    onPersonnelAction,
    ...props
}) => {
    const { selectConversation } = useMessage();
    const { setProcess } = useProcessIndicator();
    const { role } = usePage().props.auth.user;

    return (
        <TableRow {...props} className={cn("", props.className)}>
            <div className="gap-2">
                <ProfilePhoto src={user.avatar} />
                <div className="line-clamp-1 break-words">{user.name}</div>
            </div>
            <div className="[@media(max-width:978px)]:!hidden">
                <div className="line-clamp-1 !break-words">{user.email}</div>
            </div>
            <div className="[@media(max-width:978px)]:!hidden">
                <div className="line-clamp-1 !break-words">
                    {Departments[user.department]}
                </div>
            </div>
            <div className="[@media(max-width:978px)]:!hidden">
                {user.position}
            </div>
            <div className="max-sm:!hidden">{user.credits}</div>
            <div>
                <Menubar
                    className="bg-tranparent !shadow-none size-8 mx-auto"
                    onMouseEnter={() => onPreselect()}
                >
                    <MenubarMenu>
                        <TooltipLabel label="More">
                            <MenubarTrigger className="size-8 bg-tranparent border-transparent data-[state=open]:!bg-accent !shadow-none">
                                <EllipsisVertical />
                            </MenubarTrigger>
                        </TooltipLabel>
                        <MenubarContent
                            align="end"
                            className="min-w-56 [&>div]:p-2"
                            hideWhenDetached
                        >
                            <MenubarItem
                                className="pl-2 flex items-center gap-2"
                                onClick={() => onViewDetails()}
                            >
                                <Eye className="size-5" />
                                <span>View details</span>
                            </MenubarItem>
                            <MenubarItem
                                className="pl-2 flex items-center gap-2"
                                onClick={() => selectConversation(user, true)}
                            >
                                <Message className="size-5" />
                                <span>Message</span>
                            </MenubarItem>
                            {role === "hr" && (
                                <Fragment>
                                    <MenubarItem
                                        className="pl-2 flex items-center gap-2"
                                        onClick={() =>
                                            router.get(
                                                route("personnel.create", {
                                                    pt: props.pt,
                                                    personnel: user.id,
                                                }),
                                                undefined,
                                                {
                                                    onBefore: () =>
                                                        setProcess(true),
                                                }
                                            )
                                        }
                                    >
                                        <Edit className="size-5" />
                                        <span>Edit details</span>
                                    </MenubarItem>

                                    <MenubarSeparator className="!p-0" />

                                    <MenubarSub>
                                        <MenubarSubTrigger className="gap-2">
                                            <UserOctagon className="size-5" />
                                            <span>Personnel status</span>
                                        </MenubarSubTrigger>
                                        <MenubarSubContent
                                            className="min-w-40"
                                            alignOffset={-20}
                                        >
                                            <MenubarItem
                                                disabled
                                                className="text-xs"
                                            >
                                                Current status
                                            </MenubarItem>
                                            <div className="px-2 pb-1 pt-0 text-xs font-medium capitalize">
                                                {user.status ?? "Active"}
                                            </div>
                                            <MenubarSeparator />
                                            <MenubarItem
                                                onClick={() => {
                                                    user.status == null &&
                                                        onPersonnelAction(
                                                            "retired"
                                                        );
                                                }}
                                                disabled={!!user.status}
                                            >
                                                Retired
                                            </MenubarItem>
                                            <MenubarItem
                                                onClick={() => {
                                                    user.status == null &&
                                                        onPersonnelAction(
                                                            "resigned"
                                                        );
                                                }}
                                                disabled={!!user.status}
                                            >
                                                Resigned
                                            </MenubarItem>
                                            <MenubarItem
                                                onClick={() => {
                                                    user.status == null &&
                                                        onPersonnelAction(
                                                            "transferred"
                                                        );
                                                }}
                                                disabled={!!user.status}
                                            >
                                                Transferred
                                            </MenubarItem>
                                        </MenubarSubContent>
                                    </MenubarSub>

                                    <MenubarItem
                                        className="pl-2 flex items-center gap-2"
                                        onClick={() => {
                                            if (!user.pds_excel?.file)
                                                onImportPds();
                                        }}
                                        disabled={!!user.pds_excel?.file}
                                    >
                                        {!!user.pds_excel?.file ? (
                                            "Already uploaded PDS"
                                        ) : (
                                            <>
                                                <DocumentUpload className="size-5" />
                                                <span>Upload PDS</span>
                                            </>
                                        )}
                                    </MenubarItem>
                                </Fragment>
                            )}
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </div>
        </TableRow>
    );
};

export default Personnel;
