export const appConfig = {
  // Set NEXT_PUBLIC_BETA=false in .env to hide the beta banner once the app is stable.
  beta: process.env.NEXT_PUBLIC_BETA !== "false",

  name: "Ascent",
  version: "1.0",
  bugReportUrl: "/bug-report",
  feedbackUrl: "/feedback",
}
