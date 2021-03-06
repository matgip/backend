const axios = require("axios");

module.exports = class NewsExternalAPI {
  baseURL = "https://openapi.naver.com/v1/search/news.json";

  getUrl(keyword, size) {
    return `${this.baseURL}?query=${encodeURI(keyword)}&display=${size}&sort=sim`;
  }

  async get(newsEntity) {
    const { keyword, size } = newsEntity;
    const response = await axios({
      method: "GET",
      url: this.getUrl(keyword, size),
      headers: {
        "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
      },
    });
    return response.data;
  }
};
