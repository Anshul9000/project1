const { exec } = require('child_process');
const readline = require('readline');

// Helper function to run a command in the shell
function runCommand(command, successMessage, errorMessage) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`${errorMessage}: ${stderr}`);
                reject(error);
            } else {
                console.log(successMessage);
                resolve(stdout.trim());
            }
        });
    });
}

// Function to check for changes
async function checkForChanges() {
    const statusCommand = 'git status --porcelain';
    try {
        const statusOutput = await runCommand(statusCommand, '', 'Failed to get git status');
        if (statusOutput) {
            console.log('Changes detected:');
            console.log(statusOutput);
            return true;
        } else {
            console.log('No changes to commit.');
            return false;
        }
    } catch (error) {
        return false;
    }
}

// Function to commit changes
async function commitChanges(commitMessage) {
    try {
        await runCommand('git add .', 'Staging changes...', 'Failed to stage changes');
        const commitCommand = `git commit -m "${commitMessage}"`;
        await runCommand(commitCommand, 'Changes committed successfully!', 'Failed to commit changes');
    } catch (error) {
        console.error('Failed to commit changes.');
    }
}

// Function to push changes to remote
async function pushChanges() {
    try {
        await runCommand('git push', 'Changes pushed to remote!', 'Failed to push changes');
    } catch (error) {
        console.error('Failed to push changes.');
    }
}

// Main function to automate Git workflow
async function autoSaveAndUpdate() {
    const changes = await checkForChanges();
    if (changes) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Enter commit message: ', async (commitMessage) => {
            if (commitMessage) {
                await commitChanges(commitMessage);
                await pushChanges();
            } else {
                console.log('Commit message cannot be empty.');
            }
            rl.close();
        });
    }
}

// Start the script
autoSaveAndUpdate();
