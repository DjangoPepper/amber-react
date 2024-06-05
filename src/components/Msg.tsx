// Msg.tsx
import React from "react";
import { useDispatch } from "react-redux";
import { Button } from "react-bootstrap";
import DataAction from "../stores/dataS/DataAction";
import SpaceatPos from "./SpaceatPos";

// interface MsgProps {
//     closeToast: () => void;
//     row: any; // Définissez le type approprié pour row
// }
interface MsgProps {
    closeToast: () => void;
    row: {
        original: {
            reference: string; // Assurez-vous que le type correspond à votre structure de données
        };
    };
}

const Msg: React.FC<MsgProps> = ({ closeToast, row }) => {
    const dispatch = useDispatch();

    return (
        <div>
            VERIFICATION
            <Button onClick={() => { dispatch(DataAction.moveRow(row.original.reference)); }}>
                {SpaceatPos(row.original.reference)}
            </Button>
            <button onClick={closeToast}>INVALIDE</button>
        </div>
    );
};

Msg.defaultProps = {
    closeToast: () => {},
};

export default Msg;