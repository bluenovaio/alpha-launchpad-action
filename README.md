<div>
    <p align="center">
        <img src="/.github/assets/logo.png" align="center" width="280" />
    </p>
    <hr>
    <blockquote align="center">
        "Know thyself... before deploying to production" - The DevOps Oracle of Delphi
    </blockquote>
</div>

<br>

<p align="center">
  <a href="https://github.com/joggrdocs/delphi/actions/workflows/codeql-analysis.yml">
    <img alt="CodeQL" src="https://github.com/joggrdocs/delphi/actions/workflows/codeql-analysis.yml/badge.svg">
  </a>
  <a href="https://img.shields.io/github/v/release/joggrdocs/delphi">
    <img alt="GitHub Release" src="https://img.shields.io/github/v/release/joggrdocs/delphi">
  </a>
  <br/>
</p>

Preview environments for every Pull Request.

## Usage

```yaml
name: "Preview Environments"
on:
  pull_request:
    types: [labeled, synchronize, opened, reopened]
    branches:
      - main
jobs:
  previews:
    name: "🔮 Previews"
    runs-on: ubuntu-latest
    if: contains(github.event.pull_request.labels.*.name, 'preview')
    steps:
      - name: Checkout Code
        uses: actions/checkout@v1
      - name: "🔮 Launch Preview Environment"
        uses: joggrdocs/delphi@v1
        with:
          name: my-application
          gcp_service_account_key: ${{ secrets.PREVIEWS_SERVICE_ACCOUNT_KEY }}
          gcp_project_id: ${{ vars.GCP_PROJECT_ID_PREVIEWS }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
          gcp_artifact_repository: ${{ vars.GCP_ARTIFACT_REGISTRY_PREVIEWS }}
```

## API Documentation

<!-- docs:start -->
### Inputs

| Field | Required | Description | Default |
| ----- | -------- | ----------- | ------- |
| name | yes | The name of the service (must be unique) to be deployed. This cannot exceed 24 characters | - |
| gcp_service_account_key | yes | The Service Account JSON Key used to push images to the GCP Artifact Registry. | - |
| gcp_artifact_repository | yes | The Artifact Registry name, you can override for custom names (i.e. the 'acme' in us-docker.pkg.dev/able-sailor-21423/acme) | - |
| github_token | yes | Github Token, pass in the `secrets.GITHUB_TOKEN`. | - |
| port | no | The port that the application will run on in the container. | 8080 |
| service_account | no | The service account to be used for the Cloud Run service. | - |
| env_vars | no | List of environment variables that will be injected during runtime, each on a new line. | - |
| secrets | no | List of secrets that will be injected during runtime, each on a new line. | - |
| flags | no | List of flags that will be injected during runtime. | - |
| gcp_region | no | The GCP Region where the service will be deployed. | us-central1 |
| gcp_project_id | no | The GCP Project ID where the service will be deployed. | - |
| gcp_tag | no | A tag to be applied to the Cloud Run service, used for ingress or other permissions. | - |
| docker_file_name | no | The Dockerfile name, you can override for custom names (i.e. DevDockerfile) | Dockerfile |
| docker_directory | no | Directory where the DockerFile is located. | . |
| docker_build_args | no | Comma separated list of arguments that will be injected during the build, each on a new line. | - |

### Outputs

| Field | Description |
| ----- | ----------- |
| url | The preview URL for the running application |

<!-- docs:end -->

## Examples

### Full Example

This example includes all the bells and whistles.

```yaml
name: "Preview Environments"

on:
  pull_request:
    types: [labeled, synchronize, opened, reopened]
    branches:
      - main

jobs:
  previews:
    name: "🔮 Previews"
    runs-on: ubuntu-latest
    if: contains(github.event.pull_request.labels.*.name, 'preview')
    steps:
      - name: Checkout Code
        uses: actions/checkout@v1
      - id: preview
        name: "🔮 Launch Preview Environment"
        uses: joggrdocs/delphi@v1
        with:
          # The name of your application (must be unique)
          name: my-application

          # (optional) The port your application is running on, defaults to 8080
          port: 8080

          # (Optional) Environment Variables that will be injected during runtime
          env_vars: |
            FOO=bar
            BAR=foo

          # (Optional) Secrets that will be injected during runtime from GCP Secret Manager
          secrets: |
            MY_SECRET=my-secret:latest
            ANOTHER_SECRET=another-secret:latest

          # The GCP Service Account Key, used to authenticate with GCP
          gcp_service_account_key: ${{ secrets.PREVIEWS_SERVICE_ACCOUNT_KEY }}

          # The GCP Project ID
          gcp_project_id: ${{ vars.GCP_PROJECT_ID }}

          # (optional) The GCP Region, defaults to us-central1
          gcp_region: ${{ vars.GCP_REGION }}

          # (optional) The GCP Artifact Registry, where the Docker image will be stored
          gcp_artifact_repository: ${{ vars.GCP_ARTIFACT_REPOSITORY }}

          # Default token for the repository
          github_token: ${{ secrets.GITHUB_TOKEN }}

          # (Optional) A directory containing a Dockerfile
          docker_directory: ./examples/nodejs-simple

          # (Optional) The Dockerfile name, you can override for custom names (i.e. DevDockerfile)
          docker_file_name: DevDockerfile

          # (Optional) Docker Build Arguments (i.e. --build-args) that will be injected during the build
          docker_build_args: FOO=bar,BAR=foo
```

### Basic Example

This is the minimal code you will need to set up previews.

```yaml
name: "Preview Environments"

on:
  pull_request:
    types: [labeled, synchronize, opened, reopened]
    branches:
      - main

jobs:
  previews:
    name: "🔮 Previews"
    runs-on: ubuntu-latest
    if: contains(github.event.pull_request.labels.*.name, 'preview')
    steps:
      - name: Checkout Code
        uses: actions/checkout@v1
      - id: preview
        name: "🔮 Launch Preview Environment"
        uses: joggrdocs/delphi@v1
        with:
          # The name of your application (must be unique)
          name: my-application

          # The GCP Service Account Key, used to authenticate with GCP
          gcp_service_account_key: ${{ secrets.PREVIEWS_SERVICE_ACCOUNT_KEY }}

          # The GCP Project ID
          gcp_project_id: ${{ vars.GCP_PROJECT_ID }}

          # Default token for the repository
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

### Slack Notification

```yaml
name: "Preview Environments"

on:
  pull_request:
    types: [labeled, synchronize, opened, reopened]
    branches:
      - main

jobs:
  previews:
    name: "🔮 Previews"
    runs-on: ubuntu-latest
    if: contains(github.event.pull_request.labels.*.name, 'preview')
    steps:
      - name: Checkout Code
        uses: actions/checkout@v1
      - id: preview
        name: "🔮 Launch Preview Environment"
        uses: joggrdocs/delphi@v1
        with:
          name: my-application
          gcp_service_account_key: ${{ secrets.PREVIEWS_SERVICE_ACCOUNT_KEY }}
          gcp_project_id: ${{ vars.GCP_PROJECT_ID }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
      - name: Send Slack Notification
        id: slack
        uses: slackapi/slack-github-action@v1.25.0
        with:
          # For posting a rich message using Block Kit https://app.slack.com/block-kit-builder
          payload: |
            {
              "text": "New Preview <https://github.com/${{ github.repository }|${{ github.repository }}> for <https://github.com/${{ github.repository }}/pull/${{ github.event.number }}|PR#${{ github.event.number }}>",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "New Preview <https://github.com/${{ github.repository }|${{ github.repository }}> for <https://github.com/${{ github.repository }}/pull/${{ github.event.number }}|PR#${{ github.event.number }}> by <https://github.com/${{ github.actor }}/@${{ github.actor }}>"
                  }
                },
                {
                  "type": "divider"
                },
                { 
                  "type": "actions",
                  "elements": [
                    {
                      "type": "button",
                      "text": {
                        "type": "plain_text",
                        "text": "View Preview",
                        "emoji": true
                      },
                      "value": "view-runs",
                      "url": "${{ steps.preview.outputs.url }}",
                      "action_id": "view-preview-action"
                    }
                  ]
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
          SLACK_WEBHOOK_TYPE: INCOMING_WEBHOOK
```

## License

Licensed under MIT.

<br>
<hr>
<h2 align="center">

Want to sign up for Joggr? Check us out at <a href="https://joggr.io">Joggr</a>

</h2>

