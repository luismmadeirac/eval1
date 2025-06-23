import React, { useState, useRef, useEffect, useCallback } from 'react';

interface ConfirmDialogProps {
    isOpen?: boolean;
    onClose?: (returnValue: DialogReturnValue) => void;
    onConfirm?: () => void;
    title?: string;
    children?: React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    triggerLabel?: string;
}

type DialogReturnValue = 'confirm' | 'cancel' | 'backdrop' | 'esc' | string;

export const Dialog: React.FC<ConfirmDialogProps> = React.memo(({
    isOpen: controlledIsOpen,
    onClose,
    onConfirm,
    title = "Confirmation Needed",
    children = "Are you sure you want to proceed?",
    confirmLabel = "Proceed",
    cancelLabel = "Cancel",
    triggerLabel = "Show Dialog",
}) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const isControlled = controlledIsOpen !== undefined;
    const isOpen = isControlled ? controlledIsOpen : uncontrolledOpen;

    const dialogRef = useRef<HTMLDialogElement>(null);

    const openDialog = useCallback(() => {
        if (!isControlled) setUncontrolledOpen(true);
    }, [isControlled]);

    const closeDialog = useCallback((returnValue: DialogReturnValue) => {
        if (!isControlled) setUncontrolledOpen(false);
        if (onClose) onClose(returnValue);
    }, [isControlled, onClose]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            if (!dialog.hasAttribute('open')) {
                dialog.showModal();
            }
        } else {
            if (dialog.hasAttribute('open')) {
                dialog.close();
            }
        }
    }, [isOpen]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const onDialogClose = () => {
            if (isOpen) {
                closeDialog(dialog.returnValue as DialogReturnValue || 'esc');
            }
        };

        dialog.addEventListener('close', onDialogClose);
        return () => dialog.removeEventListener('close', onDialogClose);
    }, [isOpen, closeDialog]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const onBackdropClick = (event: MouseEvent) => {
            if (event.target === dialog) {
                const rect = dialog.getBoundingClientRect();
                const clickInsideDialog =
                    rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
                    rect.left <= event.clientX && event.clientX <= rect.left + rect.width;

                if (!clickInsideDialog) {
                    closeDialog('backdrop');
                }
            }
        };

        dialog.addEventListener('click', onBackdropClick);
        return () => dialog.removeEventListener('click', onBackdropClick);
    }, [closeDialog]);

    const handleConfirm = useCallback(() => {
        if (onConfirm) onConfirm();
        closeDialog('confirm');
    }, [onConfirm, closeDialog]);

    return (
        <section className="container">
            <dialog ref={dialogRef} aria-labelledby="dialog-title" aria-describedby="dialog-description">
                <h2 id="dialog-title">{title}</h2>
                <div id="dialog-description">
                    {children}
                </div>
                <div className="dialog-actions">
                    {cancelLabel &&
                        <button className='button' onClick={() => closeDialog('cancel')} type="button">
                            {cancelLabel}
                        </button>
                    }
                    {confirmLabel &&
                        <button className='button' onClick={handleConfirm} type="button">
                            {confirmLabel}
                        </button>
                    }
                </div>
            </dialog>

            {/* Only show trigger if uncontrolled mode */}
            {!isControlled && (
                <button className='button' onClick={openDialog} type="button">
                    {triggerLabel}
                </button>
            )}
        </section>
    );
});

