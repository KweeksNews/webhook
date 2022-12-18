export type SendWordPressNotificationData = {
  channel: 'wordpress' | 'content' | 'user';
  event: string;
  name?: string;
  dev?: string;
  from?: string;
  to?: string;
  title?: string;
  post?: string;
  category?: string;
  tag?: string;
  type?: string;
  author?: string;
  email?: string;
  comment?: string;
  edited_by?: string;
  deleted_by?: string;
  via?: string;
  status?: string;
  user_agent?: string;
  ip_address?: string;
  url?: string;
  home_url?: string;
  id?: string;
  nicename?: string;
  username?: string;
  role?: string;
  old_role?: string;
  new_role?: string;
};

export type SendWordPressNotificationResBody = {
  success: boolean;
  message: string;
  data?: unknown;
};
