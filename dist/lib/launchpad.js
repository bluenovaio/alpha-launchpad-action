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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAppName = void 0;
const github = __importStar(require("@actions/github"));
const axios_1 = __importDefault(require("axios"));
const github_1 = require("./github");
const API_URL = (_a = process.env.DEBUG___URL_API_LAUNCHPAD) !== null && _a !== void 0 ? _a : 'https://api.codereviews.ai';
// Utils
// -----
function validateAppName(appName) {
    if (!/^([a-z]+)$/.test(appName)) {
        throw new Error(`The appName "${appName}" is invalid, as it must be all lower case, no number and no special characters`);
    }
}
exports.validateAppName = validateAppName;
class LaunchPad {
    constructor(props) {
        this.isSetup = false;
        this.apiKey = props.apiKey;
        this.name = props.name;
        this.port = props.port;
        this.envVars = props.envVars;
        this.commit = github.context.sha;
        this.pullRequestNumber = (0, github_1.getPullRequestNumber)();
        this.repository = github.context.repo.repo;
        this.branch = (0, github_1.getBranch)();
    }
    async setup() {
        const organization = await this.readOrganization();
        this.projectId = organization.projectId;
        this.slugId = organization.slugId;
        this.isSetup = true;
    }
    async createDeployment() {
        this.assertSetup();
        const result = await axios_1.default.post(`${API_URL}/deployments`, {
            apiKey: this.apiKey,
            name: this.name,
            branch: this.branch,
            port: Number(this.port),
            repository: this.repository,
            commit: this.commit,
            pullRequestNumber: this.pullRequestNumber,
            environmentVariables: this.envVars
        });
        return result.data;
    }
    async readOrganization() {
        const result = await axios_1.default.get(`${API_URL}/organizations/${this.apiKey}`);
        return result.data;
    }
    assertSetup() {
        if (!this.isSetup) {
            throw new Error('You must call the "LaunchPad#setup" method before running any commands');
        }
    }
}
exports.default = LaunchPad;
//# sourceMappingURL=launchpad.js.map