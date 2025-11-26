export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
}

export interface VideoItem {
  id: string;
  title: string;
  youtubeId: string;
  thumbnail: string;
  date: string;
}

export const breakingNews = [
  "ព័ត៌មានបន្ទាន់៖ ថាតិ នីង អង្គុយជួបសាជីវកម្ម នៅកម្ពុជា",
  "សេដ្ឋកិច្ចពិភពលោកឆ្នាំ ២០២៥ មានការរីកចម្រើនខ្លាំង",
  "ការប្រកួតបាល់ទាត់ពានរង្វាន់អាស៊ីអាគ្នេយ៍",
];

export const newsArticles: NewsArticle[] = [
  {
    id: "1",
    title: "ត្រៀម: ទិកជ័ងនឹងធ្វើយុទ្ធសាស្ត្រសេដ្ឋកិច្ច ដើម្បីស្ដារធានាត្វាយសុីសូ អាចទៅមុខជាន់បន្ត",
    description: "សាម៉ាត្រី AFP ថាម្បូរទិ ទីប៊ី ដឹងថ្មី ថ្លៃបទីធុ ចាន់ស្រ្គស្គ ក្រកម្មល្គុកមុរតើកញសារទេជាអ្ងកល្គកត្គោមខាអ្ន គ្គឃ្នស្រមុសអាលឹកដុធ្វើទេអាលកើតត្វាយចោសញុ៉កមុសទា",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800",
    date: "ថ្ងៃ 26 ធិញ្ញា 2025",
    category: "ជាតិ, ជំនួញ"
  },
  {
    id: "2",
    title: "សហព័ន្ធគ្នាខៀរត្វើដោះភូត៖ ដាក់ ទីង គង្គោតី ស្នានោល...",
    description: "បទស្គ្រីល្គខ្ញុញ បទគា និងគ្រសងស្គកកកលីទា មានអោក គុម...",
    image: "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800",
    date: "ថ្ងៃ 25 ធិញ្ញា 2025",
    category: "ជាតិ, ជំនួញ"
  },
  {
    id: "3",
    title: "នគូបធូកអត្គក្រូកជាអុកសាវិយាសាត្រានញាអក ធានិសទានញា សាក្រោនស់ ចុ ណាដាញ ចឃូចទានខឃនស្គោវទា",
    description: "គយើទញលីលម្មូរការទូកដទុនានូរបសអក លងធញកមក្រាដទុម...",
    image: "https://images.unsplash.com/photo-1494172961521-33799ddd43a5?w=800",
    date: "ថ្ងៃ 24 ធិញ្ញា 2025",
    category: "សេដ្ឋកិច្ច"
  },
  {
    id: "4",
    title: "តឿទូបោម្មទនាយ្ត្ដខន៉ះ នៅយាល្គ្រ ដសយាល្គ្រស្គូនាក្រាល អភ្នានាម គុវ",
    description: "ក្រឃោដក្រូល្គភម មានក់ នីងថ្ងគស្រូន្កូករលនវខាម មានក័ គុម...",
    image: "https://images.unsplash.com/photo-1560264280-88b68371db39?w=800",
    date: "ថ្ងៃ 23 ធិញ្ញា 2025",
    category: "ជាតិ"
  },
];

export const galleryImages = [
  { id: "1", uri: "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400" },
  { id: "2", uri: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400" },
  { id: "3", uri: "https://images.unsplash.com/photo-1494172961521-33799ddd43a5?w=400" },
  { id: "4", uri: "https://images.unsplash.com/photo-1560264280-88b68371db39?w=400" },
];

export const videos: VideoItem[] = [
  {
    id: "1",
    title: "សហរដ្ឋគ្នាជាញះតាយិរក៖ ដាទី ទិង អទូរាតី ស្នាដោល...",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800",
    date: "ថ្ងៃ 26 ធិញ្ញា 2025"
  },
  {
    id: "2",
    title: "សហរដ្ឋគ្នាជាញះតាយិរភូល៖ ដាទី ទិង អទូរាតី ស្នាដោល...",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800",
    date: "ថ្ងៃ 25 ធិញ្ញា 2025"
  },
  {
    id: "3",
    title: "អយ័ទា វី៉ឃិដក្រូញាកក្រូម UNESCO តាក្ករុកាក ញោលថាលក្រូញោ...",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800",
    date: "ថ្ងៃ 24 ធិញ្ញា 2025"
  },
];

export const adBanners = [
  { id: "ad1", image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800" },
  { id: "ad2", image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800" },
];
