const axios = require('axios');
require('dotenv').config();

class WordPressClient {
  constructor() {
    this.siteUrl = process.env.WORDPRESS_SITE_URL;
    this.username = process.env.WORDPRESS_USERNAME;
    this.appPassword = process.env.WORDPRESS_APP_PASSWORD;
    this.apiUrl = `${this.siteUrl}/wp-json/wp/v2`;
    
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(`${this.username}:${this.appPassword}`).toString('base64')}`
    };
  }

  async testConnection() {
    try {
      const response = await axios.get(`${this.apiUrl}/users/me`, {
        headers: this.headers
      });
      console.log('WordPress接続成功:', response.data.name);
      return true;
    } catch (error) {
      console.error('WordPress接続失敗:', error.response?.data || error.message);
      return false;
    }
  }

  async createPost(postData) {
    try {
      const response = await axios.post(`${this.apiUrl}/posts`, postData, {
        headers: this.headers
      });
      console.log('記事投稿成功:', response.data.id);
      return response.data;
    } catch (error) {
      console.error('記事投稿失敗:', error.response?.data || error.message);
      throw error;
    }
  }

  async getCategories() {
    try {
      const response = await axios.get(`${this.apiUrl}/categories`, {
        headers: this.headers
      });
      return response.data;
    } catch (error) {
      console.error('カテゴリ取得失敗:', error.response?.data || error.message);
      throw error;
    }
  }

  async getTags() {
    try {
      const response = await axios.get(`${this.apiUrl}/tags`, {
        headers: this.headers
      });
      return response.data;
    } catch (error) {
      console.error('タグ取得失敗:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = WordPressClient;