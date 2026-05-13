import { Icon } from '@iconify/react';
import type { ProjectStage, StageIcon as StageIconType } from '@/types';

const FALLBACK_ICON_ORDER: StageIconType[] = ['compass', 'blueprint', 'layers', 'camera', 'sparkles', 'flag'];

const STAGE_ICON_IDS: Record<StageIconType, string> = {
  compass: 'ph:compass',
  blueprint: 'ph:file-text',
  layers: 'ph:stack',
  camera: 'ph:camera',
  sparkles: 'ph:sparkle',
  flag: 'ph:flag',
};

export function resolveStageIcon(stage: ProjectStage, index: number): StageIconType {
  if (stage.icon) return stage.icon;
  if (stage.type === 'drawing') return 'blueprint';
  if (stage.type === 'final') return 'sparkles';
  return FALLBACK_ICON_ORDER[index % FALLBACK_ICON_ORDER.length];
}

export function StageIcon({ icon, className = 'w-5 h-5' }: { icon: StageIconType; className?: string }) {
  return <Icon icon={STAGE_ICON_IDS[icon]} className={className} aria-hidden />;
}
