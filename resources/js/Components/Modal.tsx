import { PropsWithChildren } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { cn } from '@/Lib/utils';

export type ModalProps = {
    show: boolean;
    closeable?: boolean;
    onClose: CallableFunction;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
}

export default function Modal({
    children,
    dialogStyle,
    show = false,
    center = false,
    maxWidth = '2xl',
    closeable = false,
    isFullScreen,
    onClose = () => {},
    ...props
}: PropsWithChildren<{
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'fit';
    center?: boolean|string;
    dialogStyle?: string;
    isFullScreen?: boolean;
} & ModalProps>) {
    const close = () => {
        if (closeable) {
            onClose(false);
        }
    };

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
        '3xl': 'sm:max-w-3xl',
        '4xl': 'sm:max-w-4xl',
        '5xl': 'sm:max-w-5xl',
        '6xl': 'sm:max-w-6xl',
        '7xl': 'sm:max-w-7xl',
        'fit': 'sm:max-w-fit',
    }[maxWidth];

    return (
        <Transition show={show} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                data-state={show?'open':'close'}
                className={cn(
                    "fixed inline-flex inset-0 px-4 outline-none z-50 transform transition-all max-h-screen bg-black/75 overflow-y-auto",
                    isFullScreen ? "py-3" : "py-6",
                    ['2xl', '3xl', '4xl', '5xl', '6xl', '7xl', 'fit'].includes(maxWidth) ? "sm:px-5" : "sm:px-0",
                )}
                onClose={close}
            >
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <DialogPanel

                        className={cn(
                            `h-fit bg-background dark:bg-zinc-900 rounded-lg shadow-xl transform transition-all w-full sm:mx-auto
                            ${typeof center === 'string' ? center : center && "!my-auto"} ${dialogStyle} ${maxWidthClass}`,
                            isFullScreen ? "" : "my-6"
                        )}
                    >
                        <div className="p-6">
                            {props.title && <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
                                <div className="text-lg font-semibold leading-none tracking-tight">{props.title}</div>
                                <div className="text-sm text-muted-foreground">{props.description}</div>
                            </div>}
                            {children}
                        </div>
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}
