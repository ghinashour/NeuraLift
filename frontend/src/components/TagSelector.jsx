import React from 'react';
import '../styles/TagSelector.css';

const DEFAULT_TAGS = ['high', 'medium', 'low', 'urgent', 'personal', 'work'];

const TagSelector = ({ selectedTags = [], onChange, availableTags = DEFAULT_TAGS }) => {
    const toggleTag = (tag) => {
        if (!onChange) return;
        const isSelected = selectedTags.includes(tag);
        const next = isSelected ? selectedTags.filter(t => t !== tag) : [...selectedTags, tag];
        onChange(next);
    };

    return (
        <div className="tag-selector">
            {availableTags.map(tag => {
                const isActive = selectedTags.includes(tag);
                return (
                    <button
                        key={tag}
                        type="button"
                        className={`tag-option ${isActive ? 'active' : ''}`}
                        onClick={() => toggleTag(tag)}
                        aria-pressed={isActive}
                    >
                        {tag}
                    </button>
                );
            })}
        </div>
    );
};

export default TagSelector;