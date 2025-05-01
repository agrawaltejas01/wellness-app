export const convert24HourTo12Hour = (timeStr: string): { formattedTime: string; error: string | null } => {
    // Handle empty input
    if (!timeStr || timeStr.trim() === '') {
      return { formattedTime: '', error: 'Please enter a time' };
    }
  
    // Validate input length
    if (timeStr.length < 3 || timeStr.length > 4) {
      return { formattedTime: '', error: `Invalid time format: ${timeStr}` };
    }
  
    let hourStr: string, minuteStr: string;
    
    // Parse hour and minute parts
    if (timeStr.length === 3) {
      hourStr = timeStr.substring(0, 1);
      minuteStr = timeStr.substring(1);
    } else { // length === 4
      hourStr = timeStr.substring(0, 2);
      minuteStr = timeStr.substring(2);
    }
    
    // Convert to numbers
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    
    // Validate hour and minute
    if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return { formattedTime: '', error: `Invalid time: ${hour}:${minute}` };
    }
    
    // Convert to 12-hour format
    const period = hour >= 12 ? 'PM' : 'AM';
    // Calculate 12-hour format hour
    let twelveHour = hour % 12;
    if (twelveHour === 0) {
      twelveHour = 12;
    }
    
    // Format the time as a string
    const formattedTime = `${twelveHour}:${minute.toString().padStart(2, '0')} ${period}`;
    return { formattedTime, error: null };
};