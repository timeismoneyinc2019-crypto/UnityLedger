import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  CalendarDays, 
  CalendarRange, 
  Target, 
  Trophy, 
  AlertCircle 
} from "lucide-react";
import type { MeetingType, MeetingTypeInfo } from "@shared/schema";

const iconMap: Record<MeetingType, React.ElementType> = {
  daily: Calendar,
  weekly: CalendarDays,
  monthly: CalendarRange,
  quarterly: Target,
  annually: Trophy,
  oncall: AlertCircle,
};

interface MeetingTabsProps {
  types: MeetingTypeInfo[];
  activeType: MeetingType;
  onTypeChange: (type: MeetingType) => void;
  isLoading?: boolean;
}

export function MeetingTabs({ 
  types, 
  activeType, 
  onTypeChange,
  isLoading 
}: MeetingTabsProps) {
  return (
    <div 
      className="flex flex-wrap gap-2"
      data-testid="meeting-tabs"
    >
      {types.map((type) => {
        const Icon = iconMap[type.id];
        const isActive = activeType === type.id;
        
        return (
          <Button
            key={type.id}
            variant={isActive ? "default" : "secondary"}
            size="sm"
            onClick={() => onTypeChange(type.id)}
            disabled={isLoading}
            className={`
              gap-2 transition-all duration-200
              ${isActive ? "shadow-md" : ""}
            `}
            data-testid={`meeting-tab-${type.id}`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{type.label}</span>
            <span className="sm:hidden">{type.label.slice(0, 3)}</span>
          </Button>
        );
      })}
    </div>
  );
}
