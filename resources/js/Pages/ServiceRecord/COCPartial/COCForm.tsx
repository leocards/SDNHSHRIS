import { Card } from "@/Components/ui/card";
import React, { Fragment, useEffect, useState } from "react";
import FilePondUploader from "@/Components/FilePondUploader";
import TypographySmall from "@/Components/Typography";
import {
    Form,
    FormCalendar,
    FormInput,
    FormSelect,
} from "@/Components/ui/form";
import { SelectItem } from "@/Components/ui/select";
import { cn } from "@/Lib/utils";
import { allowedMimeTypes } from "../NewCOC";
import { isWeekend } from "date-fns";

type Porps = {
    form: any;
    index: number;
};

const COCForm: React.FC<Porps> = ({ form, index }) => {
    const [errors, setErrors] = useState<any>(null);

    const watchSession = form.watch(`coc[${index}].session`);

    useEffect(() => {
        if (watchSession === "halfday") {
            form.setValue("to", null);
        } else if (watchSession === "fullday") {
            form.setValue("numofhours", "");
        }
    }, [watchSession]);

    useEffect(() => {
        if (form.formState.errors && form.formState.errors.coc) {
            const formErrors = form.formState.errors.coc[index];
            console.log(formErrors);

            if (formErrors) {
                setErrors(formErrors);
            }
        }
    }, [form.formState.errors]);

    useEffect(() => {
        if (watchSession === "halfday") {
            form.setValue(`coc[${index}].to`, null);
        } else if (watchSession === "weekdays") {
            if (
                form.getValues(`coc[${index}].from`) &&
                isWeekend(form.getValues(`coc.${index}.from`))
            ) {
                form.setValue(`coc[${index}].from`, null);
                if (isWeekend(form.getValues(`coc[${index}].to`)))
                    form.setValue(`coc[${index}].to`, null);
            }
        }
    }, [watchSession]);

    return (
        <Card className={cn("p-3 px-4 pb-1", errors && "border-destructive")}>
            <div className="space-y-4">
                <FormInput
                    form={form}
                    name={`coc[${index}].name`}
                    label="Name/Title"
                    required={false}
                    placeholder="(Optional)"
                />
                <div className="grid [@media(max-width:512px)]:grid-cols-1 grid-cols-2 gap-4">
                    <FormCalendar
                        form={form}
                        name={`coc[${index}].from`}
                        label="From"
                        disableDate={(date) => {
                            return (
                                watchSession === "weekdays" && isWeekend(date)
                            );
                        }}
                    />
                    <FormCalendar
                        form={form}
                        name={`coc[${index}].to`}
                        label="To"
                        required={false}
                        disabled={watchSession === "halfday" || !watchSession}
                        triggerClass="disabled:opacity-100 disabled:text-foreground/20"
                        disableDate={(date) => {
                            return (
                                watchSession === "weekdays" && isWeekend(date)
                            );
                        }}
                    />
                    <FormSelect
                        form={form}
                        name={`coc[${index}].session`}
                        label="Session"
                        displayValue={
                            watchSession === "halfday"
                                ? "Half-day"
                                : watchSession === "fullday"
                                ? "Whole-day"
                                : watchSession?"Weekdays":""
                        }
                        items={
                            <Fragment>
                                <SelectItem
                                    value="halfday"
                                    children="Half-day"
                                />
                                <SelectItem
                                    value="fullday"
                                    children="Whole-day"
                                />
                                <SelectItem
                                    value="weekdays"
                                    children="Weekdays"
                                />
                            </Fragment>
                        }
                    />
                    <FormInput
                        form={form}
                        name={`coc[${index}].numofhours`}
                        label="Number of hours"
                        required={watchSession === "halfday"}
                        disabled={watchSession === "fullday" || !watchSession}
                    />
                </div>

                <div className="space-y-2">
                    <TypographySmall
                        className={cn(
                            "required",
                            errors?.coafileid && "text-destructive"
                        )}
                    >
                        Certificate of Appearance
                    </TypographySmall>
                    <FilePondUploader
                        route={route("sr.temporary")}
                        mimetypes={allowedMimeTypes}
                        handleLoad={(id) => {
                            form.setValue(`coc[${index}].coafileid`, id, {
                                shouldDirty: true,
                                shouldValidate: true,
                            });
                        }}
                        handleRemove={() => {
                            form.setValue(`coc[${index}].coafileid`, null, {
                                shouldDirty: true,
                                shouldValidate: true,
                            });
                        }}
                    />
                    {errors?.coafileid && (
                        <TypographySmall
                            className={cn("text-[0.8rem] text-destructive")}
                        >
                            {errors?.coafileid?.message}
                        </TypographySmall>
                    )}
                </div>

                <div className="space-y-2">
                    <TypographySmall
                        className={cn(
                            "required",
                            errors?.dtrfileid && "text-destructive"
                        )}
                    >
                        DTR
                    </TypographySmall>
                    <FilePondUploader
                        route={route("sr.temporary")}
                        mimetypes={allowedMimeTypes}
                        handleLoad={(id) => {
                            form.setValue(`coc[${index}].dtrfileid`, id, {
                                shouldDirty: true,
                                shouldValidate: true,
                            });
                        }}
                        handleRemove={() => {
                            form.setValue(`coc[${index}].dtrfileid`, null, {
                                shouldDirty: true,
                                shouldValidate: true,
                            });
                        }}
                    />
                    {errors?.dtrfileid && (
                        <TypographySmall
                            className={cn("text-[0.8rem] text-destructive")}
                        >
                            {errors?.dtrfileid?.message}
                        </TypographySmall>
                    )}
                </div>

                <div className="space-y-2">
                    <TypographySmall
                        className={cn(
                            "required",
                            errors?.memofileid && "text-destructive"
                        )}
                    >
                        MEMO
                    </TypographySmall>
                    <FilePondUploader
                        route={route("sr.temporary")}
                        mimetypes={allowedMimeTypes}
                        handleLoad={(id) => {
                            form.setValue(`coc[${index}].memofileid`, id, {
                                shouldDirty: true,
                                shouldValidate: true,
                            });
                        }}
                        handleRemove={() => {
                            form.setValue(`coc[${index}].memofileid`, null, {
                                shouldDirty: true,
                                shouldValidate: true,
                            });
                        }}
                    />
                    {errors?.memofileid && (
                        <TypographySmall
                            className={cn("text-[0.8rem] text-destructive")}
                        >
                            {errors?.memofileid?.message}
                        </TypographySmall>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default COCForm;
