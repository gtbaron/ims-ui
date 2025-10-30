import {Button, Modal, ModalBody, ModalHeader} from "flowbite-react";
import React from "react";
import {HiOutlineExclamationCircle} from "react-icons/hi";

type ConfirmDeleteModalProps = {
    open: boolean;
    handleDelete: (response: boolean) => void;
    displayMessage: string;
    displayName: string;
}

export const ConfirmModal: React.FC<ConfirmDeleteModalProps> = (props: ConfirmDeleteModalProps) => {

    const handleResponse = (response: boolean) => {
        props.handleDelete(response);
    }

    return (
        <Modal show={!!open} size="md" onClose={() => handleResponse(false)} popup>
            <ModalHeader />
            <ModalBody>
                <div className="text-center">
                    <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                        {props.displayMessage}
                    </h3>
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                        {props.displayName}
                    </h3>
                    <div className="flex justify-center gap-4">
                        <Button color="red" onClick={() => handleResponse(true)}>
                            Yes
                        </Button>
                        <Button color="alternative" onClick={() => handleResponse(false)}>
                            No
                        </Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    )
}