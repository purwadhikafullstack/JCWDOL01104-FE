import axios from "axios";

const URL = "http://localhost:8000";

export const getRoomData = async (id: any) => {
  return await axios.get(`${URL}/api/roomList/${id}`);
};
