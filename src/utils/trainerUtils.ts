import { Trainer, TrainerDocument } from '@/types/team/trainer';

export function formatTrainerName(trainer: Trainer): string {
  if (trainer.profile?.full_name) {
    return trainer.profile.full_name;
  }
  return 'Unnamed Trainer';
}

export function getTrainerInitials(trainer: Trainer): string {
  if (!trainer.profile?.full_name) return 'UT';
  
  return trainer.profile.full_name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function getDocumentIcon(document: TrainerDocument): string {
  const docType = document.document_type.toLowerCase();
  
  if (docType.includes('certif')) return 'mdi:certificate';
  if (docType.includes('id') || docType.includes('identification')) return 'mdi:card-account-details';
  if (docType.includes('resume') || docType.includes('cv')) return 'mdi:file-document';
  if (docType.includes('degree') || docType.includes('education')) return 'mdi:school';
  if (docType.includes('license')) return 'mdi:license';
  if (docType.includes('contract')) return 'mdi:file-sign';
  if (docType.includes('photo') || docType.includes('image')) return 'mdi:image';
  
  return 'mdi:file-document';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getTrainerSpecializations(trainer: Trainer): string {
  if (!trainer.specializations || trainer.specializations.length === 0) {
    return 'No specializations';
  }
  
  // Capitalize first letter of each specialization
  return trainer.specializations
    .map(spec => spec.charAt(0).toUpperCase() + spec.slice(1))
    .join(', ');
}

export function getTrainerRating(trainer: Trainer): { average: number; count: number } {
  return {
    average: trainer.rating_average || 0,
    count: trainer.rating_count || 0
  };
}

export function getTrainerStatus(trainer: Trainer): { text: string; color: string } {
  if (!trainer.is_active) {
    return { text: 'Inactive', color: 'error' };
  }
  
  // You can add more status logic here based on your requirements
  return { text: 'Active', color: 'success' };
}

export function getTrainerContactInfo(trainer: Trainer) {
  return {
    email: trainer.profile?.email || 'No email',
    phone: trainer.profile?.phone || 'No phone',
    emergencyContact: trainer.emergency_contact
      ? `${trainer.emergency_contact.name} (${trainer.emergency_contact.relation}): ${trainer.emergency_contact.phone}`
      : 'No emergency contact'
  };
}

export function formatTrainerSchedule(schedule: any[]) {
  if (!schedule || schedule.length === 0) {
    return 'No schedule available';
  }
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Group by day of week
  const scheduleByDay = schedule.reduce((acc, item) => {
    if (!acc[item.day_of_week]) {
      acc[item.day_of_week] = [];
    }
    acc[item.day_of_week].push(item);
    return acc;
  }, {} as Record<number, any[]>);
  
  // Format each day's schedule
  return Object.entries(scheduleByDay)
    .map(([day, slots]) => {
      const dayName = days[parseInt(day)];
      const timeSlots = slots
        .map(slot => `${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`)
        .join(', ');
      return `${dayName}: ${timeSlots}`;
    })
    .join('\n');
}

function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
}

export function getUpcomingSchedule(schedule: any[], daysAhead: number = 7): any[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + daysAhead);
  
  return schedule.filter(slot => {
    const slotDay = new Date(today);
    slotDay.setDate(today.getDate() + ((7 - today.getDay() + slot.day_of_week) % 7));
    
    return slotDay >= today && slotDay <= endDate;
  });
}
