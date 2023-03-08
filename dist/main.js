"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const launchpad_1 = __importStar(require("./lib/launchpad"));
const parser_1 = require("./lib/parser");
const github = __importStar(require("./lib/github"));
const docker_1 = __importDefault(require("./lib/docker"));
async function run() {
    var _a, _b;
    try {
        const serviceAccountKey = core.getInput('service_account_key');
        const directory = core.getInput('directory');
        const dockerfile = core.getInput('dockerfile');
        const apiKey = core.getInput('api_key');
        const name = core.getInput('name');
        const buildArgs = core.getInput('build_args');
        const envVars = core.getInput('env_vars');
        const port = core.getInput('port');
        (0, launchpad_1.validateAppName)(name);
        const launchpad = new launchpad_1.default({
            name,
            port,
            apiKey,
            envVars
        });
        await launchpad.setup();
        // Update description that a deployment is in flight
        if (github.isPullRequest()) {
            await github.prependToPullDescription(github.getRunningDescription());
        }
        // Build & Push Image to LaunchPad repository
        const docker = new docker_1.default({
            serviceAccountKey,
            name,
            directory,
            dockerfile,
            projectId: launchpad.projectId,
            slug: launchpad.slugId,
            buildArgs: (0, parser_1.parseListInputs)(buildArgs),
            apiKey: apiKey
        });
        await docker.setup();
        await docker.buildAndPush();
        // Deploy built image to LaunchPad Cloud
        const result = await launchpad.createDeployment();
        // Add Preview URL to PR
        if (github.isPullRequest()) {
            await github.prependToPullDescription(github.getFinishedDescription(result.url));
        }
        core.setOutput('url', result.url);
    }
    catch (error) {
        const message = (_b = (_a = error) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : 'Unknown Fatal Error';
        await github.addComment(`
### LaunchPad Error

LaunchPad failed to deploy, please contact support at [support@bluenova.io](mailto:support@bluenova.io).

<details>
  <summary>Error Message</summary>
  <code>
    ${message}
  </code>
</details>
    `);
        core.setFailed(message);
    }
}
run();
//# sourceMappingURL=main.js.map