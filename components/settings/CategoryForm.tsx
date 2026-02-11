// Category Form Component - Add/Edit categories

'use client';

import React, { useState } from 'react';
import { CustomCategory, TransactionType } from '@/lib/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const EMOJI_OPTIONS = ['🍔', '🚗', '🎬', '📄', '🛍️', '⚕️', '📚', '📦', '🏠', '✈️', '🎮', '💼', '🎨', '⚽', '🐾', '💰'];
const COLOR_OPTIONS = [
    'hsl(25, 85%, 55%)',   // Orange
    'hsl(200, 85%, 55%)',  // Blue
    'hsl(280, 85%, 60%)',  // Purple
    'hsl(0, 70%, 55%)',    // Red
    'hsl(340, 85%, 60%)',  // Pink
    'hsl(140, 70%, 50%)',  // Green
    'hsl(45, 85%, 55%)',   // Yellow
    'hsl(180, 70%, 50%)',  // Cyan
    'hsl(30, 85%, 55%)',   // Brown
    'hsl(260, 70%, 60%)',  // Indigo
];

export interface CategoryFormProps {
    category?: CustomCategory;
    onSubmit: (category: Omit<CustomCategory, 'id'>) => void;
    onCancel: () => void;
}

export default function CategoryForm({ category, onSubmit, onCancel }: CategoryFormProps) {
    const [name, setName] = useState(category?.name || '');
    const [color, setColor] = useState(category?.color || COLOR_OPTIONS[0]);
    const [icon, setIcon] = useState(category?.icon || EMOJI_OPTIONS[0]);
    const [type, setType] = useState<TransactionType>(category?.type || 'expense');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Category name is required');
            return;
        }

        onSubmit({
            name: name.trim(),
            color,
            icon,
            isDefault: false,
            type,
        });
    };

    return (
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
                <div className="flex bg-base-200 p-1 rounded-lg gap-1 border border-base-300">
                    <button
                        type="button"
                        className={`
                            flex-1 py-2 rounded-md text-sm font-medium transition-all
                            ${type === 'expense'
                                ? 'bg-base-100 text-error shadow-sm font-bold'
                                : 'text-base-content/60 hover:bg-base-100/50 hover:text-base-content'
                            }
                        `}
                        onClick={() => setType('expense')}
                    >
                        Expense
                    </button>
                    <button
                        type="button"
                        className={`
                            flex-1 py-2 rounded-md text-sm font-medium transition-all
                            ${type === 'income'
                                ? 'bg-base-100 text-success shadow-sm font-bold'
                                : 'text-base-content/60 hover:bg-base-100/50 hover:text-base-content'
                            }
                        `}
                        onClick={() => setType('income')}
                    >
                        Income
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="category-name" className="text-sm font-bold text-base-content">
                    Category Name
                </label>
                <Input
                    id="category-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setError('');
                    }}
                    placeholder="e.g., Pets, Gifts, Travel"
                    error={error}
                    data-testid="category-name-input"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-base-content">Icon</label>
                <div className="grid grid-cols-8 gap-2">
                    {EMOJI_OPTIONS.map((emoji) => (
                        <button
                            key={emoji}
                            type="button"
                            className={`
                                aspect-square flex items-center justify-center text-2xl rounded-xl transition-all
                                border-2 
                                ${icon === emoji
                                    ? 'border-primary bg-primary/10 scale-110 shadow-sm'
                                    : 'border-base-200 bg-base-100 hover:border-primary/50 hover:scale-105'
                                }
                            `}
                            onClick={() => setIcon(emoji)}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-base-content">Color</label>
                <div className="grid grid-cols-10 gap-2">
                    {COLOR_OPTIONS.map((colorOption) => (
                        <button
                            key={colorOption}
                            type="button"
                            className={`
                                aspect-square rounded-full cursor-pointer transition-all border-2
                                ${color === colorOption
                                    ? 'border-base-content scale-110 shadow-md ring-2 ring-base-100'
                                    : 'border-transparent hover:scale-110 hover:shadow-sm'
                                }
                            `}
                            style={{ backgroundColor: colorOption }}
                            onClick={() => setColor(colorOption)}
                            aria-label={`Select color ${colorOption}`}
                        />
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-base-200/50 rounded-xl border border-base-200 mt-2">
                <span className="text-sm font-medium text-base-content/60">Preview:</span>
                <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-white shadow-sm"
                    style={{ backgroundColor: color }}
                >
                    <span className="text-lg leading-none">{icon}</span>
                    <span className="font-bold text-sm">{name || 'Category Name'}</span>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-base-200">
                <Button type="button" variant="ghost" onClick={onCancel} data-testid="cancel-category-button">
                    Cancel
                </Button>
                <Button type="submit" variant="primary" data-testid="submit-category-button">
                    {category ? 'Update Category' : 'Add Category'}
                </Button>
            </div>
        </form>
    );
}
