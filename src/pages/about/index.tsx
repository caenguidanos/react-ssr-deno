import React, { createElement as h } from "https://esm.sh/react";

interface AboutProps {
   name: unknown[];
}

const About: React.FunctionComponent<AboutProps> = ({ name }) => {
   return (
      <div>
         <h3>About Page</h3>
         <a href="/">Go to INDEX</a>

         <h5>{"--> " + name}</h5>
      </div>
   );
};

export default About;
