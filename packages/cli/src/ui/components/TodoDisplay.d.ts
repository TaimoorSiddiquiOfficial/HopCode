/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type React from 'react';
export interface TodoItem {
    id: string;
    content: string;
    status: 'pending' | 'in_progress' | 'completed';
}
interface TodoDisplayProps {
    todos: TodoItem[];
}
export declare const TodoDisplay: React.FC<TodoDisplayProps>;
export {};
