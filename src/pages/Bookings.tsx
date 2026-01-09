import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar,
  Clock,
  User,
  MapPin,
  Car,
  ChevronRight,
  Plus,
  Sparkles,
  TrendingUp
} from "lucide-react";

const bookings = [
  {
    id: 1,
    customer: "Mike Thompson",
    phone: "(305) 555-0123",
    service: "Full Detail",
    date: "Sat, Jan 11",
    time: "9:00 AM",
    vehicle: "Tesla Model 3",
    status: "confirmed",
    source: "recovered",
    value: "$180"
  },
  {
    id: 2,
    customer: "James Wilson",
    phone: "(305) 555-0321",
    service: "Ceramic Coating",
    date: "Tue, Jan 14",
    time: "10:00 AM",
    vehicle: "BMW M3",
    status: "confirmed",
    source: "recovered",
    value: "$450"
  },
  {
    id: 3,
    customer: "Lisa Martinez",
    phone: "(786) 555-0888",
    service: "Interior Detail",
    date: "Wed, Jan 15",
    time: "2:00 PM",
    vehicle: "Range Rover",
    status: "pending",
    source: "direct",
    value: "$120"
  },
  {
    id: 4,
    customer: "David Park",
    phone: "(954) 555-0222",
    service: "Exterior Detail",
    date: "Thu, Jan 16",
    time: "11:00 AM",
    vehicle: "Porsche 911",
    status: "confirmed",
    source: "recovered",
    value: "$150"
  },
  {
    id: 5,
    customer: "Sarah Chen",
    phone: "(954) 555-0789",
    service: "Ceramic Coating",
    date: "Fri, Jan 17",
    time: "9:00 AM",
    vehicle: "Mercedes S-Class",
    status: "pending",
    source: "recovered",
    value: "$500"
  },
];

const stats = [
  { label: "This Week", value: "5 bookings", subvalue: "$1,400 est." },
  { label: "Recovered", value: "4", subvalue: "80% from missed calls" },
];

export default function Bookings() {
  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Bookings
            </h1>
            <p className="text-muted-foreground">
              Appointments created through Answerly
            </p>
          </div>
          <Button variant="accent">
            <Plus className="w-4 h-4 mr-2" />
            Add Booking
          </Button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="stat">
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  {stat.subvalue}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bookings List */}
        <Card variant="premium" className="overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">Upcoming</h2>
          </div>
          <div className="divide-y divide-border">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 lg:p-6 hover:bg-secondary/30 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-foreground">{booking.customer}</h3>
                        {booking.source === "recovered" && (
                          <Badge variant="success" className="gap-1">
                            <Sparkles className="w-3 h-3" />
                            Recovered
                          </Badge>
                        )}
                        <Badge variant={booking.status === "confirmed" ? "default" : "warning"}>
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {booking.date} at {booking.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Car className="w-4 h-4" />
                          {booking.vehicle}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mt-1">
                        {booking.service} · <span className="text-success font-medium">{booking.value}</span>
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
