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
  editedby?: string;
  deletedby?: string;
  via?: string;
  status?: string;
  useragent?: string;
  ipaddress?: string;
  url?: string;
  homeurl?: string;
  id?: string;
  nicename?: string;
  username?: string;
  role?: string;
  oldrole?: string;
  newrole?: string;
};

export type SendWordPressNotificationResBody = {
  success: boolean;
  message: string;
  data?: unknown;
};
