const { prettyFileContent } = require('../infrastructure/commons');

const simpleSection = ({ module }) =>
  prettyFileContent(`
    import React from 'react';

    export interface ${module}Props {
        title: string,
    }

    const ${module} = ({ title }: ${module}Props) => (
        <div>
            <h1>
                This is the section ${module}! <br />
                <small>Use KiwiAdmin to change 'title' value.</small>
            </h1>

            {title && <i>Current title value: "{title}"</i>}

            <p>
                You should edit this component but keep the base structure.<br /><br />
                This file <b>MUST</b>:
                <ul>
                    <li>export interface ${module}Props;</li>
                    <li>export default ${module};</li>
                    <li>${module} props implements ${module}Props;</li>
                </ul>
            </p>
        </div>
    );

    export default ${module};
`);

const loaderSection = ({ module }) =>
  prettyFileContent(`
    import React from 'react';
    import { LoaderRequest } from "@kiwi-app/kiwi-nextjs";

    // Component
    export interface ${module}Props {}

    const ${module} = (props: ${module}Props) => (
        <div>
            <p>
                You should edit this component but keep the base structure.<br /><br />
                This file <b>MUST</b>:
                <ul>
                    <li>export interface ${module}Props;</li>
                    <li>export default ${module};</li>
                    <li>${module} props implements ${module}Props;</li>
                    <li>export async function Loader</li>
                    <li>export async function Loading (optional to use Suspense)</li>
                </ul>
            </p>
        </div>
    );

    // Loader
    interface ${module}Loader { }
    export interface ${module}LoaderProps { }

    export async function Loader(req: LoaderRequest, props: ${module}LoaderProps): Promise<${module}Loader> {
        return new Promise((resolve, reject) => {
            const data: ${module}Loader = {};
            resolve(data);
        });
    }

    // Loading
    export function Loading() {
        return <p>You will see me while this section is loading</p>
    }

    export default ${module};
`);

module.exports = {
  simpleSection,
  loaderSection,
};
