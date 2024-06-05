import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import DataAction from '../stores/dataS/DataAction';
import SpaceatPos from './SpaceatPos';

interface Msg2Props {
    closeToast: () => void;
    row2: string; // ou le type approprié pour row2
}

const Msg2: React.FC<Msg2Props> = ({ closeToast, row2 }) => {
    const dispatch = useDispatch();

    return (
        <div>
            {/* {SpaceatPos(row2)} */}
            VERIFICATION : &nbsp;
            <Button onClick={() => dispatch(DataAction.moveRow(row2))}>{SpaceatPos(row2)}</Button>
            &nbsp;
            <Button onClick={closeToast}>Close</Button>
        </div>
    );
};

export default Msg2;
