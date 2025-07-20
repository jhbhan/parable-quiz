export type ParableQuestion = {
    question: string;
    explanation: string;
    correctAnswer: string;
    options: string[];
}

export const fetchParableQuizQuestions = async (count: number) => {
    try {
        const url = `/api/trivia?count=${count+10}`;
        const response = await fetch(url);if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json() as ParableQuestion[];
        return data.splice(0, count);
    } catch (error) {
        console.error('Failed to fetch trivia questions:', error);
        throw error;
    }
}

