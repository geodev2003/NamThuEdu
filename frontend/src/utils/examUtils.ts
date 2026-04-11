/**
 * Utility functions for exam calculations
 */

/**
 * Calculate total points for a question, excluding example items
 * @param config - Question config containing items array
 * @param basePoints - Base points per item (default: 1)
 * @returns Total points for the question
 */
export const calculateQuestionPoints = (config: any, basePoints: number = 1): number => {
  if (!config || !config.items || !Array.isArray(config.items)) {
    return 0;
  }

  // Count only non-example items
  const scorableItems = config.items.filter((item: any) => !item.isExample);
  return scorableItems.length * basePoints;
};

/**
 * Calculate total exam points from all questions
 * @param questions - Array of questions
 * @returns Total points for the exam
 */
export const calculateExamTotalPoints = (questions: any[]): number => {
  if (!questions || !Array.isArray(questions)) {
    return 0;
  }

  return questions.reduce((total, question) => {
    // If question has items with isExample flag, calculate based on non-example items
    if (question.config?.items && Array.isArray(question.config.items)) {
      const scorableItems = question.config.items.filter((item: any) => !item.isExample);
      return total + (scorableItems.length * (question.points || 1));
    }
    
    // Otherwise use the question's points directly
    return total + (question.points || 0);
  }, 0);
};

/**
 * Get count of scorable items (excluding examples)
 * @param items - Array of items
 * @returns Count of non-example items
 */
export const getScorableItemsCount = (items: any[]): number => {
  if (!items || !Array.isArray(items)) {
    return 0;
  }
  
  return items.filter((item: any) => !item.isExample).length;
};

/**
 * Get count of example items
 * @param items - Array of items
 * @returns Count of example items
 */
export const getExampleItemsCount = (items: any[]): number => {
  if (!items || !Array.isArray(items)) {
    return 0;
  }
  
  return items.filter((item: any) => item.isExample).length;
};
