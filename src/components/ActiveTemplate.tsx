import React from 'react';
import { CardData } from '../types';
import { CardTemplateModern } from './templates/CardTemplateModern';
import { CardTemplateMinimal } from './templates/CardTemplateMinimal';
import { CardTemplateProfessional } from './templates/CardTemplateProfessional';
import { CardTemplateCreative } from './templates/CardTemplateCreative';
import { CardTemplateDark } from './templates/CardTemplateDark';
import { CardTemplateBold } from './templates/CardTemplateBold';
import { CardTemplateElegant } from './templates/CardTemplateElegant';
import { CardTemplateBrutalist } from './templates/CardTemplateBrutalist';
import { CardTemplateGlass } from './templates/CardTemplateGlass';

export const ActiveTemplate = ({ data, shareId }: { data: CardData; shareId: string | null }) => {
  switch (data.template) {
    case 'modern': return <CardTemplateModern data={data} shareId={shareId} />;
    case 'minimal': return <CardTemplateMinimal data={data} shareId={shareId} />;
    case 'professional': return <CardTemplateProfessional data={data} shareId={shareId} />;
    case 'creative': return <CardTemplateCreative data={data} shareId={shareId} />;
    case 'dark': return <CardTemplateDark data={data} shareId={shareId} />;
    case 'bold': return <CardTemplateBold data={data} shareId={shareId} />;
    case 'elegant': return <CardTemplateElegant data={data} shareId={shareId} />;
    case 'brutalist': return <CardTemplateBrutalist data={data} shareId={shareId} />;
    case 'glass': return <CardTemplateGlass data={data} shareId={shareId} />;
    default: return <CardTemplateModern data={data} shareId={shareId} />;
  }
};
