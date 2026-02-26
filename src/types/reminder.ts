export interface Reminder {
  id: string;
  userId: string;
  fcmToken: string;
  title: string;
  body: string;
  triggerAt: string | null;
  rrule: string | null;
  timezone: string;
  lastTriggeredAt: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NextOccurrencesResponse {
  id: string;
  title: string;
  rrule: string;
  description: string;
  lastTriggered: string | null;
  nextOccurrences: string[];
}
