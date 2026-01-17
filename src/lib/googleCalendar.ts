// Google Calendar API helpers
import { supabase } from './supabase';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || '';

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  attendees?: {
    email: string;
    displayName?: string;
  }[];
}

/**
 * Initiates Google Calendar OAuth flow
 */
export const connectGoogleCalendar = (userId: string) => {
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ].join(' ');

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: scopes,
    access_type: 'offline',
    prompt: 'consent',
    state: userId, // Pass userId to identify user in callback
  });

  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

/**
 * Disconnect Google Calendar
 */
export const disconnectGoogleCalendar = async (userId: string) => {
  const { error } = await supabase
    .from('users')
    .update({
      google_calendar_token: null,
      google_calendar_refresh_token: null,
      google_calendar_token_expires_at: null,
      google_calendar_connected_at: null,
      google_calendar_email: null,
    })
    .eq('id', userId);

  if (error) {
    throw error;
  }
};

/**
 * Refresh Google Calendar access token if expired
 */
export const refreshGoogleCalendarToken = async (userId: string, refreshToken: string) => {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh Google Calendar token');
  }

  const data = await response.json();
  const expiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString();

  // Update token in database
  const { error } = await supabase
    .from('users')
    .update({
      google_calendar_token: data.access_token,
      google_calendar_token_expires_at: expiresAt,
    })
    .eq('id', userId);

  if (error) {
    throw error;
  }

  return data.access_token;
};

/**
 * Get valid access token (refreshes if needed)
 */
export const getValidAccessToken = async (
  userId: string,
  currentToken: string,
  expiresAt: string,
  refreshToken: string
): Promise<string> => {
  const now = new Date();
  const expiry = new Date(expiresAt);

  // Refresh if token expires in less than 5 minutes
  if (expiry.getTime() - now.getTime() < 5 * 60 * 1000) {
    return await refreshGoogleCalendarToken(userId, refreshToken);
  }

  return currentToken;
};

/**
 * Fetch events from Google Calendar
 */
export const fetchGoogleCalendarEvents = async (
  accessToken: string,
  timeMin?: Date,
  timeMax?: Date
): Promise<GoogleCalendarEvent[]> => {
  const params = new URLSearchParams({
    timeMin: (timeMin || new Date()).toISOString(),
    timeMax: (timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).toISOString(), // Default 30 days
    singleEvents: 'true',
    orderBy: 'startTime',
  });

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch Google Calendar events');
  }

  const data = await response.json();
  return data.items || [];
};

/**
 * Create event in Google Calendar
 */
export const createGoogleCalendarEvent = async (
  accessToken: string,
  event: Omit<GoogleCalendarEvent, 'id'>
): Promise<GoogleCalendarEvent> => {
  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to create calendar event:', error);
    throw new Error('Failed to create calendar event');
  }

  return await response.json();
};

/**
 * Update event in Google Calendar
 */
export const updateGoogleCalendarEvent = async (
  accessToken: string,
  eventId: string,
  updates: Partial<GoogleCalendarEvent>
): Promise<GoogleCalendarEvent> => {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update calendar event');
  }

  return await response.json();
};

/**
 * Delete event from Google Calendar
 */
export const deleteGoogleCalendarEvent = async (
  accessToken: string,
  eventId: string
): Promise<void> => {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to delete calendar event');
  }
};

/**
 * Check if user has Google Calendar connected
 */
export const isGoogleCalendarConnected = (user: any): boolean => {
  return !!(
    user?.google_calendar_token &&
    user?.google_calendar_refresh_token &&
    user?.google_calendar_connected_at
  );
};
