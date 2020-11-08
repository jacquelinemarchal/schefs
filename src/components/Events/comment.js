import React from "react";

const Comment = (props) => {

    return (
        <div className="my-4 sm:my-6">
            <div className="flex mb-2 items-center justify-between">
                    <div className="flex items-center sm:text-sm text-base">
                        <p className="text-xl mr-4">
                            {props.name}
                        </p>                        
                        <p className="text-gray-500">
                            {props.time}
                        </p>
                    </div>
                    <div className="text-gray-500 sm:text-sm text-base">
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