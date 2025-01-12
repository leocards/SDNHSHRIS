import { useState, useEffect } from "react";
import { useForm as inertiaForm } from "@inertiajs/react";
import { DefaultValues, FieldValues, useForm as reactHookForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ParameterValue } from "../../../vendor/tightenco/ziggy/src/js";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";

type FormType<T> = {
    schema: any;
    route: string;
    method: "post" | "POST" | "put" | "PUT" | "patch" | "PATCH" | "delete" | "DELETE";
    parameters?: any;
    defaultValues?: DefaultValues<T>;
    values?: T;
    callback?: {
        onBefore?: CallableFunction
        onSuccess?: CallableFunction
        onError?: CallableFunction
        onFinish?: CallableFunction
    };
    async?: boolean;
}

export function useFormSubmit<T extends FieldValues>(form: FormType<T>) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { ...reactForm } = reactHookForm<T>({
        resolver: zodResolver(form.schema),
        defaultValues: form.defaultValues,
        values: form.values,
    });
    const { setProcess } = useProcessIndicator()

    const { data, setData, post, put, patch, delete: destroy, processing, errors, reset } = inertiaForm<T>();

    const onSubmit = (formData: T) => {
        setData(formData);
        setIsSubmitted(true);
    };

    const options = {
        async: form.async,
        onBefore: (before: any) => {
            if(form.callback?.onBefore) {
                form.callback.onBefore(before)
            }
        },
        onSuccess: (page: any) => {
            reset()
            if(form.callback?.onSuccess) {
                form.callback.onSuccess(page)
            }
        },
        onError: (error: any) => {
            if(form.callback?.onError) {
                form.callback.onError(error)
            }
        },
        onFinish: () => {
            setIsSubmitted(false)
            if(form.callback?.onFinish) {
                form.callback.onFinish()
            }
        },
    }

    useEffect(() => {
        if (isSubmitted) {
            if(["post", "POST"].includes(form.method))
                post(form.route, options);
            else if(["put", "PUT"].includes(form.method))
                put(form.route, options);
            else if(["patch", "PATCH"].includes(form.method))
                patch(form.route, options);
            else if(["delete", "DELETE"].includes(form.method))
                destroy(form.route, options);
        }
    }, [isSubmitted]);

    useEffect(() => {
        setProcess(processing)
    }, [processing])

    return {
        ...reactForm,
        data,
        setData,
        processing,
        errors,
        onSubmit: reactForm.handleSubmit(onSubmit),
    };
};
