const WordPressPoster = require('./index');
const GoogleSheetsClient = require('./google-sheets-client');

class SheetsWordPressIntegration {
  constructor() {
    this.wordpressPoster = new WordPressPoster();
    this.sheetsClient = new GoogleSheetsClient();
  }

  async init() {
    console.log('スプレッドシート連携システムを初期化中...');
    
    const wpConnected = await this.wordpressPoster.init();
    const sheetsConnected = await this.sheetsClient.testConnection();
    
    if (!wpConnected || !sheetsConnected) {
      throw new Error('接続に失敗しました');
    }
    
    console.log('初期化完了');
    return true;
  }

  async generateContentFromTitle(title) {
    const content = `
      <h2>${title}</h2>
      <p>「${title}」について詳しく解説します。</p>
      
      <h3>概要</h3>
      <p>このトピックの基本的な概要と重要なポイントを説明します。</p>
      
      <h3>詳細な内容</h3>
      <p>より詳細な情報と具体的な例を交えて解説します。</p>
      <ul>
        <li>ポイント1: 重要な要素について</li>
        <li>ポイント2: 実践的な活用方法</li>
        <li>ポイント3: 注意点と対策</li>
      </ul>
      
      <h3>まとめ</h3>
      <p>「${title}」についてまとめると、以下の点が重要です。</p>
      
      <p><strong>投稿者:</strong> 自動投稿システム</p>
      <p><strong>投稿日時:</strong> ${new Date().toLocaleString('ja-JP')}</p>
    `;
    
    return content;
  }

  async processSpreadsheetRows() {
    try {
      console.log('スプレッドシートからデータを取得中...');
      const rows = await this.sheetsClient.getRowsWithStatus();
      
      if (rows.length === 0) {
        console.log('処理対象の記事がありません');
        return { processed: 0, success: 0, errors: [] };
      }

      console.log(`${rows.length}件の記事を処理します`);
      
      let processed = 0;
      let success = 0;
      const errors = [];

      for (const row of rows) {
        try {
          console.log(`\n処理中: "${row.title}" (行${row.rowIndex})`);
          
          const content = await this.generateContentFromTitle(row.title);
          
          const postOptions = {
            status: 'publish',
            excerpt: `「${row.title}」について詳しく解説した記事です。`,
            categories: [],
            tags: []
          };

          const result = await this.wordpressPoster.publishPost(
            row.title,
            content,
            postOptions
          );

          await this.sheetsClient.updateStatus(
            row.rowIndex,
            row.statusColumnIndex,
            '完了'
          );

          console.log(`✅ 成功: ${result.link}`);
          success++;
          
          await this.delay(2000);
          
        } catch (error) {
          console.error(`❌ エラー (行${row.rowIndex}):`, error.message);
          errors.push({ row: row.rowIndex, title: row.title, error: error.message });
          
          try {
            await this.sheetsClient.updateStatus(
              row.rowIndex,
              row.statusColumnIndex,
              'エラー'
            );
          } catch (updateError) {
            console.error('ステータス更新エラー:', updateError.message);
          }
        }
        
        processed++;
      }

      return { processed, success, errors };
    } catch (error) {
      console.error('処理エラー:', error.message);
      throw error;
    }
  }

  async processSingleRow(title) {
    try {
      console.log(`単一記事を処理: "${title}"`);
      
      const content = await this.generateContentFromTitle(title);
      
      const postOptions = {
        status: 'publish',
        excerpt: `「${title}」について詳しく解説した記事です。`,
        categories: [],
        tags: []
      };

      const result = await this.wordpressPoster.publishPost(
        title,
        content,
        postOptions
      );

      console.log(`✅ 投稿完了: ${result.link}`);
      return result;
    } catch (error) {
      console.error(`❌ 投稿エラー:`, error.message);
      throw error;
    }
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async showSpreadsheetPreview() {
    try {
      console.log('\n=== スプレッドシート内容プレビュー ===');
      const rows = await this.sheetsClient.getRowsWithStatus();
      
      if (rows.length === 0) {
        console.log('処理対象のデータがありません');
        return;
      }

      console.log(`処理対象: ${rows.length}件`);
      rows.forEach((row, index) => {
        console.log(`${index + 1}. "${row.title}" (行${row.rowIndex}) - ステータス: ${row.status || '未設定'}`);
      });
    } catch (error) {
      console.error('プレビューエラー:', error.message);
    }
  }
}

async function main() {
  try {
    const integration = new SheetsWordPressIntegration();
    await integration.init();
    
    await integration.showSpreadsheetPreview();
    
    console.log('\n=== バッチ処理開始 ===');
    const result = await integration.processSpreadsheetRows();
    
    console.log('\n=== 処理結果 ===');
    console.log(`処理件数: ${result.processed}`);
    console.log(`成功件数: ${result.success}`);
    console.log(`エラー件数: ${result.errors.length}`);
    
    if (result.errors.length > 0) {
      console.log('\n=== エラー詳細 ===');
      result.errors.forEach(err => {
        console.log(`行${err.row}: ${err.title} - ${err.error}`);
      });
    }
    
  } catch (error) {
    console.error('システムエラー:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = SheetsWordPressIntegration;