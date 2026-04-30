export interface GlossaryItem {
  term: string;
  definition: string;
  simpleExplanation: string;
  example: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  distractorExplanations: string[];
}

export interface Block {
  id: number;
  title: string;
  theory: string;
  glossary: GlossaryItem[];
  questions: Question[];
}

export interface UserProgress {
  currentBlockId: number;
  completedBlocks: number[];
  quizScores: Record<number, number>;
  answers: Record<string, number>;
}
