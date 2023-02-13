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
  status: string;
  notification_options: {
    send_tweet: boolean;
    send_email: boolean;
  };
};

export type IncidentClosedNotificationData = BaseNotificationData & {
  event_data: {
    event_type: 'INCIDENT_CLOSED';
  };
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  is_private: string;
  source: string;
  affected_services: string;
  status: string;
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
  status: string;
  notification_options: {
    send_tweet: boolean;
    send_email: boolean;
    email_before_one_hour: boolean;
    email_before_day_hour: boolean;
    email_on_start: boolean;
    email_on_complete: boolean;
  };
  scheduled_start_time: string;
  scheduled_end_time: string;
  is_auto_update_status_on_scheduled_start: string;
  is_auto_update_status_on_scheduled_end: string;
  is_auto_update_component_status_on_scheduled_start: string;
  is_auto_update_component_status_on_scheduled_end: string;
};

export type MaintenanceOpenNotificationData = BaseNotificationData & {
  event_data: {
    event_type: 'MAINTENANCE_OPEN';
  };
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  is_private: string;
  source: string;
  affected_services: string;
  status: string;
  notification_options: {
    send_tweet: boolean;
    send_email: boolean;
    email_before_one_hour: boolean;
    email_before_day_hour: boolean;
    email_on_start: boolean;
    email_on_complete: boolean;
  };
  scheduled_start_time: string;
  scheduled_end_time: string;
  is_auto_update_status_on_scheduled_start: string;
  is_auto_update_status_on_scheduled_end: string;
  is_auto_update_component_status_on_scheduled_start: string;
  is_auto_update_component_status_on_scheduled_end: string;
};

export type MaintenanceClosedNotificationData = BaseNotificationData & {
  event_data: {
    event_type: 'MAINTENANCE_CLOSED';
  };
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  is_private: string;
  source: string;
  affected_services: string;
  status: string;
  notification_options: {
    send_tweet: boolean;
    send_email: boolean;
    email_before_one_hour: boolean;
    email_before_day_hour: boolean;
    email_on_start: boolean;
    email_on_complete: boolean;
  };
  scheduled_start_time: string;
  scheduled_end_time: string;
  is_auto_update_status_on_scheduled_start: string;
  is_auto_update_status_on_scheduled_end: string;
  is_auto_update_component_status_on_scheduled_start: string;
  is_auto_update_component_status_on_scheduled_end: string;
};

export type SendFreshstatusNotificationData =
  | IncidentOpenNotificationData
  | IncidentClosedNotificationData
  | MaintenancePlannedNotificationData
  | MaintenanceOpenNotificationData
  | MaintenanceClosedNotificationData;

export type SendFreshstatusNotificationResBody = {
  success: boolean;
  message: string;
  data?: unknown;
};
