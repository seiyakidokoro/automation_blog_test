const WordPressClient = require('./wordpress-client');

class WordPressPoster {
  constructor() {
    this.client = new WordPressClient();
  }

  async init() {
    console.log('WordPress自動投稿システムを初期化中...');
    const connected = await this.client.testConnection();
    if (!connected) {
      throw new Error('WordPressに接続できませんでした');
    }
    console.log('初期化完了');
    return true;
  }

  async publishPost(title, content, options = {}) {
    try {
      const postData = {
        title: title,
        content: content,
        status: options.status || 'publish',
        categories: options.categories || [],
        tags: options.tags || [],
        excerpt: options.excerpt || '',
        featured_media: options.featuredMedia || null
      };

      console.log(`記事を投稿中: "${title}"`);
      const result = await this.client.createPost(postData);
      
      console.log(`投稿完了 - ID: ${result.id}, URL: ${result.link}`);
      return result;
    } catch (error) {
      console.error('投稿エラー:', error.message);
      throw error;
    }
  }

  async getAvailableCategories() {
    try {
      const categories = await this.client.getCategories();
      console.log('利用可能なカテゴリ:');
      categories.forEach(cat => {
        console.log(`- ${cat.name} (ID: ${cat.id})`);
      });
      return categories;
    } catch (error) {
      console.error('カテゴリ取得エラー:', error.message);
      return [];
    }
  }

  async getAvailableTags() {
    try {
      const tags = await this.client.getTags();
      console.log('利用可能なタグ:');
      tags.forEach(tag => {
        console.log(`- ${tag.name} (ID: ${tag.id})`);
      });
      return tags;
    } catch (error) {
      console.error('タグ取得エラー:', error.message);
      return [];
    }
  }
}

async function main() {
  try {
    const poster = new WordPressPoster();
    await poster.init();

    const sampleTitle = 'テスト投稿 - 自動投稿システム';
    const sampleContent = `
      <h2>WordPress自動投稿システムのテスト</h2>
      <p>これは自動投稿システムによるテスト投稿です。</p>
      <ul>
        <li>タイトル設定</li>
        <li>本文設定</li>
        <li>カテゴリ設定</li>
        <li>タグ設定</li>
      </ul>
      <p>投稿日時: ${new Date().toLocaleString('ja-JP')}</p>
    `;

    const options = {
      status: 'draft',
      excerpt: 'WordPress自動投稿システムのテスト記事です。'
    };

    const result = await poster.publishPost(sampleTitle, sampleContent, options);
    console.log('投稿結果:', result.id, result.link);

  } catch (error) {
    console.error('エラーが発生しました:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = WordPressPoster;