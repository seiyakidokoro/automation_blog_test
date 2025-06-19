const WordPressPoster = require('./index');

async function createTestPost() {
  try {
    const poster = new WordPressPoster();
    await poster.init();
    
    const titles = [
      'プログラミング初心者のための学習ロードマップ',
      'JavaScriptの非同期処理を理解しよう',
      'Webデザインの基本原則とトレンド',
      'データベース設計のベストプラクティス',
      'セキュリティを考慮したWeb開発'
    ];
    
    const title = titles[Math.floor(Math.random() * titles.length)];
    
    const content = `
      <h2>${title}</h2>
      <p>この記事では「${title}」について詳しく解説します。</p>
      
      <h3>はじめに</h3>
      <p>現在のIT業界において、この分野の知識は非常に重要です。基礎から応用まで幅広く学習することで、より良いエンジニアになることができます。</p>
      
      <h3>基本的な概念</h3>
      <p>まず基本的な概念を理解することが重要です。以下のポイントを押さえておきましょう。</p>
      <ul>
        <li>基礎知識の習得</li>
        <li>実践的なスキルの向上</li>
        <li>最新の技術動向の把握</li>
        <li>継続的な学習の重要性</li>
      </ul>
      
      <h3>実践的なアプローチ</h3>
      <p>理論だけでなく、実際に手を動かして学習することが重要です。</p>
      <ol>
        <li>基本的なコードを書いてみる</li>
        <li>小さなプロジェクトを作成する</li>
        <li>エラーを分析し解決する</li>
        <li>コードレビューを受ける</li>
      </ol>
      
      <h3>注意点と課題</h3>
      <p>学習過程で注意すべき点がいくつかあります：</p>
      <blockquote>
        <p>「完璧を求めすぎず、まずは動くものを作ることが大切です。」</p>
      </blockquote>
      
      <h3>まとめ</h3>
      <p>「${title}」について説明しました。継続的な学習と実践を通じて、スキルアップを目指しましょう。</p>
      
      <hr>
      <p><strong>投稿者:</strong> 自動投稿システム</p>
      <p><strong>投稿日時:</strong> ${new Date().toLocaleString('ja-JP')}</p>
      <p><strong>カテゴリ:</strong> プログラミング, 技術</p>
    `;
    
    const options = {
      status: 'publish',
      excerpt: `「${title}」について詳しく解説した記事です。基礎から実践まで幅広くカバーしています。`,
      categories: [],
      tags: []
    };
    
    console.log(`記事を作成中: "${title}"`);
    const result = await poster.publishPost(title, content, options);
    
    console.log('\n=== 投稿完了 ===');
    console.log(`記事ID: ${result.id}`);
    console.log(`記事URL: ${result.link}`);
    console.log(`投稿ステータス: ${result.status}`);
    
    return result;
    
  } catch (error) {
    console.error('エラー:', error.message);
    throw error;
  }
}

createTestPost();