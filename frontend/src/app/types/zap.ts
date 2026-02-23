
export interface ZapsResponse {
    zaps: Zap[];
}

export interface Zap {
    id: string;
    name : string,
    userId: number;
    trigger: Trigger;
    actions: Action[];
}
  
export interface Trigger {
    id: string
    zapId: string
    availableTriggerId: string
    metadata: TriggerMetadata
    type: TriggerType
}
  
export type TriggerMetadata = Record<string, unknown>
  
 export interface TriggerType {
    id: string;
    name: string;
  }
  
 export interface Action {
    id: string;
    name: string;
    metadata: ActionMetadata;
    zapId: string;
    availableActionId: string;
    sortingOrder: number;
    availableAction: AvailableAction;
  }
  
 export interface ActionMetadata {
    channel: string;
    message: string;
  }
  
 export interface AvailableAction {
    id: string;
    name: string;
  }