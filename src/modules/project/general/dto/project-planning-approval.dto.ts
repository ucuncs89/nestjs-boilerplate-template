export class ProjectPlanningApprovalDto {
  relation_id: number;
  type: string;
  status: StatusApprovalEnum;
  status_desc?: string;
}
export enum StatusApprovalEnum {
  rejected = 'rejected',
  approved = 'approved',
  waiting = 'waiting',
}
