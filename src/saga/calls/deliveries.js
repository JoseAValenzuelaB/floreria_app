import axios from "axios";
import { API_URL } from "../../utils/constants";

export function getUpcomingDeliveries() {
  return () =>
    axios({
      method: "get",
      url: `${API_URL}/api/deliveries/`,
      headers: {
        "Content-Type": "application/json",
      },
    });
}