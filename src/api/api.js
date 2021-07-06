const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
];
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

const gapi = window.gapi;

export const addEventToGoogleCalendar = (
  title,
  description,
  startDate,
  endDate
) => {
  gapi.load("client:auth2", () => {
    console.log("loaded client");

    gapi.client.init({
      apiKey: GOOGLE_API_KEY,
      clientId: GOOGLE_CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    });

    gapi.client.load("calendar", "v3", () => console.log("bam!"));

    gapi.auth2
      .getAuthInstance()
      .signIn()
      .then(() => {
        var event = {
          summary: title,
          description: description,
          start: {
            dateTime: startDate,
            timeZone: "Europe/Warsaw",
          },
          end: {
            dateTime: endDate,
            timeZone: "Europe/Warsaw",
          },
          recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
        };

        var request = gapi.client.calendar.events.insert({
          calendarId: "primary",
          resource: event,
        });

        request.execute((event) => {
          console.log(event);
          window.open(event.htmlLink);
        });
      });
  });
};
