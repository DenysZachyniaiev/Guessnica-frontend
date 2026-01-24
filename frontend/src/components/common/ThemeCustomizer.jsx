import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ThemeCustomizer = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const [themes, setThemes] = useState({
        default: {
            name: 'Default',
            primary: '#3b82f6',
            background: '#f3f4f6',
            surface: '#ffffff',
            text: '#111827'
        },
        highContrast: {
            name: 'High Contrast',
            primary: '#000000',
            background: '#ffffff',
            surface: '#ffffff',
            text: '#000000'
        },
        darkMode: {
            name: 'Dark Mode',
            primary: '#60a5fa',
            background: '#1f2937',
            surface: '#374151',
            text: '#f9fafb'
        },
        protanopia: {
            name: 'Protanopia Friendly',
            primary: '#0ea5e9',
            background: '#f8fafc',
            surface: '#ffffff',
            text: '#0f172a'
        },
        deuteranopia: {
            name: 'Deuteranopia Friendly',
            primary: '#8b5cf6',
            background: '#fafaf9',
            surface: '#ffffff',
            text: '#18181b'
        },
        tritanopia: {
            name: 'Tritanopia Friendly',
            primary: '#10b981',
            background: '#f0fdf4',
            surface: '#ffffff',
            text: '#064e3b'
        }
    });

    const [selectedTheme, setSelectedTheme] = useState('default');
    const [customColors, setCustomColors] = useState({
        primary: '#3b82f6',
        background: '#f3f4f6',
        surface: '#ffffff',
        text: '#111827'
    });

    useEffect(() => {
        const savedTheme = localStorage.getItem('selectedTheme') || 'default';
        setSelectedTheme(savedTheme);
        
        if (savedTheme === 'custom') {
            const savedColors = localStorage.getItem('customColors');
            if (savedColors) {
                setCustomColors(JSON.parse(savedColors));
            }
        }
    }, []);

    const applyTheme = (themeName) => {
        const theme = themes[themeName];
        if (theme) {
            applyColors(theme.primary, theme.background, theme.surface, theme.text);
            setSelectedTheme(themeName);
            localStorage.setItem('selectedTheme', themeName);
        }
    };

    const applyCustomTheme = () => {
        applyColors(customColors.primary, customColors.background, customColors.surface, customColors.text);
        setSelectedTheme('custom');
        localStorage.setItem('selectedTheme', 'custom');
        localStorage.setItem('customColors', JSON.stringify(customColors));
    };

    const applyColors = (primary, background, surface, text) => {
        const root = document.documentElement;
        
        root.style.setProperty('--color-primary', primary);
        root.style.setProperty('--color-background', background);
        root.style.setProperty('--color-surface', surface);
        root.style.setProperty('--color-text', text);
        
        root.style.setProperty('--color-primary-light', adjustColor(primary, 20));
        root.style.setProperty('--color-primary-dark', adjustColor(primary, -20));
        root.style.setProperty('--color-text-secondary', adjustColor(text, 40));
        root.style.setProperty('--color-border', adjustColor(text, 80));
    };

    const adjustColor = (color, amount) => {
        const num = parseInt(color.replace('#', ''), 16);
        const r = Math.max(0, Math.min(255, (num >> 16) + amount));
        const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
        const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    };

    const handleColorChange = (colorType, value) => {
        setCustomColors(prev => ({
            ...prev,
            [colorType]: value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Theme Customization</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Accessibility Themes</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(themes).map(([key, theme]) => (
                            <button
                                key={key}
                                onClick={() => applyTheme(key)}
                                className={`p-4 rounded-lg border-2 transition-all ${
                                    selectedTheme === key
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                                }`}
                            >
                                <div className="flex items-center space-x-3 mb-2">
                                    <div
                                        className="w-6 h-6 rounded-full border-2 border-gray-300"
                                        style={{ backgroundColor: theme.primary }}
                                    />
                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {theme.name}
                                    </span>
                                </div>
                                <div className="flex space-x-1">
                                    <div
                                        className="w-4 h-4 rounded"
                                        style={{ backgroundColor: theme.background }}
                                        title="Background"
                                    />
                                    <div
                                        className="w-4 h-4 rounded"
                                        style={{ backgroundColor: theme.surface }}
                                        title="Surface"
                                    />
                                    <div
                                        className="w-4 h-4 rounded"
                                        style={{ backgroundColor: theme.text }}
                                        title="Text"
                                    />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Custom Theme</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Primary Color
                            </label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="color"
                                    value={customColors.primary}
                                    onChange={(e) => handleColorChange('primary', e.target.value)}
                                    className="h-10 w-20"
                                />
                                <input
                                    type="text"
                                    value={customColors.primary}
                                    onChange={(e) => handleColorChange('primary', e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Background Color
                            </label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="color"
                                    value={customColors.background}
                                    onChange={(e) => handleColorChange('background', e.target.value)}
                                    className="h-10 w-20"
                                />
                                <input
                                    type="text"
                                    value={customColors.background}
                                    onChange={(e) => handleColorChange('background', e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Surface Color
                            </label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="color"
                                    value={customColors.surface}
                                    onChange={(e) => handleColorChange('surface', e.target.value)}
                                    className="h-10 w-20"
                                />
                                <input
                                    type="text"
                                    value={customColors.surface}
                                    onChange={(e) => handleColorChange('surface', e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Text Color
                            </label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="color"
                                    value={customColors.text}
                                    onChange={(e) => handleColorChange('text', e.target.value)}
                                    className="h-10 w-20"
                                />
                                <input
                                    type="text"
                                    value={customColors.text}
                                    onChange={(e) => handleColorChange('text', e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={applyCustomTheme}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                        >
                            Apply Custom Theme
                        </button>
                    </div>
                </div>

                <div className="mt-8 p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600" style={{ backgroundColor: customColors.background }}>
                    <h4 className="font-bold mb-2" style={{ color: customColors.text }}>Preview</h4>
                    <div className="p-3 rounded" style={{ backgroundColor: customColors.surface }}>
                        <p style={{ color: customColors.text }}>This is how your theme will look.</p>
                        <button
                            className="mt-2 px-4 py-2 rounded text-white"
                            style={{ backgroundColor: customColors.primary }}
                        >
                            Sample Button
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThemeCustomizer;
