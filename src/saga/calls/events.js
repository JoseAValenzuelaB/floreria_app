import axios from "axios";
import { API_URL } from "../../utils/constants";

export function createEvent(body) {
  return () =>
    axios({
      method: "post",
      url: `${API_URL}/api/events/save/`,
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
    });
}

export function getEvents() {
  return () =>
    axios({
      method: "get",
      url: `${API_URL}/api/events`,
      headers: {
        "Content-Type": "application/json",
      },
    });
}

export function getEventByID(eventId, session) {
  return () =>
    axios({
      method: "get",
      url: `${API_URL}/api/events/${eventId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: session,
      },
    });
}

export function updateEvent(eventId, body) {
  return () =>
    axios({
      method: "put",
      url: `${API_URL}/api/events/${eventId}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
    });
}

export function deleteEvent(eventId, session) {
  return () =>
    axios({
      method: "delete",
      url: `${API_URL}/api/events/delete/${eventId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: session,
      },
    });
}
