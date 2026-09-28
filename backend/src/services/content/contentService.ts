import { ContentItem, Platform, ContentType, PerformanceCategory } from '../../types';
import { SEED_CONTENT } from '../../data/seedContent';

export interface ContentFilterOptions {
  search?: string;
  platform?: Platform | 'All';
  contentType?: ContentType | 'All';
  performanceCategory?: PerformanceCategory | 'All';
  sortBy?: 'publishedAt' | 'engagementScore' | 'views' | 'saves';
  sortOrder?: 'asc' | 'desc';
}

export class ContentService {
  private content: ContentItem[] = [];

  constructor() {
    this.content = JSON.parse(JSON.stringify(SEED_CONTENT));
  }

  getAll(options?: ContentFilterOptions): ContentItem[] {
    let result = [...this.content];

    if (options?.search) {
      const q = options.search.toLowerCase();
      result = result.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.topics.some(t => t.toLowerCase().includes(q))
      );
    }

    if (options?.platform && options.platform !== 'All') {
      result = result.filter(c => c.platform === options.platform);
    }

    if (options?.contentType && options.contentType !== 'All') {
      result = result.filter(c => c.contentType === options.contentType);
    }

    if (options?.performanceCategory && options.performanceCategory !== 'All') {
      result = result.filter(c => c.performanceCategory === options.performanceCategory);
    }

    const sortBy = options?.sortBy || 'publishedAt';
    const sortOrder = options?.sortOrder || 'desc';

    result.sort((a, b) => {
      let valA: any = a[sortBy];
      let valB: any = b[sortBy];

      if (sortBy === 'publishedAt') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }

  getById(id: string): ContentItem | undefined {
    return this.content.find(c => c.id === id);
  }

  create(item: Omit<ContentItem, 'id'>): ContentItem {
    const newItem: ContentItem = {
      ...item,
      id: `post-${Date.now()}`
    };
    this.content.unshift(newItem);
    return newItem;
  }

  getMetricsSummary() {
    const total = this.content.length;
    const avgScore = Math.round(
      this.content.reduce((sum, c) => sum + c.engagementScore, 0) / (total || 1)
    );
    const totalViews = this.content.reduce((sum, c) => sum + c.views, 0);
    const totalSaves = this.content.reduce((sum, c) => sum + c.saves, 0);

    return {
      total,
      avgScore,
      totalViews,
      totalSaves
    };
  }
}

export const contentService = new ContentService();
