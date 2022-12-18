interface BaseNotificationData {
  event_data: {
    webhook_id: number;
    account_id: number;
    account_name: string;
    event_id: number;
    event_created_on: string;
  };
}

export type IncidentOpenNotificationData = BaseNotificationData & {
  event_data: {
    event_type: 'INCIDENT_OPEN';
  };
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  is_private: string;
  source: string;
  affected_services: string;
  notification_options: {
    send_tweet: boolean;
    send_email: boolean;
  };
};

export type MaintenancePlannedNotificationData = BaseNotificationData & {
  event_data: {
    event_type: 'MAINTENANCE_PLANNED';
  };
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  is_private: string;
  source: string;
  affected_services: string;
  notification_options: {
    email_before_one_hour: boolean;
    email_before_day_hour: boolean;
    email_on_start: boolean;
    email_on_complete: boolean;
    send_tweet: boolean;
    send_email: boolean;
  };
  scheduled_start_time: string;
  scheduled_end_time: string;
  is_auto_update_status_on_scheduled_start: string;
  is_auto_update_status_on_scheduled_end: string;
  is_auto_update_component_status_on_scheduled_start: string;
  is_auto_update_component_status_on_scheduled_end: string;
};

export type IncidentNoteCreatedNotificationData = BaseNotificationData & {
  event_data: {
    event_type: 'INCIDENT_NOTE_CREATE';
  };
  id: number;
  incident_id: number;
  incident_status: string;
  title: string;
  message: string;
  status: string;
  is_private: string;
  notification_options: {
    send_tweet: boolean;
    send_email: boolean;
  };
};

export type MaintenanceNoteCreatedNotificationData = BaseNotificationData & {
  event_data: {
    event_type: 'MAINTENANCE_NOTE_CREATE';
  };
  id: number;
  incident_id: number;
  incident_status: string;
  title: string;
  message: string;
  status: string;
  is_private: string;
  notification_options: {
    send_tweet: boolean;
    send_email: boolean;
  };
};

export type SendFreshstatusNotificationData =
  | IncidentOpenNotificationData
  | MaintenancePlannedNotificationData
  | IncidentNoteCreatedNotificationData
  | MaintenanceNoteCreatedNotificationData;

export type SendFreshstatusNotificationResBody = {
  success: boolean;
  message: string;
  data?: unknown;
};
