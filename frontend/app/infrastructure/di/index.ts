export {
  serviceContainer,
  getAuthService,
  getProjectService,
  getConfidentService,
  getTagService,
} from "./container";

export type {
  IAuthService,
  IProjectService,
  IConfidentService,
  ITagService,
} from "./container";

export {
  ServiceProvider,
  useServices,
  useAuthService,
  useProjectService,
  useConfidentService,
  useTagService,
} from "./ServiceProvider";
