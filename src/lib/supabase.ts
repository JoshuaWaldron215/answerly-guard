import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// TypeScript types for database tables
export type PhoneNumberStatus = 'pending' | 'provisioning' | 'active' | 'failed';

export type NotificationPreferences = {
  email_all_calls: boolean;
  email_hot_leads: boolean;
  email_missed_calls: boolean;
  email_daily_summary: boolean;
};

export type OnboardingSteps = {
  phone_assigned: boolean;
  voice_selected: boolean;
  business_info_completed: boolean;
  test_call_completed: boolean;
};

export type User = {
  id: string;
  email: string;
  business_name: string;
  phone_number: string | null;
  timezone: string;
  business_hours: Record<string, any>;
  services: string[];
  booking_link: string | null;
  auto_sms_enabled: boolean;
  vapi_phone_number: string | null;
  vapi_assistant_id: string | null;
  vapi_voice: string | null;
  forward_after_rings: number;
  subscription_status: string;
  trial_ends_at: string;
  google_calendar_token: string | null;
  google_calendar_refresh_token: string | null;
  google_calendar_token_expires_at: string | null;
  google_calendar_connected_at: string | null;
  google_calendar_email: string | null;
  // New v1 fields
  phone_number_status: PhoneNumberStatus;
  phone_provisioning_error: string | null;
  phone_provisioned_at: string | null;
  notification_preferences: NotificationPreferences;
  onboarding_completed: boolean;
  onboarding_steps: OnboardingSteps;
  created_at: string;
  updated_at: string;
};

export type Call = {
  id: string;
  user_id: string;
  vapi_call_id: string | null;
  phone_number: string;
  caller_name: string | null;
  duration: number | null;
  status: 'answered' | 'missed' | 'ai_answered' | 'spam';
  intent: 'high' | 'medium' | 'low';
  confidence: number | null;
  outcome: 'booked' | 'waiting' | 'dropped' | 'spam';
  vehicle_make: string | null;
  vehicle_model: string | null;
  vehicle_year: number | null;
  service_requested: string | null;
  preferred_date: string | null;
  notes: string | null;
  transcript: any;
  summary: string | null;
  recording_url: string | null;
  last_contacted_at: string | null;
  contacted_count: number;
  created_at: string;
  updated_at: string;
};

export type SmsLog = {
  id: string;
  user_id: string;
  call_id: string | null;
  to_number: string;
  message: string;
  sms_type: 'auto_followup' | 'manual' | 'reminder';
  twilio_sid: string | null;
  status: string;
  sent_at: string;
};

// Database helper functions
export const db = {
  // Get current user's business data
  async getUser(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data;
  },

  // Get all calls for a user
  async getCalls(userId: string, filters?: {
    status?: string;
    intent?: string;
    limit?: number;
  }): Promise<Call[]> {
    let query = supabase
      .from('calls')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.intent) {
      query = query.eq('intent', filters.intent);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching calls:', error);
      return [];
    }

    return data || [];
  },

  // Get dashboard stats
  async getDashboardStats(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all calls from today
    const { data: calls, error } = await supabase
      .from('calls')
      .select('status, intent, outcome')
      .eq('user_id', userId)
      .gte('created_at', today.toISOString());

    if (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalCalls: 0,
        hotLeads: 0,
        booked: 0,
        needsFollowup: 0
      };
    }

    const totalCalls = calls?.length || 0;
    const hotLeads = calls?.filter(c => c.intent === 'high' && c.outcome !== 'booked').length || 0;
    const booked = calls?.filter(c => c.outcome === 'booked').length || 0;
    const needsFollowup = calls?.filter(c => c.outcome === 'waiting').length || 0;

    return {
      totalCalls,
      hotLeads,
      booked,
      needsFollowup
    };
  },

  // Update user settings
  async updateUser(userId: string, updates: Partial<User>) {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);

    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Provision a Vapi phone number for the user
  async provisionPhoneNumber(userId: string, areaCode?: string): Promise<{ success: boolean; phoneNumber?: string; error?: string }> {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/provision-phone-number`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, areaCode }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to provision phone number');
      }

      return {
        success: true,
        phoneNumber: result.phoneNumber,
      };
    } catch (error: any) {
      console.error('Error provisioning phone number:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Get calls that need follow-up (for smart follow-up cards)
  async getFollowUpCalls(userId: string): Promise<Call[]> {
    const { data, error } = await supabase
      .from('calls')
      .select('*')
      .eq('user_id', userId)
      .in('outcome', ['waiting'])
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching follow-up calls:', error);
      return [];
    }

    return data || [];
  },

  // Get hot leads (high intent, not booked)
  async getHotLeads(userId: string): Promise<Call[]> {
    const { data, error } = await supabase
      .from('calls')
      .select('*')
      .eq('user_id', userId)
      .eq('intent', 'high')
      .neq('outcome', 'booked')
      .neq('outcome', 'spam')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching hot leads:', error);
      return [];
    }

    return data || [];
  },
};
