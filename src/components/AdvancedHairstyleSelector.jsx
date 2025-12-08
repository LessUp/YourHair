import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, Sparkles, ChevronDown } from 'lucide-react';
import {
    HAIR_CATEGORIES,
    HAIR_COLORS,
    GENDER,
    getHairstylesByCategory,
    getHairstylesByGender,
    searchHairstyles,
    getPopularHairstyles,
} from '../lib/realHairstyles';

export function AdvancedHairstyleSelector({
    hairstyles,
    selectedHairstyle,
    onSelect,
    showFilters = true,
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedGender, setSelectedGender] = useState('all');
    const [selectedColor, setSelectedColor] = useState('all');
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [sortBy, setSortBy] = useState('popularity');

    // 分类选项
    const categoryOptions = [
        { value: 'all', label: '全部' },
        { value: HAIR_CATEGORIES.SHORT, label: '短发' },
        { value: HAIR_CATEGORIES.MEDIUM, label: '中长发' },
        { value: HAIR_CATEGORIES.LONG, label: '长发' },
        { value: HAIR_CATEGORIES.CURLY, label: '卷发' },
        { value: HAIR_CATEGORIES.STRAIGHT, label: '直发' },
        { value: HAIR_CATEGORIES.WAVY, label: '波浪' },
        { value: HAIR_CATEGORIES.UPDO, label: '盘发' },
        { value: HAIR_CATEGORIES.BANGS, label: '刘海' },
    ];

    // 性别选项
    const genderOptions = [
        { value: 'all', label: '全部' },
        { value: GENDER.FEMALE, label: '女性' },
        { value: GENDER.MALE, label: '男性' },
    ];

    // 颜色选项
    const colorOptions = [
        { value: 'all', label: '全部颜色' },
        { value: HAIR_COLORS.BLACK, label: '黑色' },
        { value: HAIR_COLORS.BROWN, label: '棕色' },
        { value: HAIR_COLORS.BLONDE, label: '金色' },
        { value: HAIR_COLORS.RED, label: '红色' },
        { value: HAIR_COLORS.GRAY, label: '灰色' },
        { value: HAIR_COLORS.COLORFUL, label: '彩色' },
    ];

    // 筛选和排序发型
    const filteredHairstyles = useMemo(() => {
        let result = [...hairstyles];

        // 搜索筛选
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(h =>
                h.name?.toLowerCase().includes(query) ||
                h.tags?.some(tag => tag.toLowerCase().includes(query)) ||
                h.description?.toLowerCase().includes(query)
            );
        }

        // 分类筛选
        if (selectedCategory !== 'all') {
            result = result.filter(h =>
                h.category?.includes?.(selectedCategory) || h.category === selectedCategory
            );
        }

        // 性别筛选
        if (selectedGender !== 'all') {
            result = result.filter(h =>
                h.gender === selectedGender || h.gender === GENDER.UNISEX
            );
        }

        // 颜色筛选
        if (selectedColor !== 'all') {
            result = result.filter(h => h.color === selectedColor);
        }

        // 排序
        if (sortBy === 'popularity') {
            result.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        } else if (sortBy === 'name') {
            result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        }

        return result;
    }, [hairstyles, searchQuery, selectedCategory, selectedGender, selectedColor, sortBy]);

    // 按分类分组
    const groupedHairstyles = useMemo(() => {
        if (selectedCategory !== 'all') {
            return { [selectedCategory]: filteredHairstyles };
        }

        const groups = {};
        filteredHairstyles.forEach(h => {
            const category = Array.isArray(h.category) ? h.category[0] : (h.category || 'other');
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(h);
        });
        return groups;
    }, [filteredHairstyles, selectedCategory]);

    // 获取分类显示名称
    const getCategoryLabel = (category) => {
        const option = categoryOptions.find(o => o.value === category);
        return option?.label || '其他';
    };

    // 重置筛选
    const resetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSelectedGender('all');
        setSelectedColor('all');
    };

    const hasActiveFilters = searchQuery || selectedCategory !== 'all' ||
        selectedGender !== 'all' || selectedColor !== 'all';

    return (
        <div className="bg-zinc-900 text-white p-4 rounded-xl shadow-xl h-full flex flex-col">
            {/* 标题栏 */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                    <span className="w-1 h-6 bg-pink-500 rounded-full"></span>
                    发型库
                    <span className="text-xs text-zinc-500 font-normal">
                        ({filteredHairstyles.length})
                    </span>
                </h3>
                {showFilters && (
                    <button
                        onClick={() => setShowFilterPanel(!showFilterPanel)}
                        className={`p-2 rounded-lg transition-colors ${showFilterPanel || hasActiveFilters
                                ? 'bg-pink-500/20 text-pink-400'
                                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                            }`}
                    >
                        <Filter size={16} />
                    </button>
                )}
            </div>

            {/* 搜索框 */}
            <div className="relative mb-3">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                    type="text"
                    placeholder="搜索发型..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                />
            </div>

            {/* 筛选面板 */}
            {showFilters && showFilterPanel && (
                <div className="bg-zinc-800/50 rounded-lg p-3 mb-3 space-y-3">
                    {/* 分类筛选 */}
                    <div>
                        <label className="text-xs text-zinc-500 mb-1.5 block">发型类型</label>
                        <div className="flex flex-wrap gap-1.5">
                            {categoryOptions.slice(0, 5).map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => setSelectedCategory(option.value)}
                                    className={`px-2.5 py-1 text-xs rounded-full transition-colors ${selectedCategory === option.value
                                            ? 'bg-pink-500 text-white'
                                            : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 性别筛选 */}
                    <div>
                        <label className="text-xs text-zinc-500 mb-1.5 block">适合人群</label>
                        <div className="flex gap-1.5">
                            {genderOptions.map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => setSelectedGender(option.value)}
                                    className={`px-2.5 py-1 text-xs rounded-full transition-colors ${selectedGender === option.value
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 颜色筛选 */}
                    <div>
                        <label className="text-xs text-zinc-500 mb-1.5 block">发色</label>
                        <select
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                            className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                        >
                            {colorOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 重置按钮 */}
                    {hasActiveFilters && (
                        <button
                            onClick={resetFilters}
                            className="w-full text-xs text-pink-400 hover:text-pink-300 py-1"
                        >
                            重置筛选条件
                        </button>
                    )}
                </div>
            )}

            {/* 快速分类标签 */}
            {!showFilterPanel && (
                <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 scrollbar-hide">
                    {categoryOptions.slice(0, 6).map(option => (
                        <button
                            key={option.value}
                            onClick={() => setSelectedCategory(option.value)}
                            className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${selectedCategory === option.value
                                    ? 'bg-pink-500 text-white'
                                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}

            {/* 发型列表 */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                {Object.keys(groupedHairstyles).length === 0 ? (
                    <div className="text-center text-zinc-500 py-8">
                        <p className="text-sm">没有找到匹配的发型</p>
                        <button
                            onClick={resetFilters}
                            className="text-xs text-pink-400 hover:text-pink-300 mt-2"
                        >
                            清除筛选条件
                        </button>
                    </div>
                ) : (
                    Object.entries(groupedHairstyles).map(([category, styles]) => (
                        <div key={category} className="mb-6">
                            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 ml-1 flex items-center gap-2">
                                {getCategoryLabel(category)}
                                <span className="text-zinc-600">({styles.length})</span>
                            </h4>
                            <div className="grid grid-cols-3 gap-3">
                                {styles.map((style) => (
                                    <button
                                        key={style.id}
                                        onClick={() => onSelect(style)}
                                        className={`
                      group relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                      ${selectedHairstyle?.id === style.id
                                                ? 'border-pink-500 bg-zinc-800 ring-2 ring-pink-500/30'
                                                : 'border-transparent bg-zinc-800 hover:border-zinc-600'}
                    `}
                                    >
                                        {/* 发型图片 */}
                                        <div className="absolute inset-0 flex items-center justify-center p-2">
                                            <img
                                                src={style.thumbnail || style.src}
                                                alt={style.name}
                                                className="w-full h-full object-contain drop-shadow-lg transition-transform group-hover:scale-110"
                                                onError={(e) => {
                                                    e.target.src = style.src;
                                                }}
                                            />
                                        </div>

                                        {/* 热门标记 */}
                                        {style.popularity >= 90 && (
                                            <div className="absolute top-1 right-1 bg-yellow-500/90 rounded-full p-0.5">
                                                <Star size={10} className="text-white fill-white" />
                                            </div>
                                        )}

                                        {/* AI 推荐标记 */}
                                        {style.aiRecommended && (
                                            <div className="absolute top-1 left-1 bg-purple-500/90 rounded-full p-0.5">
                                                <Sparkles size={10} className="text-white" />
                                            </div>
                                        )}

                                        {/* 名称悬浮显示 */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-[10px] text-center text-white truncate">
                                                {style.name}
                                            </p>
                                        </div>

                                        {/* 选中指示器 */}
                                        {selectedHairstyle?.id === style.id && (
                                            <div className="absolute inset-0 bg-pink-500/10 flex items-center justify-center">
                                                <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* 底部提示 */}
            <div className="mt-3 pt-3 border-t border-zinc-800">
                <p className="text-[10px] text-zinc-500 text-center">
                    💡 点击发型预览效果，拖拽调整位置
                </p>
            </div>
        </div>
    );
}
