const { MongoClient } = require("mongodb");
class MongoDB {

    static connect = async (uri) => {
        if (this.client){
            return this.client;
        }
            
        this.client = await MongoClient.connect(uri, {
            //Đảm bảo không gặp cảnh báo về kết nối
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        return this.client;
    }
}

module.exports = MongoDB;