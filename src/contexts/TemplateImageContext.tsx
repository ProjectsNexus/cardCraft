import React, { createContext, useContext, useState, useCallback } from 'react';

interface TemplateImageContextType {
  templateImages: Record<string, string>;
  setTemplateImage: (id: string, url: string) => void;
  getTemplateImage: (id: string) => string | undefined;
}

const TemplateImageContext = createContext<TemplateImageContextType | undefined>(undefined);

export const TemplateImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [templateImages, setTemplateImages] = useState<Record<string, string>>({});

  const setTemplateImage = useCallback((id: string, url: string) => {
    setTemplateImages(prev => ({ ...prev, [id]: url }));
  }, []);

  const getTemplateImage = useCallback((id: string) => {
    return templateImages[id];
  }, [templateImages]);

  return (
    <TemplateImageContext.Provider value={{ templateImages, setTemplateImage, getTemplateImage }}>
      {children}
    </TemplateImageContext.Provider>
  );
};

export const useTemplateImages = () => {
  const context = useContext(TemplateImageContext);
  if (context === undefined) {
    throw new Error('useTemplateImages must be used within a TemplateImageProvider');
  }
  return context;
};
