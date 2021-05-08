import React, { useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import Context from '../Context/context';

const GreyOut = () => {
    const context = useContext(Context);

    return (
        <CSSTransition
          in={context.rCardIsOpen || context.lCardIsOpen}
          timeout={500}
          key="grey-out"
          classNames="grey-out"
          unmountOnExit
        >
          <div onClick={() => context.handleCloseCard(true, true)} className="fixed inset-0 z-10">
            <div className="absolute inset-0 bg-black" style={{opacity: .4}}></div>
          </div>
        </CSSTransition>
    )
}

export default GreyOut;
