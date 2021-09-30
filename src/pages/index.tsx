import React, { createElement as h } from "https://esm.sh/react";

interface IndexProps {
   users: unknown[];
}

const Index: React.FunctionComponent<IndexProps> = ({ users }) => {
   return (
      <div>
         <h3>Index Page</h3>

         <a href="/about">Go to ABOUT</a>

         <pre>
            <code>
               {JSON.stringify(users, null, 4)}
            </code>
         </pre>
      </div>
   );
};

export default Index;
