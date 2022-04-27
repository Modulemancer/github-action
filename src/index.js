const core = require('@actions/core');
const fs = require('fs').promises;
const axios = require('axios');

async function run() {
  if (!process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN) {
    core.setFailed('InvalidJobConfiguration: The GitHub job does not have the required "permissions.id-token: write" defined in the action configuration. Review the expected configuration @ https://github.com/Modulemancer/github-action#usage');
    throw Error('InvalidJobConfiguration: The GitHub job does not have the required "permissions.id-token: write" defined in the action configuration. Review the expected configuration @ https://github.com/Modulemancer/github-action#usage');
  }

  let token = null;
  try {
    // Attempt to load credentials from the GitHub OIDC provider.
    const gitHubActionRunnerToken = await core.getIDToken('modulemancer.com');
    const tokenResponse = await axios.post('https://login.modulemancer.com/api/authentication/github/tokens',
      { client_id: 'con_kHAyJNZkdULdc76dnKBxtw', grant_type: 'client_credentials' },
      { headers: { Authorization: `Bearer ${gitHubActionRunnerToken}` } });

    token = tokenResponse.data.access_token;
  } catch (error) {
    if (error.response.status) {
      core.setFailed(`Failed to exchange token with Modulemancer: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      throw error.data;
    }

    core.setFailed(`Failed to exchange token with Modulemancer: ${error.code} - ${error.message}`);
    throw error;
  }

  try {
    const data = `
credentials "modulemancer.com" {
  token = "${token}"
}`;
    await fs.writeFile('~/.terraformrc', data);
  } catch (error) {
    core.setFailed(`FileSystemError: Failed to write .terraformrc credentials file: ${error.code} - ${error.message}`);
    throw error;
  }
}

exports.run = run;

if (require.main === module) {
  run();
}
