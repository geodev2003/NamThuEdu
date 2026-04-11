import { QuestionRendererProps } from '../../types/exam';
import { getActualTaskType } from '../../utils/examDataExtractor';
import {
  ListenAndDrawLines,
  ListenAndTick,
  LookAndRead,
  LookReadWrite,
  DefaultQuestion
} from './questions';

/**
 * Routes to the appropriate question component based on task type
 */
export function QuestionRenderer(props: QuestionRendererProps) {
  const taskType = getActualTaskType(props.question);

  switch (taskType) {
    case 'listen_and_draw_lines':
      return <ListenAndDrawLines {...props} />;
    
    case 'listen_and_tick':
      return <ListenAndTick {...props} />;
    
    case 'look_and_read':
      return <LookAndRead {...props} />;
    
    case 'look_read_write':
      return <LookReadWrite {...props} />;
    
    // TODO: Add more task types as components are created
    case 'listen_and_write':
    case 'listen_colour_write':
    case 'unscramble_words':
    case 'cloze_test':
    case 'word_bank_fill':
    case 'dialogue_matching':
    case 'word_definition_matching':
    case 'find_differences':
    case 'picture_story_narration':
    case 'odd_one_out':
    case 'information_exchange':
    case 'object_placement':
    case 'picture_questions':
    case 'picture_card_questions':
    case 'listening_letter_match':
    default:
      return <DefaultQuestion {...props} />;
  }
}
