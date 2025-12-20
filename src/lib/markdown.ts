import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import matter from 'gray-matter';

export async function markdownToHtml(markdown: string) {
  // 预处理：将 [![](imageUrl)](linkUrl) 格式直接转换为 HTML <img> 标签
  // 因为 URL 中包含特殊字符（空格、中文、感叹号等），Markdown 解析器无法正确识别
  let processedMarkdown = markdown.replace(
    /\[!\[\]\((https?:\/\/[^)]+)\)\]\([^)]+\)/g,
    '<img src="$1" alt="" />'
  );

  // 讓 remark 自己處理 `---` 作為水平分隔線，不需要預處理替換
  // remark 會自動將 `---` 轉換為 <hr> 標籤，這樣可以確保後續內容正確解析

  const result = await remark()
    .use(remarkGfm) // GitHub Flavored Markdown（支援 `---` 作為水平分隔線）
    .use(remarkRehype, { allowDangerousHtml: true }) // 转换为 rehype (HTML AST)
    .use(rehypeRaw) // 允许在 Markdown 中使用原始 HTML（保留 <img> 等标签）
    .use(rehypeStringify, { allowDangerousHtml: true }) // 转换为 HTML 字符串
    .process(processedMarkdown);

  return result.toString();
}

export function parseMarkdownFile(fileContent: string): { data: any; content: string } {
  return matter(fileContent);
}

export function extractExcerpt(content: string, length: number = 150): string {
  // 移除 Markdown 語法
  const plainText = content
    .replace(/^#+\s+/gm, '') // 移除標題
    .replace(/!\[.*?\]\([^)]+\)/g, '') // 移除圖片
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除連結（保留文字）
    .replace(/\*\*([^*]+)\*\*/g, '$1') // 移除粗體
    .replace(/\*([^*]+)\*/g, '$1') // 移除斜體
    .replace(/`([^`]+)`/g, '$1') // 移除行內程式碼
    .replace(/```[\s\S]*?```/g, '') // 移除程式碼區塊
    .replace(/>\s+/g, '') // 移除引用
    .replace(/[-*+]\s+/g, '') // 移除列表符號
    .replace(/\n{2,}/g, ' ') // 將多個換行替換為空格
    .replace(/\s+/g, ' ') // 將多個空格替換為單個空格
    .trim();

  // 截取指定長度
  if (plainText.length <= length) {
    return plainText;
  }

  return plainText.substring(0, length).trim() + '...';
}

export function calculateReadTime(content: string): string {
  // 計算中文字數（假設每個中文字符為一個字）
  const chineseCharacters = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
  // 計算英文單詞數
  const englishWords = content
    .replace(/[\u4e00-\u9fa5]/g, '') // 移除中文字符
    .split(/\s+/)
    .filter(word => word.length > 0).length;
  
  // 總字數（中文字符 + 英文單詞）
  const totalWords = chineseCharacters + englishWords;
  
  // 假設閱讀速度：中文 300 字/分鐘，英文 200 詞/分鐘
  // 這裡簡化為平均 250 字/分鐘
  const readingTime = Math.ceil(totalWords / 250);
  
  return `${readingTime} 分鐘`;
}

export function formatDate(dateString: string): string {
  // 确保 dateString 是有效的日期字符串
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return dateString;
  }
  
  // 使用固定的格式，避免服务器和客户端不一致
  // 格式：YYYY年MM月DD日
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // 使用固定的月份名称映射
  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];
  
  return `${year}年${monthNames[month - 1]}${day}日`;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fa5-]/g, '') // 保留字母、數字、中文、連字符
    .replace(/\s+/g, '-') // 空格替換為連字符
    .replace(/-+/g, '-') // 多個連字符合併為一個
    .trim();
}

