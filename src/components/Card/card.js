import React, { useContext } from 'react'
import { CSSTransition } from 'react-transition-group';

import HighlightOff from '@material-ui/icons/HighlightOff';
import CardContent from './usercardcontent'
import SignUpForm from '../Auth/signupform';
import LoginForm from '../Auth/loginform';
import Context from '../Context/context';

const Card = () => {
    const context = useContext(Context);

    return (
      <>
        <CSSTransition
          in={context.cardIsOpen}
          timeout={500}
          key="card"
          classNames="card"
          unmountOnExit
        >
          <div className="fixed m-2 border sm:border-2 border-black rounded-xl md:mt-10 top-0 bg-white justify-center right-0 z-20" style={{maxWidth: "435px", minHeight: "600px",}}>
            <div className="flex justify-end">
              <button onClick={context.handleCloseCard} className="focus:outline-none p-2">
                <HighlightOff/>
              </button>
            </div>

            {context.profile
              ? <CardContent />
              : <LoginForm /> 
            }
          </div>
        </CSSTransition>

        <CSSTransition
          in={context.cardIsOpen}
          timeout={500}
          key="grey-out"
          classNames="grey-out"
          unmountOnExit
        >
          <div onClick={context.handleCloseCard} className="fixed inset-0 z-10">
            <div className="absolute inset-0 bg-gray-700 bg-opacity-75"></div>
          </div>
        </CSSTransition>
      </>
    );
}

export default Card;
