import { redirect } from "next/navigation";

export default function OrganizerDefault() {
  // When organizer page loads → go to events list
  redirect("/organizer/events");
}
