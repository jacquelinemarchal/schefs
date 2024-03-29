import React from "react";
import moment from 'moment';

const Comment = (props) => {
    var displayTime = '';
    var time = new Date(props.time);
    var now = new Date();

    if (now.getDate() - time.getDate() === 1)
        displayTime = "Yesterday"
    else if (now.getDate() === time.getDate())
        displayTime = "Today"
    else
        displayTime = moment(time).format('MMMM DD, YYYY')
    return (
        <div className="my-4 sm:my-6">
            <div className="flex mb-2 items-center justify-between">
                    <div className="flex items-center align-center text-sm sm:text-base">
                        <p className="text-xl mr-4">
                            {props.name}
                        </p>                        
                        <p className="items-center text-gray-500 text-sm sm:text-base">
                            {displayTime}
                        </p>
                    </div>
                    <div className="text-gray-500 text-sm sm:text-base text-right sm:text-justify">
                        {props.university}
                    </div>
            </div>
            <p>
                {props.thought}
            </p>
        </div>
        )
    };

export default Comment;