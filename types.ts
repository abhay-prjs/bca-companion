// Global types

export enum SubjectId {
    MATHS = 'MATHS',
    PPA = 'PPA', // Programming Principle & Algorithm
    POM = 'POM', // Principles of Management
    BC = 'BC', // Business Communication
    CFOA = 'CFOA', // Computer Fundamental & Office Automation
}

export interface Unit {
    id: string;
    title: string;
    isCompleted: boolean;
}

export interface Subject {
    id: SubjectId;
    name: string;
    code?: string;
    icon: string;
    description: string;
    systemInstruction: string;
    units: Unit[]; // Syllabus units
    knowledgeBase?: string; // Pre-loaded OCR text
}

export interface Semester {
    id: number;
    name: string;
    status: 'active' | 'coming_soon';
    subjects: Subject[];
}

export interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: number;
    sources?: string[];
    isThinking?: boolean;
}

export interface Flashcard {
    front: string;
    back: string;
    topic: string;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
}

export enum AppMode {
    SEMESTER_SELECT = 'SEMESTER_SELECT',
    CHAT = 'CHAT',
    FLASHCARDS = 'FLASHCARDS',
    QUIZ = 'QUIZ',
}
