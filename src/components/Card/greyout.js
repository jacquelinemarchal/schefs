import React, { useContext } from 'react';
import { StateContext } from '../../pages/_app';

const GreyOut = () => {
    const cardContext = useContext(StateContext);

    return (
        <div onClick={() => cardContext.dispatch('closeCard')} className="fixed inset-0 z-10">
            <div className="absolute inset-0 bg-gray-700 bg-opacity-75"></div>
        </div>
    );
};

export default GreyOut;
