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
Object.defineProperty(exports, "__esModule", { value: true });
const github = __importStar(require("@actions/github"));
const exec = __importStar(require("@actions/exec"));
// Utils
// -----
async function isBuildXAvailable() {
    return await exec
        .getExecOutput('docker', ['buildx'], {
        ignoreReturnCode: true,
        silent: true
    })
        .then((res) => {
        if (res.stderr.length > 0 && Number(res.exitCode) !== 0) {
            return false;
        }
        return Number(res.exitCode) === 0;
    });
}
class Docker {
    constructor(props) {
        this.isSetup = false;
        this.serviceAccountKey = props.serviceAccountKey;
        this.projectId = props.projectId;
        this.slug = props.slug;
        this.name = props.name;
    }
    async setup() {
        if (await isBuildXAvailable()) {
            await this.login();
            this.isSetup = true;
        }
        else {
            throw new Error('docker buildx is not available, unable to run this command');
        }
    }
    async login() {
        this.assertSetup();
        await exec.getExecOutput('docker', [
            'login',
            '-u _json_key',
            `-p "${this.serviceAccountKey}"`,
            'https://gcr.io'
        ]);
    }
    async buildAndPush() {
        this.assertSetup();
        await exec.getExecOutput('docker', [
            'build',
            `-t ${this.getTag()}`,
            '.'
        ]);
        await exec.getExecOutput('docker', [
            'push',
            this.getTag()
        ]);
    }
    getTag() {
        return `gcr.io/${this.projectId}/alpha-launchpad/${this.slug}/${this.name}:${github.context.sha}`;
    }
    assertSetup() {
        if (!this.isSetup) {
            throw new Error('You must call the "Docker#setup" method before running any commands');
        }
    }
}
exports.default = Docker;
//# sourceMappingURL=docker.js.map