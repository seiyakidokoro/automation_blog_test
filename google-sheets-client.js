const { google } = require('googleapis');
require('dotenv').config();

class GoogleSheetsClient {
  constructor() {
    this.spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    this.serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    this.privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    if (!this.spreadsheetId || !this.serviceAccountEmail || !this.privateKey) {
      throw new Error('Google Sheets認証情報が設定されていません');
    }

    this.auth = new google.auth.JWT(
      this.serviceAccountEmail,
      null,
      this.privateKey,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  async testConnection() {
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });
      console.log('Google Sheets接続成功:', response.data.properties.title);
      return true;
    } catch (error) {
      console.error('Google Sheets接続失敗:', error.message);
      return false;
    }
  }

  async getRowsWithStatus(range = 'A:C', statusColumn = 'C') {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: range,
      });

      const rows = response.data.values || [];
      if (rows.length === 0) {
        console.log('データが見つかりません');
        return [];
      }

      const headers = rows[0];
      const titleColumnIndex = headers.findIndex(h => 
        h.toLowerCase().includes('title') || h.toLowerCase().includes('タイトル')
      );
      const statusColumnIndex = headers.findIndex(h => 
        h.toLowerCase().includes('status') || h.toLowerCase().includes('ステータス')
      );

      if (titleColumnIndex === -1) {
        throw new Error('タイトル列が見つかりません');
      }

      const dataRows = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const title = row[titleColumnIndex];
        const status = row[statusColumnIndex] || '';
        
        if (title && title.trim() && status !== '完了') {
          dataRows.push({
            rowIndex: i + 1,
            title: title.trim(),
            status: status,
            content: row[titleColumnIndex + 1] || '',
            statusColumnIndex: statusColumnIndex
          });
        }
      }

      return dataRows;
    } catch (error) {
      console.error('データ取得エラー:', error.message);
      throw error;
    }
  }

  async updateStatus(rowIndex, statusColumnIndex, status = '完了') {
    try {
      const columnLetter = this.getColumnLetter(statusColumnIndex);
      const range = `${columnLetter}${rowIndex}`;
      
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: range,
        valueInputOption: 'RAW',
        resource: {
          values: [[status]]
        }
      });

      console.log(`行${rowIndex}のステータスを「${status}」に更新しました`);
      return true;
    } catch (error) {
      console.error('ステータス更新エラー:', error.message);
      throw error;
    }
  }

  getColumnLetter(columnIndex) {
    let result = '';
    while (columnIndex >= 0) {
      result = String.fromCharCode(65 + (columnIndex % 26)) + result;
      columnIndex = Math.floor(columnIndex / 26) - 1;
    }
    return result;
  }

  async getAllData(range = 'A:Z') {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: range,
      });

      return response.data.values || [];
    } catch (error) {
      console.error('全データ取得エラー:', error.message);
      throw error;
    }
  }
}

module.exports = GoogleSheetsClient;