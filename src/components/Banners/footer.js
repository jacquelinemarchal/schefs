import React from "react";
import WhitePillButton from  "../Buttons/wpillbutton"

const Footer = (props) => {
    let hostButton = {
        size: "text-base",
        text: "HOST YOUR OWN EVENT",
        link: "/about",
        padding: "px-4"
    }
    return (
        <div className="h-6">
          <footer id="footer" className="inset-x-0 fixed bottom-0 flex items-center h-12 sm:h-8 md:h-10 px-2">
            <div className="px-6 md:px-12 xl:px-24">
              <div id="footerBreakpointBtn">
                <WhitePillButton {...hostButton} />
              </div>
              <div id="footerBreakpointText">{props.left}</div>
              <div id="footerBreakpointText">{props.right}
                <a className="underline" href="/about">{props.linkText}</a>
              </div>
            </div>
          </footer>
        </div>
  )
};

export default Footer;
