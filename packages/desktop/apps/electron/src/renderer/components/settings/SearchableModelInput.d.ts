/**
 * SearchableModelInput
 *
 * Input field with a dropdown button that shows a searchable list of models.
 * Used for custom model name configuration in API settings.
 */
import * as React from 'react';
export interface ModelOption {
    id: string;
    name?: string;
}
export interface SearchableModelInputProps {
    /** Current value */
    value: string;
    /** Change handler */
    onChange: (value: string) => void;
    /** Blur handler (for saving) */
    onBlur?: () => void;
    /** Placeholder text */
    placeholder?: string;
    /** Available models to choose from */
    models: ModelOption[];
    /** Whether models are currently being fetched */
    isLoading?: boolean;
    /** Handler to fetch models (called when dropdown button is clicked) */
    onFetchModels?: () => void;
    /** Whether fetch button should be disabled */
    fetchDisabled?: boolean;
    /** Additional className */
    className?: string;
}
export declare function SearchableModelInput({ value, onChange, onBlur, placeholder, models, isLoading, onFetchModels, fetchDisabled, className, }: SearchableModelInputProps): React.JSX.Element;
