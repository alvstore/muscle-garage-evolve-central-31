
import { dashboardNavigation } from './dashboardNavigation';
import { membershipNavigation } from './membershipNavigation';
import { classesNavigation } from './classesNavigation';
import { staffNavigation } from './staffNavigation';
import { crmNavigation } from './crmNavigation';
import { marketingNavigation } from './marketingNavigation';
import { financeNavigation } from './financeNavigation';
import { settingsNavigation } from './settingsNavigation';
import { NavSection } from '@/types/navigation';

export const adminNavSections: NavSection[] = [
  dashboardNavigation,
  membershipNavigation,
  classesNavigation,
  staffNavigation,
  crmNavigation,
  marketingNavigation,
  financeNavigation,
  settingsNavigation,
];

export const staffNavSections: NavSection[] = adminNavSections
  .filter(section => section.name !== "Settings")
  .map(section => {
    if (section.name === "Communication") {
      return {
        ...section,
        items: section.items.filter(item => 
          item.href !== "/communication/reminder-rules" &&
          item.href !== "/communication/email" &&
          item.href !== "/communication/sms"
        )
      };
    }
    return section;
  });
