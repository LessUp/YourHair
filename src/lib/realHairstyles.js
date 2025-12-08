/**
 * 真实发型资源库
 * 包含高质量的真实发型图片和元数据
 */

// 发型分类
export const HAIR_CATEGORIES = {
    SHORT: 'short',
    MEDIUM: 'medium',
    LONG: 'long',
    CURLY: 'curly',
    STRAIGHT: 'straight',
    WAVY: 'wavy',
    UPDO: 'updo',
    BANGS: 'bangs',
};

// 发色分类
export const HAIR_COLORS = {
    BLACK: 'black',
    BROWN: 'brown',
    BLONDE: 'blonde',
    RED: 'red',
    GRAY: 'gray',
    COLORFUL: 'colorful',
};

// 性别分类
export const GENDER = {
    FEMALE: 'female',
    MALE: 'male',
    UNISEX: 'unisex',
};

/**
 * 真实发型数据
 * 注意：这些是示例配置，实际使用时需要替换为真实的发型图片
 * 建议使用透明背景的PNG图片
 */
export const realHairstyles = [
    // ===== 女性短发 =====
    {
        id: 'real-short-bob-black',
        name: '经典黑色波波头',
        src: '/hairstyles/real/short-bob-black.png',
        thumbnail: '/hairstyles/real/thumbs/short-bob-black.jpg',
        category: [HAIR_CATEGORIES.SHORT],
        color: HAIR_COLORS.BLACK,
        gender: GENDER.FEMALE,
        tags: ['波波头', '短发', '黑色', '经典', '职业'],
        description: '经典的黑色波波头，适合职场和日常',
        popularity: 95,
        difficulty: 'easy',
    },
    {
        id: 'real-short-pixie-brown',
        name: '精灵短发',
        src: '/hairstyles/real/short-pixie-brown.png',
        thumbnail: '/hairstyles/real/thumbs/short-pixie-brown.jpg',
        category: [HAIR_CATEGORIES.SHORT],
        color: HAIR_COLORS.BROWN,
        gender: GENDER.FEMALE,
        tags: ['精灵', '短发', '棕色', '时尚', '清爽'],
        description: '清爽的精灵短发，展现个性魅力',
        popularity: 88,
        difficulty: 'medium',
    },
    {
        id: 'real-short-layered-blonde',
        name: '层次金色短发',
        src: '/hairstyles/real/short-layered-blonde.png',
        thumbnail: '/hairstyles/real/thumbs/short-layered-blonde.jpg',
        category: [HAIR_CATEGORIES.SHORT],
        color: HAIR_COLORS.BLONDE,
        gender: GENDER.FEMALE,
        tags: ['层次', '短发', '金色', '时尚', '蓬松'],
        description: '蓬松的层次感金色短发',
        popularity: 82,
        difficulty: 'medium',
    },

    // ===== 女性中长发 =====
    {
        id: 'real-medium-wavy-brown',
        name: '自然棕色波浪',
        src: '/hairstyles/real/medium-wavy-brown.png',
        thumbnail: '/hairstyles/real/thumbs/medium-wavy-brown.jpg',
        category: [HAIR_CATEGORIES.MEDIUM, HAIR_CATEGORIES.WAVY],
        color: HAIR_COLORS.BROWN,
        gender: GENDER.FEMALE,
        tags: ['波浪', '中长发', '棕色', '自然', '优雅'],
        description: '自然优雅的棕色波浪中长发',
        popularity: 92,
        difficulty: 'easy',
    },
    {
        id: 'real-medium-straight-black',
        name: '黑色直发',
        src: '/hairstyles/real/medium-straight-black.png',
        thumbnail: '/hairstyles/real/thumbs/medium-straight-black.jpg',
        category: [HAIR_CATEGORIES.MEDIUM, HAIR_CATEGORIES.STRAIGHT],
        color: HAIR_COLORS.BLACK,
        gender: GENDER.FEMALE,
        tags: ['直发', '中长发', '黑色', '清纯', '学生'],
        description: '清纯的黑色直发，适合学生和日常',
        popularity: 90,
        difficulty: 'easy',
    },
    {
        id: 'real-medium-bangs-brown',
        name: '空气刘海中长发',
        src: '/hairstyles/real/medium-bangs-brown.png',
        thumbnail: '/hairstyles/real/thumbs/medium-bangs-brown.jpg',
        category: [HAIR_CATEGORIES.MEDIUM, HAIR_CATEGORIES.BANGS],
        color: HAIR_COLORS.BROWN,
        gender: GENDER.FEMALE,
        tags: ['刘海', '中长发', '棕色', '可爱', '减龄'],
        description: '可爱的空气刘海中长发，减龄效果好',
        popularity: 94,
        difficulty: 'medium',
    },

    // ===== 女性长发 =====
    {
        id: 'real-long-straight-black',
        name: '黑长直',
        src: '/hairstyles/real/long-straight-black.png',
        thumbnail: '/hairstyles/real/thumbs/long-straight-black.jpg',
        category: [HAIR_CATEGORIES.LONG, HAIR_CATEGORIES.STRAIGHT],
        color: HAIR_COLORS.BLACK,
        gender: GENDER.FEMALE,
        tags: ['长发', '直发', '黑色', '女神', '经典'],
        description: '经典的黑长直，女神必备',
        popularity: 98,
        difficulty: 'easy',
    },
    {
        id: 'real-long-curly-brown',
        name: '大波浪卷发',
        src: '/hairstyles/real/long-curly-brown.png',
        thumbnail: '/hairstyles/real/thumbs/long-curly-brown.jpg',
        category: [HAIR_CATEGORIES.LONG, HAIR_CATEGORIES.CURLY],
        color: HAIR_COLORS.BROWN,
        gender: GENDER.FEMALE,
        tags: ['长发', '卷发', '棕色', '浪漫', '优雅'],
        description: '浪漫优雅的大波浪卷发',
        popularity: 91,
        difficulty: 'hard',
    },
    {
        id: 'real-long-wavy-blonde',
        name: '金色波浪长发',
        src: '/hairstyles/real/long-wavy-blonde.png',
        thumbnail: '/hairstyles/real/thumbs/long-wavy-blonde.jpg',
        category: [HAIR_CATEGORIES.LONG, HAIR_CATEGORIES.WAVY],
        color: HAIR_COLORS.BLONDE,
        gender: GENDER.FEMALE,
        tags: ['长发', '波浪', '金色', '欧美', '时尚'],
        description: '时尚的金色波浪长发',
        popularity: 85,
        difficulty: 'medium',
    },
    {
        id: 'real-long-ombre-brown',
        name: '渐变色长发',
        src: '/hairstyles/real/long-ombre-brown.png',
        thumbnail: '/hairstyles/real/thumbs/long-ombre-brown.jpg',
        category: [HAIR_CATEGORIES.LONG],
        color: HAIR_COLORS.BROWN,
        gender: GENDER.FEMALE,
        tags: ['长发', '渐变', '棕色', '时尚', '个性'],
        description: '个性的渐变色长发',
        popularity: 87,
        difficulty: 'hard',
    },

    // ===== 女性盘发 =====
    {
        id: 'real-updo-elegant',
        name: '优雅盘发',
        src: '/hairstyles/real/updo-elegant.png',
        thumbnail: '/hairstyles/real/thumbs/updo-elegant.jpg',
        category: [HAIR_CATEGORIES.UPDO],
        color: HAIR_COLORS.BLACK,
        gender: GENDER.FEMALE,
        tags: ['盘发', '优雅', '黑色', '晚宴', '正式'],
        description: '优雅的晚宴盘发',
        popularity: 78,
        difficulty: 'hard',
    },
    {
        id: 'real-updo-messy-bun',
        name: '慵懒丸子头',
        src: '/hairstyles/real/updo-messy-bun.png',
        thumbnail: '/hairstyles/real/thumbs/updo-messy-bun.jpg',
        category: [HAIR_CATEGORIES.UPDO],
        color: HAIR_COLORS.BROWN,
        gender: GENDER.FEMALE,
        tags: ['丸子头', '慵懒', '棕色', '日常', '可爱'],
        description: '慵懒可爱的丸子头',
        popularity: 89,
        difficulty: 'easy',
    },

    // ===== 男性发型 =====
    {
        id: 'real-male-short-classic',
        name: '经典男士短发',
        src: '/hairstyles/real/male-short-classic.png',
        thumbnail: '/hairstyles/real/thumbs/male-short-classic.jpg',
        category: [HAIR_CATEGORIES.SHORT],
        color: HAIR_COLORS.BLACK,
        gender: GENDER.MALE,
        tags: ['男士', '短发', '黑色', '经典', '商务'],
        description: '经典的男士商务短发',
        popularity: 93,
        difficulty: 'easy',
    },
    {
        id: 'real-male-undercut',
        name: '侧削渐变',
        src: '/hairstyles/real/male-undercut.png',
        thumbnail: '/hairstyles/real/thumbs/male-undercut.jpg',
        category: [HAIR_CATEGORIES.SHORT],
        color: HAIR_COLORS.BLACK,
        gender: GENDER.MALE,
        tags: ['男士', '侧削', '黑色', '潮流', '个性'],
        description: '潮流的侧削渐变发型',
        popularity: 88,
        difficulty: 'medium',
    },
    {
        id: 'real-male-pompadour',
        name: '复古油头',
        src: '/hairstyles/real/male-pompadour.png',
        thumbnail: '/hairstyles/real/thumbs/male-pompadour.jpg',
        category: [HAIR_CATEGORIES.SHORT],
        color: HAIR_COLORS.BLACK,
        gender: GENDER.MALE,
        tags: ['男士', '油头', '黑色', '复古', '绅士'],
        description: '复古绅士的油头造型',
        popularity: 82,
        difficulty: 'medium',
    },
    {
        id: 'real-male-textured-crop',
        name: '纹理短发',
        src: '/hairstyles/real/male-textured-crop.png',
        thumbnail: '/hairstyles/real/thumbs/male-textured-crop.jpg',
        category: [HAIR_CATEGORIES.SHORT],
        color: HAIR_COLORS.BROWN,
        gender: GENDER.MALE,
        tags: ['男士', '纹理', '棕色', '自然', '休闲'],
        description: '自然休闲的纹理短发',
        popularity: 86,
        difficulty: 'easy',
    },
    {
        id: 'real-male-medium-wavy',
        name: '男士中长卷发',
        src: '/hairstyles/real/male-medium-wavy.png',
        thumbnail: '/hairstyles/real/thumbs/male-medium-wavy.jpg',
        category: [HAIR_CATEGORIES.MEDIUM, HAIR_CATEGORIES.WAVY],
        color: HAIR_COLORS.BROWN,
        gender: GENDER.MALE,
        tags: ['男士', '中长发', '棕色', '艺术', '个性'],
        description: '艺术气质的男士中长卷发',
        popularity: 75,
        difficulty: 'medium',
    },

    // ===== 个性发型 =====
    {
        id: 'real-colorful-rainbow',
        name: '彩虹渐变',
        src: '/hairstyles/real/colorful-rainbow.png',
        thumbnail: '/hairstyles/real/thumbs/colorful-rainbow.jpg',
        category: [HAIR_CATEGORIES.LONG],
        color: HAIR_COLORS.COLORFUL,
        gender: GENDER.UNISEX,
        tags: ['彩虹', '渐变', '彩色', '个性', '潮流'],
        description: '超个性的彩虹渐变发色',
        popularity: 70,
        difficulty: 'hard',
    },
    {
        id: 'real-colorful-pink',
        name: '粉色梦幻',
        src: '/hairstyles/real/colorful-pink.png',
        thumbnail: '/hairstyles/real/thumbs/colorful-pink.jpg',
        category: [HAIR_CATEGORIES.MEDIUM],
        color: HAIR_COLORS.COLORFUL,
        gender: GENDER.FEMALE,
        tags: ['粉色', '梦幻', '彩色', '可爱', '二次元'],
        description: '梦幻的粉色发型',
        popularity: 76,
        difficulty: 'hard',
    },
    {
        id: 'real-colorful-blue',
        name: '蓝色海洋',
        src: '/hairstyles/real/colorful-blue.png',
        thumbnail: '/hairstyles/real/thumbs/colorful-blue.jpg',
        category: [HAIR_CATEGORIES.SHORT],
        color: HAIR_COLORS.COLORFUL,
        gender: GENDER.UNISEX,
        tags: ['蓝色', '海洋', '彩色', '酷炫', '潮流'],
        description: '酷炫的蓝色发型',
        popularity: 72,
        difficulty: 'hard',
    },
];

/**
 * 获取所有发型
 */
export function getAllHairstyles() {
    return realHairstyles;
}

/**
 * 按分类筛选发型
 */
export function getHairstylesByCategory(category) {
    return realHairstyles.filter(h => h.category.includes(category));
}

/**
 * 按颜色筛选发型
 */
export function getHairstylesByColor(color) {
    return realHairstyles.filter(h => h.color === color);
}

/**
 * 按性别筛选发型
 */
export function getHairstylesByGender(gender) {
    return realHairstyles.filter(h => h.gender === gender || h.gender === GENDER.UNISEX);
}

/**
 * 搜索发型
 */
export function searchHairstyles(query) {
    const lowerQuery = query.toLowerCase();
    return realHairstyles.filter(h =>
        h.name.toLowerCase().includes(lowerQuery) ||
        h.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        h.description.toLowerCase().includes(lowerQuery)
    );
}

/**
 * 获取热门发型
 */
export function getPopularHairstyles(limit = 10) {
    return [...realHairstyles]
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, limit);
}

/**
 * 获取发型推荐
 * 基于用户特征推荐合适的发型
 */
export function getRecommendedHairstyles(userFeatures = {}) {
    const { faceShape, skinTone, gender, preferredLength, preferredStyle } = userFeatures;

    let filtered = [...realHairstyles];

    // 按性别筛选
    if (gender) {
        filtered = filtered.filter(h => h.gender === gender || h.gender === GENDER.UNISEX);
    }

    // 按长度筛选
    if (preferredLength) {
        filtered = filtered.filter(h => h.category.includes(preferredLength));
    }

    // 按风格筛选
    if (preferredStyle) {
        filtered = filtered.filter(h => h.category.includes(preferredStyle));
    }

    // 按热度排序
    return filtered.sort((a, b) => b.popularity - a.popularity);
}

// 备用图片映射（使用示例发型作为占位）
const fallbackImages = {
    'real-short-bob-black': '/hairstyles/bob-purple.svg',
    'real-short-pixie-brown': '/hairstyles/short-black.svg',
    'real-short-layered-blonde': '/hairstyles/short-blue.svg',
    'real-medium-wavy-brown': '/hairstyles/long-brown.svg',
    'real-medium-straight-black': '/hairstyles/long-brown.svg',
    'real-medium-bangs-brown': '/hairstyles/bob-purple.svg',
    'real-long-straight-black': '/hairstyles/long-brown.svg',
    'real-long-curly-brown': '/hairstyles/curly-red.svg',
    'real-long-wavy-blonde': '/hairstyles/long-blonde.svg',
    'real-long-ombre-brown': '/hairstyles/long-brown.svg',
    'real-updo-elegant': '/hairstyles/bob-purple.svg',
    'real-updo-messy-bun': '/hairstyles/bob-purple.svg',
    'real-male-short-classic': '/hairstyles/short-black.svg',
    'real-male-undercut': '/hairstyles/short-black.svg',
    'real-male-pompadour': '/hairstyles/spiky-silver.svg',
    'real-male-textured-crop': '/hairstyles/short-blue.svg',
    'real-male-medium-wavy': '/hairstyles/curly-red.svg',
    'real-colorful-rainbow': '/hairstyles/curly-red.svg',
    'real-colorful-pink': '/hairstyles/bob-purple.svg',
    'real-colorful-blue': '/hairstyles/short-blue.svg',
};

// 获取带备用图片的发型（用于真实发型图片不存在时）
export function getHairstylesWithFallback() {
    return realHairstyles.map(h => ({
        ...h,
        src: fallbackImages[h.id] || h.src,
        thumbnail: fallbackImages[h.id] || h.thumbnail,
    }));
}

// 导出默认发型列表（使用备用图片）
export const hairstyles = realHairstyles.map(h => ({
    id: h.id,
    name: h.name,
    src: fallbackImages[h.id] || h.src,
    category: h.category[0],
    tags: h.tags,
    description: h.description,
    popularity: h.popularity,
    gender: h.gender,
    color: h.color,
}));
