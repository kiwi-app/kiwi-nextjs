const { prettyFileContent, packageName } = require('../infrastructure/commons');

const simpleSection = ({ module }) =>
  prettyFileContent(`
    import { RichText, RichTextComponent } from '${packageName}';

    export interface ${module}Props {
        title: RichText;
    }

    const ${module} = ({ title }: ${module}Props) => (
        <div>
            <h1>
                This is the section ${module}! <br />
                <small>Use KiwiAdmin to change 'title' value.</small>
            </h1>

            {title && (
                <>
                  <i>Current title value:</i>
                  <RichTextComponent text={title} />
                </>
            )}

            <p>
                You should edit this component but keep the base structure.<br /><br />
                This file <b>MUST</b>:
                <ul>
                    <li>export interface ${module}Props;</li>
                    <li>export default ${module};</li>
                    <li>${module} receive ${module}Props;</li>
                </ul>
            </p>
        </div>
    );

    export default ${module};
`);

const loaderSection = ({ module }) =>
  prettyFileContent(`
    import { RichText, RichTextComponent, LoaderRequest } from '${packageName}';

    // Component
    interface ${module}Loader {
        topSecretImages: string[]
    }
    
    export interface ${module}Props {
        title: RichText;
        loader: ${module}Loader;
    }

    const ${module} = ({ title, loader }: ${module}Props) => (
        <div>
            <h1>
                This is the section ${module}! <br />
                <small>Use KiwiAdmin to change 'title' value.</small>
            </h1>

            <br />
            <br />
            <h3>Current title value:</h3>
            {title && (
                <RichTextComponent text={title} />
            )}

            <br />
            <br />
            <h3>Top secret images from loader</h3>
            {loader && 
                <div style={{ display: 'flex', flexWrap: 'wrap'  }}>
                    {loader.topSecretImages.map(topSecretImage => <img key={topSecretImage} src={topSecretImage} />)}
                </div>
            }

            <br />
            <br />
            <div>
                <p>
                    You should edit this component but keep the base structure.<br /><br />
                    This file <b>MUST</b>:
                </p>
                <ul>
                    <li>export interface ${module}Props;</li>
                    <li>export default ${module};</li>
                    <li>${module} receive ${module}Props;</li>
                    <li>export async function Loader</li>
                    <li>export async function Loading (optional to use Suspense)</li>
                </ul>
            </div>
        </div>
    );

    // Loader
    export interface ${module}LoaderProps {
        imageCount: number;
    }

    export async function Loader(req: LoaderRequest, props: ${module}LoaderProps): Promise<${module}Loader> {
        const topSecretImages = [];

        for (let i = 0; i < props.imageCount; i++) {
            try {
                const response = await fetch('https://source.unsplash.com/random/500x500/?kiwis');
                topSecretImages.push(response.url);
            } catch (_) {
                console.log('Oops!');
            }
        }

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    topSecretImages,
                });
            }, 2000);
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
