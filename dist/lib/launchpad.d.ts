export interface Deployment {
    url: string;
}
export interface Organization {
    projectId: string;
    slugId: string;
}
interface LaunchPadConfig {
    apiKey: string;
    name: string;
}
export default class LaunchPad {
    slugId?: string;
    projectId?: string;
    private readonly apiKey;
    private readonly name;
    private readonly repository;
    private readonly branch;
    private readonly commit;
    private isSetup;
    constructor(props: LaunchPadConfig);
    setup(): Promise<void>;
    createDeployment(): Promise<Deployment>;
    private readOrganization;
    private assertSetup;
}
export {};
