const WordPressPoster = require('./index');

async function publishExample() {
  const poster = new WordPressPoster();
  
  try {
    await poster.init();
    
    console.log('\n=== 利用可能なカテゴリとタグを確認 ===');
    await poster.getAvailableCategories();
    await poster.getAvailableTags();
    
    console.log('\n=== 記事投稿の例 ===');
    
    const title = 'プログラミング学習のコツ';
    const content = `
      <h2>効率的なプログラミング学習方法</h2>
      <p>プログラミングを効率的に学習するためのコツを紹介します。</p>
      
      <h3>1. 基礎をしっかり固める</h3>
      <p>まずは基本的な構文や概念を理解することが重要です。</p>
      
      <h3>2. 実際にコードを書く</h3>
      <p>理論だけでなく、実際に手を動かしてコードを書きましょう。</p>
      
      <h3>3. 小さなプロジェクトから始める</h3>
      <p>最初は簡単なプロジェクトから始めて、徐々に難しいものに挑戦しましょう。</p>
      
      <h3>4. エラーを恐れない</h3>
      <p>エラーは学習の機会です。エラーメッセージを読んで理解しましょう。</p>
      
      <h3>5. コミュニティに参加する</h3>
      <p>同じ学習者と交流することで、モチベーションを維持できます。</p>
      
      <p><strong>投稿者:</strong> 自動投稿システム</p>
      <p><strong>投稿日時:</strong> ${new Date().toLocaleString('ja-JP')}</p>
    `;
    
    const options = {
      status: 'publish',
      excerpt: 'プログラミング学習を効率的に進めるための5つのコツを紹介します。',
      categories: [],
      tags: []
    };
    
    const result = await poster.publishPost(title, content, options);
    
    console.log('\n=== 投稿完了 ===');
    console.log(`記事ID: ${result.id}`);
    console.log(`記事URL: ${result.link}`);
    console.log(`投稿ステータス: ${result.status}`);
    
  } catch (error) {
    console.error('エラー:', error.message);
  }
}

publishExample();