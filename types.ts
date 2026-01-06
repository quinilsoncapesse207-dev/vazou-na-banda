
export interface NewsPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  thumbnail: string;
  mediaType?: 'image' | 'video';
  views: string;
  date: string;
  author: string;
  isHot?: boolean;
}

export type Category = 'Famosos' | 'Reality' | 'Flagras' | 'Influencers' | 'Tudo';
