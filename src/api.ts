export type ParableQuestion = {
    question: string;
    explanation: string;
    correctAnswer: string;
    options: string[];
}

export const fetchParableQuizQuestions = async (count: number) => {
    try {
        const url = `https://8539852b27d737c54d69d5a15610e246.balena-devices.com/trivia?count=${count+10}`;
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

