import React, { useContext } from 'react'
import { CSSTransition } from 'react-transition-group';

import HighlightOff from '@material-ui/icons/HighlightOff';
import CardContent from './usercardcontent'
import SignUpForm from '../Auth/signupform';
import LoginForm from '../Auth/loginform';
import Context from '../Context/context';

// props.right = boolean side of screen, props.profile = profile to display, if not the current user's card
const Card = (props) => {
    const context = useContext(Context);
    const handleCloseCard = () => context.handleCloseCard(!props.right, props.right);

    return (
        <CSSTransition
          in={props.right ? context.rCardIsOpen : context.lCardIsOpen}
          timeout={500}
          key={props.right ? 'rcard' : 'lcard'}
          classNames={props.right ? 'rcard' : 'lcard'}
          unmountOnExit
        >
          <div className={'fixed m-2 border sm:border-2 border-black rounded-xl md:mt-10 top-0 bg-white justify-center z-20 ' + (props.right ? 'right-0' : 'left-0')} style={{maxWidth: "435px", minHeight: "600px",}}>
            <div className="flex justify-end">
              <button onClick={handleCloseCard} className="focus:outline-none p-2">
                <HighlightOff/>
              </button>
            </div>

	        {props.right
		      ? context.profile
			    ? <CardContent profile={context.profile} />
			    : <LoginForm /> 
		      : <CardContent profile={props.profile} />
		    }
          </div>
        </CSSTransition>
    );
}

export default Card;
