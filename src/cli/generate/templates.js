const { prettyFileContent, packageName } = require('../infrastructure/commons');

const simpleSection = ({ module }) =>
  prettyFileContent(`
    import { RichText, RichTextComponent } from '${packageName}';

    export interface ${module}Props {
        title: RichText;
    }

    const ${module} = ({ title }: ${module}Props) => (
        <div style={{ width: '100%', margin: '0 auto', textAlign: 'center', padding: '2rem 1rem' }}>
            <h1>
                This is the section ${module}! <br />
                <small>Use KiwiAdmin to change 'title' value.</small>
            </h1>
            
            <br />
            
            <p>Current title value:</p>
            {title && (
                <RichTextComponent text={title} />
            )}

            <br />

            <div>
                <p>
                    You should edit this component but keep the base structure.<br /><br />
                    This file <b>MUST</b>:
                </p>
                <ul>
                    <li>export interface ${module}Props;</li>
                    <li>export default ${module};</li>
                    <li>${module} receive ${module}Props as props</li>
                </ul>
            </div>
        </div>
    );

    export default ${module};
`);

const loaderSection = ({ module }) =>
  prettyFileContent(`
    import { RichText, RichTextComponent, LoaderRequest } from '${packageName}';

    // Component
    interface ${module}Loader {
        random: number;
        number: number;
        sum: number;
    }
    
    export interface ${module}Props {
        title: RichText;
        loader: ${module}Loader;
    }

    const ${module} = ({ title, loader, ...props }: ${module}Props) => (
        <div style={{ width: '100%', margin: '0 auto', textAlign: 'center', padding: '2rem 1rem' }}>
            <h1>
                This is the section ${module}! <br />
                <small>Use KiwiAdmin to change 'title' value.</small>
            </h1>

            <br />
            
            <h2>Loader metadata:</h2>
            <code>{JSON.stringify(props)}</code>
            
            <br />
            <br />

            <h3>Current title value:</h3>
            {title && (
                <RichTextComponent text={title} />
            )}
            
            <br />

            <h3>Loader info:</h3>
            {loader && (
                <p>
                    {loader?.random} + {loader?.number} = {loader?.sum}{' '}
                </p>
            )}

            <br />

            <div>
                <p>
                    You should edit this component but keep the base structure.<br /><br />
                    This file <b>MUST</b>:
                </p>
                <ul>
                    <li>export interface ${module}Props;</li>
                    <li>export default ${module};</li>
                    <li>${module} receive ${module}Props as props</li>
                    <li>export async function Loader</li>
                    <li>export async function Loading (optional for Suspense)</li>
                </ul>
            </div>
        </div>
    );

    // Loader
    export interface ${module}LoaderProps {
        /** @description sum this number to a random one */
        number: number;
    }

    export async function Loader(req: LoaderRequest, props: ${module}LoaderProps): Promise<${module}Loader> {
        const random = Math.floor(Math.random() * 101);

        return Promise.resolve({
            random,
            number: props.number,
            sum: random + props.number,
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
