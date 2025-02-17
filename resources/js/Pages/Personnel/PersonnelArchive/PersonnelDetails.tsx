import { User } from "@/Types";
import TypographySmall from "@/Components/Typography";
import { ProfilePhoto } from "@/Components/ui/avatar";
import { Card } from "@/Components/ui/card";
import { Departments } from "@/Types/types";
import { format } from "date-fns";
import { TabsContent } from "@/Components/ui/tabs";

const PersonnelDetails = ({ user, servicecredits }: { user: User; servicecredits: number }) => {
    return (
        <TabsContent value="details" className="p-4 max-w-3xl mx-auto w-full">
            <Card className="p-4 flex gap-5 max-w-[37rem]">
                <ProfilePhoto
                    src={user.avatar}
                    className="size-24 !rounded-xl"
                    fallbackSize={40}
                />
                <div className="space-y-4">
                    <div className="flex gap-3 items-start">
                        <TypographySmall className="w-24">
                            Name:
                        </TypographySmall>

                        <TypographySmall className="font-normal capitalize">
                            {user?.full_name}
                        </TypographySmall>
                    </div>

                    <div className="flex gap-3 items-start">
                        <TypographySmall className="w-24">
                            Position:
                        </TypographySmall>

                        <TypographySmall className="font-normal capitalize">
                            {user?.position}
                        </TypographySmall>
                    </div>

                    <div className="flex gap-3 items-start">
                        <TypographySmall className="w-24">
                            User Role:
                        </TypographySmall>

                        <TypographySmall className="font-normal capitalize">
                            {user?.role}
                        </TypographySmall>
                    </div>

                    <div className="flex gap-3 items-start">
                        <TypographySmall className="w-24">
                            Gender:
                        </TypographySmall>

                        <TypographySmall className="font-normal capitalize">
                            {user?.gender}
                        </TypographySmall>
                    </div>

                    <div className="flex gap-3 items-start">
                        <TypographySmall className="w-24">
                            Date of Birth:
                        </TypographySmall>

                        <TypographySmall className="font-normal">
                            {format(user?.birthday, "MMMM dd, y")}
                        </TypographySmall>
                    </div>

                    <div className="flex gap-3 items-start">
                        <TypographySmall className="w-24">
                            Email:
                        </TypographySmall>

                        <TypographySmall className="font-normal">
                            {user?.email}
                        </TypographySmall>
                    </div>

                    <div className="flex gap-3 items-start">
                        <TypographySmall className="w-24">
                            Mobile no.:
                        </TypographySmall>

                        <TypographySmall className="font-normal">
                            {user?.mobilenumber}
                        </TypographySmall>
                    </div>

                    <div className="flex gap-3 items-start">
                        <TypographySmall className="w-24">
                            Staff ID:
                        </TypographySmall>

                        <TypographySmall className="font-normal">
                            {user?.personnelid}
                        </TypographySmall>
                    </div>

                    <div className="flex gap-3 items-start">
                        <TypographySmall className="w-24">
                            Date Hired:
                        </TypographySmall>

                        <TypographySmall className="font-normal">
                            {format(user?.hiredate, 'MMMM, d y')}
                        </TypographySmall>
                    </div>

                    <div className="flex gap-3 items-start">
                        <TypographySmall className="w-24">
                            Department:
                        </TypographySmall>

                        <TypographySmall className="font-normal">
                            {Departments[user?.department]}
                        </TypographySmall>
                    </div>

                    <div className="flex gap-3 items-start">
                        <TypographySmall className="w-24">
                            Status:
                        </TypographySmall>

                        <TypographySmall className="font-normal capitalize">
                            {user?.status}
                        </TypographySmall>
                    </div>


                    {user?.role != "teaching" ? (
                        <>
                            <div className="flex gap-3 items-start">
                                <TypographySmall className="w-24">
                                    Credits:
                                </TypographySmall>

                                <TypographySmall className="font-normal capitalize">
                                    {user && (user.credits + user.splcredits)}
                                </TypographySmall>
                            </div>

                            <div className="flex gap-3 items-start">
                                <TypographySmall className="w-24">
                                    Service Credits:
                                </TypographySmall>

                                <TypographySmall className="font-normal capitalize">
                                    {servicecredits??"0"}
                                </TypographySmall>
                            </div>
                        </>
                    ) : (
                        <div className="flex gap-3 items-start">
                            <TypographySmall className="w-24">
                                Service Credits:
                            </TypographySmall>

                            <TypographySmall className="font-normal capitalize">
                                {servicecredits??"0"}
                            </TypographySmall>
                        </div>
                    )}
                </div>
            </Card>
        </TabsContent>
    );
};

export default PersonnelDetails;
