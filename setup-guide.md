# WordPress自動投稿システム セットアップガイド

## 概要
このシステムは、Google Sheetsのタイトル列から自動的にWordPress記事を作成し、完了時にステータスを更新するシステムです。

## 必要な設定

### 1. Google Sheets API設定

#### Google Cloud Console設定
1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成（または既存のプロジェクトを選択）
3. Google Sheets APIを有効化
4. サービスアカウントキーを作成
   - 「認証情報」→「認証情報を作成」→「サービスアカウント」
   - サービスアカウント名を入力
   - 「キー」タブで「鍵を追加」→「JSON」でキーファイルをダウンロード

#### スプレッドシート設定
1. 対象のスプレッドシートを開く
2. サービスアカウントのメールアドレスと共有（編集権限）
3. スプレッドシートのIDをコピー（URLの`/d/`以降`/edit`以前の部分）

#### スプレッドシート形式
```
A列: タイトル    B列: 内容（任意）    C列: ステータス
記事タイトル1    -                   
記事タイトル2    -                   完了
記事タイトル3    -                   
```

### 2. 環境変数設定

`.env`ファイルを編集：

```env
# WordPress設定
WORDPRESS_SITE_URL=https://wani-pro.com
WORDPRESS_USERNAME=wanino-programming
WORDPRESS_PASSWORD=mochotRiyipHEJAp
WORDPRESS_APP_PASSWORD=OPW6 1JXP xQSP pezc 6lIt H0O2

# Google Sheets設定
GOOGLE_SHEETS_ID=あなたのスプレッドシートID
GOOGLE_SERVICE_ACCOUNT_EMAIL=サービスアカウントのメールアドレス
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...プライベートキー...\n-----END PRIVATE KEY-----\n"
```

## 使用方法

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 基本的な使用方法

#### スプレッドシート連携実行
```bash
node sheets-wordpress-integration.js
```

#### 単体テスト
```bash
# WordPress接続テスト
node index.js

# スプレッドシート使用例
node example.js
```

### 3. システムの動作

1. **データ取得**: スプレッドシートからタイトル列を読み取り
2. **記事生成**: タイトルに基づいて記事本文を自動生成
3. **WordPress投稿**: 記事をWordPressに投稿
4. **ステータス更新**: 完了時にスプレッドシートのステータス列を「完了」に更新

## トラブルシューティング

### Google Sheets API認証エラー
- サービスアカウントキーが正しく設定されているかチェック
- スプレッドシートがサービスアカウントと共有されているかチェック
- プライベートキーの改行文字が正しく設定されているかチェック

### WordPress投稿エラー
- アプリケーションパスワードが正しいかチェック
- サイトURLが正しいかチェック
- ユーザーに投稿権限があるかチェック

## ファイル構成

- `index.js` - WordPress投稿システム
- `wordpress-client.js` - WordPress REST APIクライアント
- `google-sheets-client.js` - Google Sheets APIクライアント
- `sheets-wordpress-integration.js` - スプレッドシート連携システム
- `example.js` - 使用例
- `.env` - 環境変数設定ファイル
- `package.json` - パッケージ設定

## 注意事項

- `.env`ファイルは機密情報を含むため、Gitにコミットしないでください
- 大量の記事を一度に投稿する場合は、レート制限に注意してください
- スプレッドシートの列順序は固定されています（A列=タイトル、C列=ステータス）