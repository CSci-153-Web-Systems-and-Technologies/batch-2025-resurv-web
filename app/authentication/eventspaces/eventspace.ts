
export interface EventSpace {
  id: string;
  title: string;
  imageSrc: string;
  desc: string; 
}


export const EventSpaces: EventSpace[] = [
  {
    id: "cc",
    title: "Convention Center",
    imageSrc: "/Convention.jpg",
    desc: "A venue for large-scale events, such as conventions, conferences, weddings, and other type of events.",
  },
  {
    id: "cce",
    title: "Center for Continuing Education",
    imageSrc: "/CCE.jpg",
    desc: "Perfect for training, workshops, meetings, wedding receptions, and parties.",
  },
  {
    id: "bc",
    title: "Beach Garden",
    imageSrc: "/Beach_Resort.jpg",
    desc: "Nestled between the majesty of Mount Pangasugan and the calm Camotes Sea the VSU Beach Garden stands as a vibrant testament to the beauty of the Visayas State University At its heart lies a shimmering azure pool framed by swaying coconut palms and manicured gardens, offering a refreshing tropical sanctuary for students and visitors alike. The facility invites relaxation with its charming kiosks, floating cottages, and a scenic View Deck that overlooks the serene landscape. Whether basking in the sun or enjoying a swim under the stars until late evening, the Garden provides an accessible escape with affordable rates for everyone. It is truly a harmonious blend of nature and leisure, perfect for creating lasting memories in a breathtaking setting.",
  },

];