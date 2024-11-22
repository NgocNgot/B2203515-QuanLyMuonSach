import createApiClient from "./api.service";

class UserService {
  constructor(baseUrl = "/api/users") {
    this.api = createApiClient(baseUrl);
  }

  async findAll() {
    return (await this.api.get("/"));
  }

  async createUser(data) {
    return (await this.api.post("/create", data)).data;
  }

  async findOne(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async updateUser(id, data) {
    return (await this.api.put(`/update/${id}`, data)).data;
  }

  async delete(id) {
    return (await this.api.delete(`/delete/${id}`)).data;
  }

  async login(email, password) {
    return (await this.api.post("/login", { email, password })).data;
  }

  // Kiểm tra tài khoản với API qua this.api.post
  async checkAccount(email) {
    try {
      const response = await this.api.post("/checkAccount", { email });
      return response.data;  // Dữ liệu trả về từ API
    } catch (error) {
      console.error("Lỗi trong kiểm tra email:", error);
      return null;  // Trả về null nếu có lỗi
    }
  }
}

export default new UserService();
