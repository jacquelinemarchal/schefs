import React from "react";
import WhitePillButton from  "../Buttons/wpillbutton"

const Footer = (props) => {
    let hostButton = {
        size: "text-base",
        text: "HOST YOUR OWN EVENT",
        link: "/festival",
        padding: "px-4"
    }
    return (
        <div className="h-6">
            <footer id="footer" className="inset-x-0 fixed bottom-0 flex items-center h-12 sm:h-8 md:h-10 px-8 md:px-12 xl:px-24" >
                <div id="footerBreakpointBtn">
                    <WhitePillButton {...hostButton} />
                </div>
                <div className="ml-2" id="footerBreakpointText"> {props.left}</div>
                <div className="ml-2" id="footerBreakpointText">{props.right}
                    <a className="underline" href="/ambassador">{props.linkText}</a>
                </div>
            </footer>
        </div>
  )
};

export default Footer;
