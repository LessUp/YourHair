/**
 * 发型数据配置
 * 
 * 如何添加新的发型：
 * 1. 将你的透明背景 PNG 图片放入 public/hairstyles/ 文件夹
 * 2. 在下方数组中添加一个新的对象：
 *    {
 *      id: 'my-new-style',
 *      name: '我的新发型',
 *      src: '/hairstyles/my-new-style.png', // 确保文件名匹配
 *    }
 */

export const hairstyles = [
  { 
    id: 'short-black', 
    name: '黑色波波头', 
    src: '/hairstyles/short-black.svg',
    category: 'short'
  },
  { 
    id: 'long-brown', 
    name: '棕色长卷发', 
    src: '/hairstyles/long-brown.svg',
    category: 'long'
  },
  { 
    id: 'spiky-silver', 
    name: '银色短碎发', 
    src: '/hairstyles/spiky-silver.svg',
    category: 'short'
  },
  { 
    id: 'afro-black', 
    name: '黑色爆炸头', 
    src: '/hairstyles/afro-black.svg',
    category: 'curly'
  },
  // 示例：当你有了真实 PNG 后，取消注释并修改文件名
  // { 
  //   id: 'real-wig-01', 
  //   name: '真实长发', 
  //   src: '/hairstyles/real-wig-01.png',
  //   category: 'long'
  // },
];
