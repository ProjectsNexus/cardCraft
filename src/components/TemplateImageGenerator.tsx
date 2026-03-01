import React, { useEffect, useRef, useState } from 'react';
import { domToPng } from 'modern-screenshot';
import { useTemplateImages } from '../contexts/TemplateImageContext';

interface TemplateImageGeneratorProps {
  templateId: string;
  renderComponent: React.ReactNode;
  onImageGenerated?: (id: string, url: string) => void;
  width?: number;
  height?: number;
  aspectRatio?: string;
  showDownload?: boolean;
  className?: string;
}

/**
 * A component that renders a template off-screen and converts it to an image.
 */
export const TemplateImageGenerator: React.FC<TemplateImageGeneratorProps> = ({
  templateId,
  renderComponent,
  onImageGenerated,
  width = 400,
  height = 500,
  aspectRatio = "aspect-[4/5]",
  showDownload = true,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setTemplateImage, getTemplateImage } = useTemplateImages();
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(getTemplateImage(templateId) || null);

  useEffect(() => {
    const generateImage = async () => {
      if (!containerRef.current || generatedUrl) return;

      try {
        // Wait a bit for any internal animations or styles to settle
        await new Promise((resolve) => setTimeout(resolve, 800));

        const url = await domToPng(containerRef.current, {
          width,
          height,
          scale: 2,
        });

        setGeneratedUrl(url);
        setTemplateImage(templateId, url);
        if (onImageGenerated) {
          onImageGenerated(templateId, url);
        }
      } catch (error) {
        console.error(`Failed to generate image for template ${templateId}:`, error);
      }
    };

    generateImage();
  }, [templateId, width, height, setTemplateImage, generatedUrl]);

  return (
    <div className={`relative ${className}`}>
      {/* Hidden container for rendering */}
      <div 
        className="fixed -left-[9999px] -top-[9999px]"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
          {renderComponent}
        </div>
      </div>

      {/* Display the generated image */}
      <div className={`${aspectRatio} bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm relative group`}>
        {generatedUrl ? (
          <img 
            src={generatedUrl} 
            alt={`Template ${templateId}`} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Generating...</span>
          </div>
        )}
        
        {generatedUrl && showDownload && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <a 
              href={generatedUrl} 
              download={`template-${templateId}.png`}
              className="px-4 py-2 bg-white text-slate-900 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors"
            >
              Download
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
