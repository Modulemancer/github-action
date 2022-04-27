# Modulemancer - Terraform Private Registry - GitHub Action
This is a GitHub Action to automatically login to [Modulemancer](https://modulemanacer.com) to enable the runner to pull modules from Modulemancer.

[Review in the GitHub action marketplace](https://github.com/marketplace/actions/modulemancer-registry-login)

### What is Modulemancer?
[Modulemancer](https://modulemancer.com) is a terraform and other infra private module registry. It replaces the Terraform registry with optimized features making it easy to publish, search, and share modules between organizations.

### How does this GitHub action work?
It does this by converting the GitHub security token into an [Authress identity token](https://authress.io) which Modulemancer understands. After converting the token, it populates the terraform credentials file for your `modulemancer.com` registry. The action completes this by creating a [TF credentials file](https://www.terraform.io/cli/config/config-file#locations) is the os-specific location.

## Usage
In your GitHub action workflow add the follow step

```yaml
# Important! This is required: https://docs.github.com/en/actions/security-guides/automatic-token-authentication
permissions:
  id-token: write

jobs:
  build:
    steps:
    - uses: actions/checkout@v2
    - uses: hashicorp/setup-terraform@v1
      with:
        terraform_version: 1.1.9

    # use the github action before terraform init: https://github.com/Modulemancer/github-action
    - uses: modulemancer/github-action@v1

    - name: Terraform Init
      run: terraform init -reconfigure
```
