import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { db, type Call, supabase } from "@/lib/supabase";
import {
  isGoogleCalendarConnected,
  fetchGoogleCalendarEvents,
  getValidAccessToken,
  type GoogleCalendarEvent
} from "@/lib/googleCalendar";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  List,
  Grid3x3,
  Loader2,
  Phone,
  MessageSquare,
  X,
  Clock,
  User,
  Car,
  Sparkles,
  ExternalLink
} from "lucide-react";

type ViewMode = 'month' | 'week' | 'list';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time?: string;
  customer: string;
  phone: string;
  service: string;
  vehicle?: string;
  status: 'booked' | 'waiting' | 'completed';
  notes?: string;
  source: 'internal' | 'google';
  callData?: Call;
  googleEvent?: GoogleCalendarEvent;
}

export default function Calendar() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [googleEvents, setGoogleEvents] = useState<GoogleCalendarEvent[]>([]);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  // Fetch user data to check Google Calendar connection
  const { data: userData } = useQuery({
    queryKey: ['user-data', user?.id],
    queryFn: () => db.getUser(user!.id),
    enabled: !!user,
  });

  // Fetch booked calls from database
  const { data: calls, isLoading } = useQuery({
    queryKey: ['booked-calls', user?.id],
    queryFn: () => db.getCalls(user!.id, { outcome: 'booked' }),
    enabled: !!user,
    refetchInterval: 30000,
  });

  // Fetch Google Calendar events if connected
  useEffect(() => {
    if (userData && isGoogleCalendarConnected(userData)) {
      fetchGoogleEvents();
    }
  }, [userData]);

  const fetchGoogleEvents = async () => {
    if (!userData || !user) return;

    try {
      setLoadingGoogle(true);

      // Get valid access token (refreshes if needed)
      const accessToken = await getValidAccessToken(
        user.id,
        userData.google_calendar_token!,
        userData.google_calendar_token_expires_at!,
        userData.google_calendar_refresh_token!
      );

      // Fetch events for next 30 days
      const events = await fetchGoogleCalendarEvents(accessToken);
      setGoogleEvents(events);
    } catch (error) {
      console.error('Error fetching Google Calendar events:', error);
    } finally {
      setLoadingGoogle(false);
    }
  };

  // Transform calls to calendar events
  const internalEvents: CalendarEvent[] = calls?.map(call => ({
    id: call.id,
    title: call.service_requested || 'Detail Appointment',
    date: new Date(call.preferred_date || call.created_at),
    time: call.preferred_date ? extractTime(call.preferred_date) : undefined,
    customer: call.caller_name || 'Unknown',
    phone: call.phone_number,
    service: call.service_requested || 'Service not specified',
    vehicle: [call.vehicle_year, call.vehicle_make, call.vehicle_model]
      .filter(Boolean)
      .join(' ') || undefined,
    status: 'booked',
    notes: call.notes || undefined,
    source: 'internal' as const,
    callData: call
  })) || [];

  // Transform Google Calendar events
  const transformedGoogleEvents: CalendarEvent[] = googleEvents.map(gEvent => ({
    id: gEvent.id,
    title: gEvent.summary,
    date: new Date(gEvent.start.dateTime),
    time: new Date(gEvent.start.dateTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    customer: gEvent.attendees?.[0]?.displayName || gEvent.attendees?.[0]?.email || 'N/A',
    phone: 'N/A',
    service: gEvent.description || 'Calendar Event',
    status: 'booked',
    notes: gEvent.description,
    source: 'google' as const,
    googleEvent: gEvent
  }));

  // Combine all events
  const events: CalendarEvent[] = [...internalEvents, ...transformedGoogleEvents];

  // Calendar navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Calendar
            </h1>
            <p className="text-muted-foreground">
              {events.length} booked appointment{events.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-secondary rounded-lg p-1">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'month'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'week'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Controls */}
        {viewMode !== 'list' && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-lg font-semibold text-foreground min-w-[180px] text-center">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <Button variant="outline" size="sm" onClick={goToNextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="secondary" size="sm" onClick={goToToday}>
              Today
            </Button>
          </div>
        )}

        {/* Calendar Views */}
        {viewMode === 'month' && (
          <MonthView
            currentDate={currentDate}
            events={events}
            onEventClick={setSelectedEvent}
          />
        )}

        {viewMode === 'week' && (
          <WeekView
            currentDate={currentDate}
            events={events}
            onEventClick={setSelectedEvent}
          />
        )}

        {viewMode === 'list' && (
          <ListView
            events={events}
            onEventClick={setSelectedEvent}
          />
        )}

        {/* Event Detail Modal */}
        {selectedEvent && (
          <EventDetailModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </div>
    </AppLayout>
  );
}

// Month View Component
function MonthView({ currentDate, events, onEventClick }: {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and days in month
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Build calendar grid
  const calendarDays: (number | null)[] = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Get events for a specific day
  const getEventsForDay = (day: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day &&
             eventDate.getMonth() === month &&
             eventDate.getFullYear() === year;
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() &&
           month === today.getMonth() &&
           year === today.getFullYear();
  };

  return (
    <Card variant="premium" className="overflow-hidden">
      {/* Day Headers */}
      <div className="grid grid-cols-7 bg-secondary/30">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground border-b border-border">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {
          const dayEvents = day ? getEventsForDay(day) : [];
          const today = day ? isToday(day) : false;

          return (
            <div
              key={index}
              className={`min-h-[100px] p-2 border-r border-b border-border ${
                day === null ? 'bg-secondary/10' : 'bg-background hover:bg-secondary/20 transition-colors'
              }`}
            >
              {day && (
                <>
                  <div className={`text-sm font-medium mb-2 ${
                    today ? 'text-primary font-bold' : 'text-foreground'
                  }`}>
                    {today && <span className="inline-block w-6 h-6 rounded-full bg-primary text-primary-foreground text-center leading-6 text-xs">{day}</span>}
                    {!today && day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <button
                        key={event.id}
                        onClick={() => onEventClick(event)}
                        className="w-full text-left p-1.5 rounded bg-primary/10 hover:bg-primary/20 transition-colors"
                      >
                        <p className="text-xs font-medium text-foreground truncate">
                          {event.time || 'TBD'} - {event.customer}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {event.service}
                        </p>
                      </button>
                    ))}
                    {dayEvents.length > 2 && (
                      <p className="text-xs text-muted-foreground px-1.5">
                        +{dayEvents.length - 2} more
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// Week View Component
function WeekView({ currentDate, events, onEventClick }: {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}) {
  // Get start of week (Sunday)
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day;
  });

  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  return (
    <Card variant="premium" className="overflow-hidden">
      <div className="grid grid-cols-7">
        {weekDays.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isToday = day.toDateString() === new Date().toDateString();

          return (
            <div key={index} className="border-r border-border last:border-r-0">
              <div className={`p-3 text-center border-b border-border ${
                isToday ? 'bg-primary/10' : 'bg-secondary/30'
              }`}>
                <p className="text-xs text-muted-foreground">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <p className={`text-lg font-semibold ${
                  isToday ? 'text-primary' : 'text-foreground'
                }`}>
                  {day.getDate()}
                </p>
              </div>
              <div className="p-2 space-y-2 min-h-[400px]">
                {dayEvents.map(event => (
                  <button
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className="w-full text-left p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    <p className="text-xs font-semibold text-foreground mb-1">
                      {event.time || 'TBD'}
                    </p>
                    <p className="text-xs text-foreground font-medium truncate">
                      {event.customer}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {event.service}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// List View Component
function ListView({ events, onEventClick }: {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}) {
  const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());

  if (sortedEvents.length === 0) {
    return (
      <Card variant="premium" className="p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="p-4 rounded-full bg-primary/10 text-primary w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <CalendarIcon className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No appointments yet
          </h3>
          <p className="text-muted-foreground">
            Booked appointments will appear here. Check the Calls page to see all your leads.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sortedEvents.map((event, index) => {
        const isUpcoming = event.date >= new Date();
        const isPast = event.date < new Date();

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              variant="premium"
              className={`p-4 cursor-pointer hover:shadow-md transition-all ${
                isPast ? 'opacity-60' : ''
              }`}
              onClick={() => onEventClick(event)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant={isUpcoming ? 'success' : 'secondary'}>
                      {isUpcoming ? 'Upcoming' : 'Past'}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {event.date.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                      {event.time && ` at ${event.time}`}
                    </p>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {event.service}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>{event.customer}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{event.phone}</span>
                    </div>
                    {event.vehicle && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Car className="w-4 h-4" />
                        <span>{event.vehicle}</span>
                      </div>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

// Event Detail Modal
function EventDetailModal({ event, onClose }: {
  event: CalendarEvent;
  onClose: () => void;
}) {
  const isGoogleEvent = event.source === 'google';

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
      >
        <Card variant="premium" className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {event.title}
                </h2>
                <Badge variant={isGoogleEvent ? 'default' : 'success'}>
                  {isGoogleEvent ? 'Google Calendar' : 'DetailPilot'}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {event.date.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
                {event.time && ` at ${event.time}`}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-4">
            {!isGoogleEvent && (
              <>
                <div className="p-4 rounded-xl bg-secondary/50">
                  <p className="text-sm text-muted-foreground mb-1">Customer</p>
                  <p className="font-medium text-foreground">{event.customer}</p>
                </div>

                <div className="p-4 rounded-xl bg-secondary/50">
                  <p className="text-sm text-muted-foreground mb-1">Phone</p>
                  <p className="font-medium text-foreground">{event.phone}</p>
                </div>

                {event.vehicle && (
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <p className="text-sm text-muted-foreground mb-1">Vehicle</p>
                    <p className="font-medium text-foreground">{event.vehicle}</p>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-secondary/50">
                  <p className="text-sm text-muted-foreground mb-1">Service</p>
                  <p className="font-medium text-foreground">{event.service}</p>
                </div>
              </>
            )}

            {isGoogleEvent && (
              <div className="p-4 rounded-xl bg-secondary/50">
                <p className="text-sm text-muted-foreground mb-1">Description</p>
                <p className="font-medium text-foreground">{event.service || 'No description'}</p>
              </div>
            )}

            {event.notes && (
              <div className="p-4 rounded-xl bg-secondary/50">
                <p className="text-sm text-muted-foreground mb-1">Notes</p>
                <p className="font-medium text-foreground">{event.notes}</p>
              </div>
            )}
          </div>

          {!isGoogleEvent && event.phone !== 'N/A' && (
            <div className="flex gap-3 mt-6">
              <Button
                variant="accent"
                className="flex-1"
                onClick={() => window.open(`tel:${event.phone}`, '_self')}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Customer
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => window.open(`sms:${event.phone}`, '_self')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Text
              </Button>
            </div>
          )}
        </Card>
      </motion.div>
    </>
  );
}

// Helper function
function extractTime(preferredDate: string): string | undefined {
  // Try to extract time from preferred date string
  const timeMatch = preferredDate.match(/(\d{1,2}:\d{2}\s*(?:am|pm)?|\d{1,2}\s*(?:am|pm))/i);
  return timeMatch ? timeMatch[0] : undefined;
}
