const prompts = require('prompts');

const handleSigTerm = () => process.exit(0);

process.on('SIGINT', handleSigTerm);
process.on('SIGTERM', handleSigTerm);

const onPromptState = (state) => {
    if (state.aborted) {
        process.stdout.write('\x1B[?25h');
        process.stdout.write('\n');
        process.exit(1);
    }
};

const onPromptCancel = () => {
    console.error('Exiting.');
    process.exit(1);
};

async function prompt(config = {}) {
    const data = await prompts({
        onState: onPromptState,
        ...config,
    }, { onCancel: onPromptCancel });

    return data;
}

module.exports = {
    prompt
};
