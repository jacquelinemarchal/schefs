import React, { useContext, useState, useEffect } from 'react'
import { CSSTransition } from 'react-transition-group';
import axios from 'axios';

import HighlightOff from '@material-ui/icons/HighlightOff';
import CardContent from './usercardcontent'
import SignUpForm from '../Auth/signupform';
import LoginForm from '../Auth/loginform';
import PasswordReset from '../Auth/passwordreset';
import VerifyEmail from '../Auth/verifyemail';
import Context from '../Context/context';

// props.right = boolean side of screen
const Card = (props) => {
    const context = useContext(Context);
    const [cardInterior, setCardInterior] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (context.profile && !context.profile.isVerified){
            setCardInterior("verify")
        }
        if (!context.profile) {
            setCardInterior("login")
        }
        if (context.profile && context.profile.isVerified){
            setCardInterior("account")
        }
    }, [context.profile])

    const handleCloseCard = () => context.handleCloseCard(!props.right, props.right);

    const toggle = () => {
        if (cardInterior === "login"){
            setCardInterior("signup")
        }
        else{
            setCardInterior("login")
        }
    }
    const verify = (e) => {
        setCardInterior("verify");
        setEmail(e);
    }
    return (
        <CSSTransition
          in={props.right ? context.rCardIsOpen : context.lCardIsOpen}
          timeout={500}
          key={props.right ? 'rcard' : 'lcard'}
          classNames={props.right ? 'rcard' : 'lcard'}
          unmountOnExit
        >
          <div id="cardSize" className={'fixed pb-4 m-2 border-2 border-black rounded-3xl md:mt-12 top-0 bg-white justify-center z-20 ' + (props.right ? 'right-0' : 'left-0')}>
            <div className="flex flex-col h-full overflow-scroll">
              <div className="flex justify-end">
                <button onClick={handleCloseCard} className="focus:outline-none p-2">
                  <HighlightOff/>
                </button>
              </div>
  
	          {props.right
		        ? cardInterior === "account" && context.profile
                    ? <CardContent profile={context.profile} />
                      : cardInterior === "login"
                          ? <LoginForm function={toggle} resetFunction={() => setCardInterior("password")} showVerify={() => setCardInterior("verify")} showAccount={() => {setCardInterior("account")}}/>
                          : cardInterior === "verify" && context.profile
                              ? <VerifyEmail email={email} function={() => setCardInterior("login")}/>
                              : cardInterior === "signup" 
                                  ? <SignUpForm function={toggle} showVerify={verify}/> 
                                  : cardInterior === "password"
                                      ? <PasswordReset function={() => setCardInterior("login")}/> 
                                      : null
                : context.leftProfile
                    ? <CardContent profile={context.leftProfile} />
                    : null
		      }
            </div>
          </div>
        </CSSTransition>
    );
}

export default Card;
