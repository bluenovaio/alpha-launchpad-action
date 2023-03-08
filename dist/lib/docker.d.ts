interface DockerProps {
    name: string;
    projectId: string;
    slug: string;
    apiKey: string;
    serviceAccountKey: string;
    dockerfile?: string;
    directory?: string;
    buildArgs?: string[];
}
export default class Docker {
    private isSetup;
    private readonly serviceAccountKey;
    private readonly projectId;
    private readonly directory;
    private readonly dockerfile;
    private readonly name;
    private readonly slug;
    private readonly buildArgs;
    constructor(props: DockerProps);
    setup(): Promise<void>;
    login(): Promise<void>;
    buildAndPush(): Promise<void>;
    private getTag;
    private assertSetup;
}
export {};
