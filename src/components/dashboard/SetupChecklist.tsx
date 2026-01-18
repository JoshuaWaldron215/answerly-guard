import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle2,
  Circle,
  Phone,
  Mic,
  Building2,
  PhoneCall,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import type { User, OnboardingSteps } from "@/lib/supabase";

interface SetupChecklistProps {
  user: User;
  onProvisionPhone: () => void;
  isProvisioning: boolean;
}

interface ChecklistItem {
  id: keyof OnboardingSteps;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action?: {
    label: string;
    onClick: () => void;
    loading?: boolean;
  };
  isCompleted: boolean;
}

export default function SetupChecklist({ user, onProvisionPhone, isProvisioning }: SetupChecklistProps) {
  const navigate = useNavigate();

  const steps = user.onboarding_steps || {
    phone_assigned: false,
    voice_selected: false,
    business_info_completed: false,
    test_call_completed: false,
  };

  // Calculate if business info is complete
  const hasBusinessInfo = !!(user.business_name && user.phone_number);

  const checklistItems: ChecklistItem[] = [
    {
      id: 'phone_assigned',
      title: 'Get Your AI Phone Number',
      description: 'Provision a dedicated phone number for your AI receptionist',
      icon: Phone,
      isCompleted: steps.phone_assigned || !!user.vapi_phone_number,
      action: steps.phone_assigned || user.vapi_phone_number
        ? undefined
        : {
            label: isProvisioning ? 'Setting up...' : 'Get Phone Number',
            onClick: onProvisionPhone,
            loading: isProvisioning,
          },
    },
    {
      id: 'voice_selected',
      title: 'Choose Your AI Voice',
      description: 'Select how your AI receptionist sounds on calls',
      icon: Mic,
      isCompleted: steps.voice_selected || !!user.vapi_voice,
      action: steps.voice_selected || user.vapi_voice
        ? undefined
        : {
            label: 'Select Voice',
            onClick: () => navigate('/settings'),
          },
    },
    {
      id: 'business_info_completed',
      title: 'Complete Business Profile',
      description: 'Add your business name and contact info',
      icon: Building2,
      isCompleted: steps.business_info_completed || hasBusinessInfo,
      action: hasBusinessInfo
        ? undefined
        : {
            label: 'Add Info',
            onClick: () => navigate('/settings'),
          },
    },
    {
      id: 'test_call_completed',
      title: 'Make a Test Call',
      description: 'Call your AI number to hear it in action',
      icon: PhoneCall,
      isCompleted: steps.test_call_completed,
      action: !steps.test_call_completed && (steps.phone_assigned || user.vapi_phone_number)
        ? {
            label: 'Call Now',
            onClick: () => {
              if (user.vapi_phone_number) {
                window.location.href = `tel:${user.vapi_phone_number}`;
              }
            },
          }
        : undefined,
    },
  ];

  const completedCount = checklistItems.filter(item => item.isCompleted).length;
  const progress = (completedCount / checklistItems.length) * 100;

  // If all steps are complete, don't show the checklist
  if (completedCount === checklistItems.length) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <Card variant="premium" className="overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Get Started with DetailPilot
                </h2>
                <p className="text-sm text-muted-foreground">
                  Complete these steps to start receiving calls
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{completedCount}/{checklistItems.length}</p>
              <p className="text-xs text-muted-foreground">completed</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Checklist Items */}
        <div className="divide-y divide-border">
          {checklistItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 flex items-center gap-4 ${
                item.isCompleted ? 'bg-green-500/5' : 'hover:bg-secondary/30'
              } transition-colors`}
            >
              {/* Status Icon */}
              <div className={`shrink-0 ${item.isCompleted ? 'text-green-600' : 'text-muted-foreground'}`}>
                {item.isCompleted ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </div>

              {/* Item Icon */}
              <div className={`p-2 rounded-lg shrink-0 ${
                item.isCompleted
                  ? 'bg-green-500/10 text-green-600'
                  : 'bg-secondary text-muted-foreground'
              }`}>
                <item.icon className="w-4 h-4" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${
                  item.isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'
                }`}>
                  {item.title}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {item.description}
                </p>
              </div>

              {/* Action Button */}
              {item.action && !item.isCompleted && (
                <Button
                  size="sm"
                  variant={index === 0 ? 'default' : 'outline'}
                  onClick={item.action.onClick}
                  disabled={item.action.loading}
                  className="shrink-0"
                >
                  {item.action.loading ? (
                    <span className="animate-pulse">{item.action.label}</span>
                  ) : (
                    <>
                      {item.action.label}
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </>
                  )}
                </Button>
              )}

              {/* Completed Badge */}
              {item.isCompleted && (
                <span className="text-xs text-green-600 font-medium shrink-0">
                  Done
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
