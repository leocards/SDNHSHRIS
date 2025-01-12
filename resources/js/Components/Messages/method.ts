function checkNextEqual(message: any, index: number) {
    return (
        conversation[index + 1] &&
        message.sender == conversation[index + 1].sender
    );
}

function checkPrevEqual(message: any, index: number) {
    return index !== 0 && conversation[index - 1].sender == message.sender;
}

const formatMessage = (messenger: any, index: number): MessagePosition => {
    if (messenger.sender === auth.id) {
        if (
            checkNextEqual(messenger, index) &&
            checkPrevEqual(messenger, index)
        ) {
            return "sender-m";
        } else if (checkNextEqual(messenger, index)) return "sender-t";
        else if (checkPrevEqual(messenger, index)) return "sender-b";
        else return "sender";
    } else {
        if (
            checkNextEqual(messenger, index) &&
            checkPrevEqual(messenger, index)
        ) {
            return "receiver-m";
        } else if (checkNextEqual(messenger, index)) return "receiver-t";
        else if (checkPrevEqual(messenger, index)) return "receiver-b";
        else return "receiver";
    }
};
