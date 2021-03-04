import React, { useContext, useState, useEffect } from 'react'
import { CSSTransition } from 'react-transition-group';
import axios from 'axios';

import HighlightOff from '@material-ui/icons/HighlightOff';
import CardContent from './usercardcontent'
import SignUpForm from '../Auth/signupform';
import LoginForm from '../Auth/loginform';
import PasswordReset from '../Auth/passwordreset';
import Context from '../Context/context';

// props.right = boolean side of screen
const Card = (props) => {
    const context = useContext(Context);
    const [cardInterior, setCardInterior] = useState("login");

    const handleCloseCard = () => context.handleCloseCard(!props.right, props.right);

    const toggle = () => {
        if (cardInterior === "login"){
            setCardInterior("signup")
        }
        else{
            setCardInterior("login")
        }
    }
    return (
        <CSSTransition
          in={props.right ? context.rCardIsOpen : context.lCardIsOpen}
          timeout={500}
          key={props.right ? 'rcard' : 'lcard'}
          classNames={props.right ? 'rcard' : 'lcard'}
          unmountOnExit
        >
          <div id="cardSize" className={'fixed m-2 border sm:border-2 border-black rounded-xl md:mt-10 top-0 bg-white justify-center z-20 ' + (props.right ? 'right-0' : 'left-0')}>
            <div className="flex justify-end">
              <button onClick={handleCloseCard} className="focus:outline-none p-2">
                <HighlightOff/>
              </button>
            </div>

	        {props.right
		      ? context.profile
                  ? <CardContent profile={context.profile} />
                  : cardInterior === "login"
                      ? <LoginForm function={toggle} resetFunction={() => setCardInterior("password")}/> 
                      : cardInterior === "signup" 
                          ? <SignUpForm function={toggle} /> 
                          : cardInterior === "password"
                              ? <PasswordReset function={() => setCardInterior("login")}/> 
                              : null
              : context.leftProfile
                  ? <CardContent profile={context.leftProfile} />
                  : null
		    }
          </div>
        </CSSTransition>
    );
}

export default Card;
