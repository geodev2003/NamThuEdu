/**
 * Adaptive Components Demo
 * 
 * Demonstrates all adaptive components with different age group themes
 */

import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { AdaptiveButton } from './AdaptiveButton';
import { AdaptiveCard } from './AdaptiveCard';
import { AdaptiveIcon, AdaptiveIconButton } from './AdaptiveIcon';
import {
  AdaptiveHeading1,
  AdaptiveHeading2,
  AdaptiveHeading3,
  AdaptiveBody,
  AdaptiveCaption,
} from './AdaptiveTypography';
import { AdaptiveGrid, AdaptiveStack, AdaptiveContainer, AdaptiveSection } from './AdaptiveLayout';

export function AdaptiveComponentsDemo() {
  const { theme, colors } = useTheme();

  return (
    <AdaptiveContainer maxWidth="xl">
      <AdaptiveSection>
        <AdaptiveHeading1>Adaptive Components Demo</AdaptiveHeading1>
        <AdaptiveBody color={colors.textSecondary}>
          Theme: {theme.name} | Age Group: {theme.ageGroup}
        </AdaptiveBody>
      </AdaptiveSection>

      {/* Buttons */}
      <AdaptiveSection>
        <AdaptiveHeading2>Buttons</AdaptiveHeading2>
        <AdaptiveStack direction="horizontal" spacing="md">
          <AdaptiveButton variant="primary">Primary</AdaptiveButton>
          <AdaptiveButton variant="secondary">Secondary</AdaptiveButton>
          <AdaptiveButton variant="cta">Call to Action</AdaptiveButton>
          <AdaptiveButton variant="outline">Outline</AdaptiveButton>
          <AdaptiveButton variant="ghost">Ghost</AdaptiveButton>
        </AdaptiveStack>

        <AdaptiveStack direction="horizontal" spacing="md" style={{ marginTop: '16px' }}>
          <AdaptiveButton variant="primary" size="sm">
            Small
          </AdaptiveButton>
          <AdaptiveButton variant="primary" size="md">
            Medium
          </AdaptiveButton>
          <AdaptiveButton variant="primary" size="lg">
            Large
          </AdaptiveButton>
        </AdaptiveStack>
      </AdaptiveSection>

      {/* Cards */}
      <AdaptiveSection>
        <AdaptiveHeading2>Cards</AdaptiveHeading2>
        <AdaptiveGrid columns={3} gap="md">
          <AdaptiveCard variant="default" hoverable>
            <AdaptiveHeading3>Default Card</AdaptiveHeading3>
            <AdaptiveBody>This is a default card with hover effect.</AdaptiveBody>
          </AdaptiveCard>

          <AdaptiveCard variant="elevated" hoverable>
            <AdaptiveHeading3>Elevated Card</AdaptiveHeading3>
            <AdaptiveBody>This card has more shadow elevation.</AdaptiveBody>
          </AdaptiveCard>

          <AdaptiveCard variant="outlined" hoverable>
            <AdaptiveHeading3>Outlined Card</AdaptiveHeading3>
            <AdaptiveBody>This card has a border instead of shadow.</AdaptiveBody>
          </AdaptiveCard>
        </AdaptiveGrid>
      </AdaptiveSection>

      {/* Icons */}
      <AdaptiveSection>
        <AdaptiveHeading2>Icons</AdaptiveHeading2>
        <AdaptiveStack direction="horizontal" spacing="lg" align="center">
          <AdaptiveIcon size="xs" color={colors.primary}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </AdaptiveIcon>

          <AdaptiveIcon size="sm" color={colors.secondary}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
            </svg>
          </AdaptiveIcon>

          <AdaptiveIcon size="md" color={colors.cta}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </AdaptiveIcon>

          <AdaptiveIcon size="lg" color={colors.success}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </AdaptiveIcon>
        </AdaptiveStack>

        <AdaptiveStack direction="horizontal" spacing="md" style={{ marginTop: '16px' }}>
          <AdaptiveIconButton variant="default">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </AdaptiveIconButton>

          <AdaptiveIconButton variant="filled">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </AdaptiveIconButton>

          <AdaptiveIconButton variant="outlined">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
          </AdaptiveIconButton>
        </AdaptiveStack>
      </AdaptiveSection>

      {/* Typography */}
      <AdaptiveSection>
        <AdaptiveHeading2>Typography</AdaptiveHeading2>
        <AdaptiveStack spacing="md">
          <AdaptiveHeading1>Heading 1 - Main Title</AdaptiveHeading1>
          <AdaptiveHeading2>Heading 2 - Section Title</AdaptiveHeading2>
          <AdaptiveHeading3>Heading 3 - Subsection Title</AdaptiveHeading3>
          <AdaptiveBody>
            Body text - This is the main body text used for paragraphs and content. It adapts its
            size and line height based on the age group.
          </AdaptiveBody>
          <AdaptiveCaption>Caption text - Used for small notes and metadata</AdaptiveCaption>
        </AdaptiveStack>
      </AdaptiveSection>

      {/* Layout */}
      <AdaptiveSection>
        <AdaptiveHeading2>Layout Components</AdaptiveHeading2>

        <AdaptiveHeading3 style={{ marginTop: '16px' }}>Grid Layout</AdaptiveHeading3>
        <AdaptiveGrid gap="md">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <AdaptiveCard key={num} variant="flat">
              <AdaptiveBody>Grid Item {num}</AdaptiveBody>
            </AdaptiveCard>
          ))}
        </AdaptiveGrid>

        <AdaptiveHeading3 style={{ marginTop: '24px' }}>Stack Layout</AdaptiveHeading3>
        <AdaptiveStack spacing="sm">
          <AdaptiveCard variant="flat">
            <AdaptiveBody>Stack Item 1</AdaptiveBody>
          </AdaptiveCard>
          <AdaptiveCard variant="flat">
            <AdaptiveBody>Stack Item 2</AdaptiveBody>
          </AdaptiveCard>
          <AdaptiveCard variant="flat">
            <AdaptiveBody>Stack Item 3</AdaptiveBody>
          </AdaptiveCard>
        </AdaptiveStack>
      </AdaptiveSection>

      {/* Interactive Example */}
      <AdaptiveSection>
        <AdaptiveCard variant="elevated" padding="lg">
          <AdaptiveHeading2>Interactive Example</AdaptiveHeading2>
          <AdaptiveBody style={{ marginTop: '12px', marginBottom: '16px' }}>
            This card demonstrates how all adaptive components work together. Try switching between
            different age group themes to see how the components adapt!
          </AdaptiveBody>
          <AdaptiveStack direction="horizontal" spacing="md">
            <AdaptiveButton variant="primary" onClick={() => alert('Primary action!')}>
              Primary Action
            </AdaptiveButton>
            <AdaptiveButton variant="outline" onClick={() => alert('Secondary action!')}>
              Secondary Action
            </AdaptiveButton>
          </AdaptiveStack>
        </AdaptiveCard>
      </AdaptiveSection>
    </AdaptiveContainer>
  );
}
