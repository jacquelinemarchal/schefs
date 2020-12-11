import React, { useContext } from 'react';
import Context from '../Context/context';

const GreyOut = () => {
    const context = useContext(Context);

    return (
        <div onClick={context.handleCloseCard} className="fixed inset-0 z-10">
            <div className="absolute inset-0 bg-gray-700 bg-opacity-75"></div>
        </div>
    );
};

export default GreyOut;
