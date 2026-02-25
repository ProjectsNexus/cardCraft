import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Share2, RefreshCcw, AlertCircle } from 'lucide-react';
import { CardData } from '../types';
import { ActiveTemplate } from '../components/ActiveTemplate';

export const CardViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetch(`/api/cards/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Card not found');
          return res.json();
        })
        .then(data => {
          setCardData(data);
          setError(null);
        })
        .catch(err => {
          console.error("Failed to load card:", err);
          setError(err.message);
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <RefreshCcw className="animate-spin text-indigo-600 mb-4" size={40} />
        <p className="text-slate-600 font-medium">Loading your digital card...</p>
      </div>
    );
  }

  if (error || !cardData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="text-red-600" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Oops! Card Not Found</h1>
        <p className="text-slate-600 mb-8 max-w-md">
          We couldn't find the digital card you're looking for. It might have been removed or the link is incorrect.
        </p>
        <Link 
          to="/" 
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
        >
          Create Your Own Card
        </Link>
      </div>
    );
  }

  // Meta description: "John Doe - Software Engineer at Tech Corp. Contact: +1234567890"
  const metaDescription = `${cardData.name} - ${cardData.title} at ${cardData.company}. Contact: ${cardData.phone}`;
  const cardUrl = `${window.location.origin}/view/${id}`;
  
  // Note: For real social sharing images, we would need a server-side route that generates an image.
  // For now, we'll use a placeholder or the logo if available.
  const metaImage = cardData.logo || 'https://picsum.photos/seed/cardcraft/1200/630';

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-0 sm:p-4 overflow-hidden">
      <Helmet>
        <title>{`${cardData.name} | Digital Visiting Card`}</title>
        <meta name="description" content={metaDescription} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={cardUrl} />
        <meta property="og:title" content={`${cardData.name} - Digital Visiting Card`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={metaImage} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={cardUrl} />
        <meta property="twitter:title" content={`${cardData.name} - Digital Visiting Card`} />
        <meta property="twitter:description" content={metaDescription} />
        <meta property="twitter:image" content={metaImage} />
      </Helmet>

      {/* Mobile-optimized view container */}
      <div className="w-full h-full sm:h-auto sm:max-w-[420px] sm:aspect-[4/6] bg-white sm:rounded-[2.5rem] shadow-2xl overflow-hidden relative">
        <div className="w-full h-full overflow-hidden">
          <ActiveTemplate data={cardData} shareId={id || null} />
        </div>
      </div>

      {/* Floating Action Menu (Desktop only) */}
      <div className="hidden sm:flex fixed bottom-8 right-8 flex-col gap-3">
        <Link 
          to="/" 
          className="p-4 bg-white text-slate-900 rounded-full shadow-xl hover:scale-110 transition-all group"
          title="Create Your Own"
        >
          <Share2 size={24} />
          <span className="absolute right-full mr-4 px-3 py-1 bg-slate-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Create Your Own
          </span>
        </Link>
      </div>
    </div>
  );
};
