export async function getEvents() {
  await new Promise((resolve) => setTimeout(resolve, 100));

  return [
    {
      title: "Team Sync Meeting",
      from: "2025-06-12T09:00:00",
      to: "2025-06-12T10:00:00",
    },
    {
      title: "Design Review",
      from: "2025-06-12T11:30:00",
      to: "2025-06-12T12:30:00",
    },
    {
      title: "Client Presentation",
      from: "2025-06-12T14:00:00",
      to: "2025-06-12T15:00:00",
    },
  ];
}