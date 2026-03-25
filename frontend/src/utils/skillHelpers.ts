import { Headphones, Eye, PenTool, Mic } from 'lucide-react';

export const SKILL_COLORS = {
  listening: '#8B5CF6',
  reading: '#10B981',
  writing: '#F59E0B',
  speaking: '#2563EB',
} as const;

export const SKILL_NAMES = {
  listening: 'Nghe',
  reading: 'Đọc',
  writing: 'Viết',
  speaking: 'Nói',
} as const;

export const SKILL_ICONS = {
  listening: Headphones,
  reading: Eye,
  writing: PenTool,
  speaking: Mic,
} as const;

export function getSkillColor(skill: string): string {
  const normalizedSkill = skill.toLowerCase() as keyof typeof SKILL_COLORS;
  return SKILL_COLORS[normalizedSkill] || '#6B7280';
}

export function getSkillName(skill: string): string {
  const normalizedSkill = skill.toLowerCase() as keyof typeof SKILL_NAMES;
  return SKILL_NAMES[normalizedSkill] || skill;
}

export function getSkillIcon(skill: string) {
  const normalizedSkill = skill.toLowerCase() as keyof typeof SKILL_ICONS;
  return SKILL_ICONS[normalizedSkill] || Eye;
}
