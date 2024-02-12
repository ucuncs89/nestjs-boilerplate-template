export class ProjectPlanningApprovalDto {
  relation_id: number;
  type: string;
  status: StatusApprovalEnum;
  project_id: number;
  name: string;
  status_desc?: string;
}
export enum StatusApprovalEnum {
  rejected = 'rejected',
  approved = 'approved',
  waiting = 'waiting',
}
