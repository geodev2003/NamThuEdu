import React from 'react';

/**
 * Text Formatting Utilities
 * 
 * Supports:
 * - **text** for bold
 * - <mark style="background-color: #color">text</mark> for highlights
 * 
 * Usage:
 * import { renderFormattedText } from '@/utils/textFormatUtils';
 * 
 * // In component:
 * <div>{renderFormattedText(text)}</div>
 */

/**
 * Process formatting tags in text and return React elements
 * @param text - Raw text with formatting tags
 * @returns Array of React elements with proper formatting
 */
export const renderFormattedText = (text: string): React.ReactNode[] => {
  const elements: React.ReactNode[] = [];
  let keyCounter = 0;

  // Combined regex for both bold and mark tags
  const combinedRegex = /(\*\*(.*?)\*\*)|(<mark style="background-color:\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})">(.*?)<\/mark>)/g;

  let lastIndex = 0;
  let match;

  while ((match = combinedRegex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      elements.push(<span key={`text-${keyCounter++}`}>{text.substring(lastIndex, match.index)}</span>);
    }

    if (match[1]) {
      // Bold match: **text**
      elements.push(<strong key={`bold-${keyCounter++}`}>{match[2]}</strong>);
    } else if (match[3]) {
      // Mark match: <mark style="background-color: #color">text</mark>
      elements.push(
        <mark 
          key={`mark-${keyCounter++}`} 
          style={{ backgroundColor: match[4] }}
        >
          {match[5]}
        </mark>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    elements.push(<span key={`text-${keyCounter++}`}>{text.substring(lastIndex)}</span>);
  }

  return elements.length > 0 ? elements : [text];
};

/**
 * Render formatted text with gaps (for word bank fill questions)
 * @param text - Raw text with formatting and gap placeholders (__1__, __2__, etc.)
 * @param gaps - Array of gap objects with gapNumber and isExample
 * @returns React element with formatted text and gap placeholders
 */
export const renderFormattedTextWithGaps = (
  text: string,
  gaps: Array<{ gapNumber: number; isExample?: boolean }>
): React.ReactNode => {
  // Split by gaps first
  const parts = text.split(/(__\d+__)/);
  
  return (
    <>
      {parts.map((part, index) => {
        // Check if this is a gap
        const gapMatch = part.match(/__(\d+)__/);
        if (gapMatch) {
          const gapNum = parseInt(gapMatch[1]);
          const gap = gaps.find(g => g.gapNumber === gapNum);
          return (
            <span
              key={`gap-${index}-${gapNum}`}
              className={`inline-block rounded-lg border-2 px-3 py-1 font-bold ${
                gap?.isExample
                  ? 'border-amber-400 bg-amber-100 text-amber-700'
                  : 'border-violet-300 bg-violet-100 text-violet-700'
              }`}
            >
              [{gapNum}]{gap?.isExample && ' 📌'}
            </span>
          );
        }
        
        // Process formatting in non-gap text - wrap the entire formatted result
        const formattedContent = renderFormattedText(part);
        return (
          <React.Fragment key={`text-${index}`}>
            {formattedContent}
          </React.Fragment>
        );
      })}
    </>
  );
};

/**
 * Strip all formatting tags from text (for plain text display)
 * @param text - Text with formatting tags
 * @returns Plain text without formatting
 */
export const stripFormatting = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/<mark style="background-color:\s*#[0-9a-fA-F]{3,6}">(.*?)<\/mark>/g, '$1'); // Remove marks
};

/**
 * Check if text contains any formatting
 * @param text - Text to check
 * @returns true if text has formatting tags
 */
export const hasFormatting = (text: string): boolean => {
  return /(\*\*.*?\*\*)|(<mark style="background-color:\s*#[0-9a-fA-F]{3,6}">.*?<\/mark>)/.test(text);
};

/**
 * Insert formatting at cursor position (for editor use)
 * @param text - Current text
 * @param start - Selection start position
 * @param end - Selection end position
 * @param prefix - Formatting prefix (e.g., "**" or "<mark...>")
 * @param suffix - Formatting suffix (e.g., "**" or "</mark>")
 * @param placeholder - Placeholder text if no selection
 * @returns Object with new text and cursor position
 */
export const insertFormatting = (
  text: string,
  start: number,
  end: number,
  prefix: string,
  suffix: string,
  placeholder: string
): { newText: string; cursorPos: number } => {
  const selectedText = text.substring(start, end);
  const textToInsert = selectedText || placeholder;
  
  const newText = 
    text.substring(0, start) + 
    prefix + textToInsert + suffix + 
    text.substring(end);
  
  const cursorPos = start + prefix.length + textToInsert.length;
  
  return { newText, cursorPos };
};
