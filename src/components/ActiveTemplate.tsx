import React from 'react';
import { CardData } from '../types';
import { CardTemplateModern } from './templates/CardTemplateModern';
import { CardTemplateMinimal } from './templates/CardTemplateMinimal';
import { CardTemplateProfessional } from './templates/CardTemplateProfessional';
import { CardTemplateCreative } from './templates/CardTemplateCreative';
import { CardTemplateDark } from './templates/CardTemplateDark';

export const ActiveTemplate = ({ data, shareId }: { data: CardData; shareId: string | null }) => {
  switch (data.template) {
    case 'modern': return <CardTemplateModern data={data} shareId={shareId} />;
    case 'minimal': return <CardTemplateMinimal data={data} shareId={shareId} />;
    case 'professional': return <CardTemplateProfessional data={data} shareId={shareId} />;
    case 'creative': return <CardTemplateCreative data={data} shareId={shareId} />;
    case 'dark': return <CardTemplateDark data={data} shareId={shareId} />;
    default: return <CardTemplateModern data={data} shareId={shareId} />;
  }
};
