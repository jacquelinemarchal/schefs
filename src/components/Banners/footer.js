import React from "react";
import PillButton from  "../Buttons/wpillbutton"

const Footer = (props) => {
    let hostButton = {
        size: "sm",
        text: "HOST YOUR OWN EVENT",
        link: "/about",
        padding: "px-4"
    }
    return (
        <div className="h-6">
            <footer id="footer" className="inset-x-0 fixed bottom-0 flex items-center h-8 md:h-10 px-8 md:px-12 xl:px-24">
                <div id="footerBreakpointBtn">
                    <PillButton {...hostButton} />
                </div>
                <div id="footerBreakpointText"> {props.left}</div>
                <div id="footerBreakpointText">{props.right}
                    <a className="underline" href="/about">{props.linkText}</a>
                </div>
            </footer>
        </div>
  )
};

export default Footer;
