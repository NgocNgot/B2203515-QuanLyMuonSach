import createApiClient from "./api.service";

class BookService {
    constructor(baseURL = "/api/books") {
        this.api = createApiClient(baseURL);
    }

    async getAll() {
        return await this.api.get("/");
    }
    async search(query) {
        return await this.api.get(`/search?name=${query}`);
    }

    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }

    async create(data) {
        return (await this.api.post("/create", data)).data;
    }

    async update(id, data) {
        return (await this.api.put(`/update/${id}`, data)).data;
    }

    async delete(id) {
        return (await this.api.delete(`/delete/${id}`)).data;
    }
}

export default new BookService();
