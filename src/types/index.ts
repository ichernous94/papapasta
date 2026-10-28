// ARTICLE
export type ContentItem = {
  _id: string;
  type: string;
  content: string | string[];
  attributes?: {
    alt?: string;
    link?: string;
    class?: string;
    imgPreview?: string;
  };
};

export interface IArticle {
  _id: string;
  category: string;
  subcategory?: string;
  slug?: string;
  content: ContentItem[];
  coverImg: {
    alt?: string;
    altLink?: string;
    base64: string;
    link: string;
  };
  publishDate: string; // change in Date
  images: [
    {
      base64: string;
      link: string;
    }
  ];
  metaDescription: string;
  metaTitle: string;
  title: string;
  shortDescription: string;
}
