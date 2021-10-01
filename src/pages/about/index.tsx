import React, { createElement as h } from "https://esm.sh/react";

interface AboutProps {
   name: unknown[];
}

const About: React.FunctionComponent<AboutProps> = ({ name }) => {
   const [state, setState] = React.useState<number>(0);

   const handleButtonClick = () => {
      setState((prev) => prev += 1);
   };

   return (
      <div>
         <h3>About Page</h3>

         <a href="/">Go to INDEX</a>

         <h5>{state}</h5>

         <button onClick={handleButtonClick}>++</button>
      </div>
   );
};

export default About;
