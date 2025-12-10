// File: lib/events.ts

// 1. Export the interface so the component can use it later
export interface CalendarEvent {
  title: string;
  from: string | Date;
  to: string | Date;
  id: string; // NOTE: In your component you called this 'id', but in your sample data you wrote 'location'. I am using 'id' here to match your component logic.
}

// 2. Export the data array
export const sampleEvents: CalendarEvent[] = [
  {
    title: "CS Department Meeting",
    from: new Date(2025, 11, 1), 
    to: new Date(2025, 11, 10),   
    id: "Beach Garden", // Changed 'location' to 'id' to match your component logic
  },
  {
    title: "Basketball Practice",
    from: new Date(2025, 11, 5), 
    to: new Date(2025, 11, 5),   
    id: "Convention Center",       
  },
  {
    title: "Christmas Party",
    from: new Date(2025, 11, 14),
    to: new Date(2025, 11, 15),
    id: "Center for Continuing Education",
  },
];