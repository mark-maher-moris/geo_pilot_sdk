import * as React from 'react';
import { useState, useEffect } from 'react';
import { AutoBlogifyConfig } from '../types';

export interface ComparisonPageProps {
  config: AutoBlogifyConfig;
  slug: string;
  className?: string;
  style?: any;
  onConversion?: () => void;
}

export interface ComparisonPageData {
  id: string;
  title: string;
  slug: string;
  type: 'comparison' | 'alternative' | 'vs';
  status: 'draft' | 'published' | 'archived';
  
  hero: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaUrl: string;
    backgroundImage?: string;
  };
  
  overview: {
    title: string;
    description: string;
    keyPoints: string[];
  };
  
  comparison: {
    title: string;
    description: string;
    features: Array<{
      feature: string;
      ourProject: string | boolean;
      competitor: string | boolean;
      advantage: 'ours' | 'theirs' | 'equal';
    }>;
    pricing: {
      title: string;
      ourProject: {
        price: string;
        features: string[];
        ctaText: string;
        ctaUrl: string;
      };
      competitor: {
        price: string;
        features: string[];
      };
    };
  };
  
  advantages: {
    title: string;
    description: string;
    points: Array<{
      title: string;
      description: string;
      icon?: string;
    }>;
  };
  
  testimonials: Array<{
    name: string;
    role: string;
    company: string;
    content: string;
    avatar?: string;
    rating: number;
  }>;
  
  faq: Array<{
    question: string;
    answer: string;
  }>;
  
  cta: {
    title: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
    secondaryButtonText?: string;
    secondaryButtonUrl?: string;
  };
  
  competitor: {
    id: string;
    name: string;
    website: string;
    description: string;
    logo?: string;
    category: string;
  };
  
  project: {
    id: string;
    name: string;
    description: string;
    website: string;
    logo?: string;
  };
}

export function ComparisonPage({ 
  config, 
  slug, 
  className, 
  style, 
  onConversion 
}: ComparisonPageProps) {
  const [data, setData] = useState<ComparisonPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  useEffect(() => {
    loadComparisonPage();
  }, [slug]);

  const loadComparisonPage = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${config.apiUrl}/public/comparison-pages/${slug}`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message || 'Failed to load comparison page');
      }
    } catch (err) {
      console.error('Error loading comparison page:', err);
      setError('Failed to load comparison page');
    } finally {
      setLoading(false);
    }
  };

  const handleCTAClick = async (url: string) => {
    // Track conversion
    try {
      await fetch(`${config.apiUrl}/public/comparison-pages/${slug}/track-conversion`, {
        method: 'POST'
      });
    } catch (err) {
      console.error('Error tracking conversion:', err);
    }

    // Call custom conversion handler
    if (onConversion) {
      onConversion();
    }

    // Open URL
    window.open(url, '_blank');
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  if (loading) {
    return (
      <div className={`comparison-page-loading ${className || ''}`} style={style}>
        <div className="flex justify-center items-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`comparison-page-error ${className || ''}`} style={style}>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Page</h3>
          <p className="text-gray-600">{error || 'Comparison page not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`comparison-page ${className || ''}`} style={style}>
      {/* Hero Section */}
      <section className="comparison-hero bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {data.hero.title}
            </h1>
            {data.hero.subtitle && (
              <p className="text-xl md:text-2xl mb-6 text-blue-100">
                {data.hero.subtitle}
              </p>
            )}
            <p className="text-lg mb-8 max-w-3xl mx-auto">
              {data.hero.description}
            </p>
            <button
              onClick={() => handleCTAClick(data.hero.ctaUrl)}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {data.hero.ctaText}
            </button>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="comparison-overview py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {data.overview.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {data.overview.description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.overview.keyPoints.map((point, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">{point}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Section */}
      <section className="comparison-features py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {data.comparison.title}
            </h2>
            {data.comparison.description && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {data.comparison.description}
              </p>
            )}
          </div>

          {/* Feature Comparison Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">{data.project.name}</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">{data.competitor.name}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.comparison.features.map((feature, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {feature.feature}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          feature.advantage === 'ours' ? 'bg-green-100 text-green-800' :
                          feature.advantage === 'theirs' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {typeof feature.ourProject === 'boolean' ? (
                            feature.ourProject ? (
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            )
                          ) : (
                            feature.ourProject
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          feature.advantage === 'theirs' ? 'bg-green-100 text-green-800' :
                          feature.advantage === 'ours' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {typeof feature.competitor === 'boolean' ? (
                            feature.competitor ? (
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            )
                          ) : (
                            feature.competitor
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Comparison */}
          {data.comparison.pricing && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                {data.comparison.pricing.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Our Project Pricing */}
                <div className="bg-white p-8 rounded-lg shadow-sm border-2 border-blue-200">
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{data.project.name}</h4>
                    <div className="text-3xl font-bold text-blue-600 mb-4">
                      {data.comparison.pricing.ourProject.price}
                    </div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {data.comparison.pricing.ourProject.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleCTAClick(data.comparison.pricing.ourProject.ctaUrl)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    {data.comparison.pricing.ourProject.ctaText}
                  </button>
                </div>

                {/* Competitor Pricing */}
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{data.competitor.name}</h4>
                    <div className="text-3xl font-bold text-gray-600 mb-4">
                      {data.comparison.pricing.competitor.price}
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {data.comparison.pricing.competitor.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Advantages Section */}
      <section className="comparison-advantages py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {data.advantages.title}
            </h2>
            {data.advantages.description && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {data.advantages.description}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.advantages.points.map((point, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-center">
                  {point.icon && (
                    <div className="text-4xl mb-4">{point.icon}</div>
                  )}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {point.title}
                  </h3>
                  <p className="text-gray-600">
                    {point.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {data.testimonials && data.testimonials.length > 0 && (
        <section className="comparison-testimonials py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What Our Customers Say
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-4">
                    {testimonial.avatar && (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-sm text-gray-500">{testimonial.company}</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.content}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {data.faq && data.faq.length > 0 && (
        <section className="comparison-faq py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
            </div>
            
            <div className="space-y-4">
              {data.faq.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900">{item.question}</h3>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedFAQ === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedFAQ === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-700">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Section */}
      <section className="comparison-cta py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {data.cta.title}
          </h2>
          {data.cta.description && (
            <p className="text-xl mb-8 text-blue-100">
              {data.cta.description}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleCTAClick(data.cta.buttonUrl)}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {data.cta.buttonText}
            </button>
            {data.cta.secondaryButtonText && data.cta.secondaryButtonUrl && (
              <button
                onClick={() => handleCTAClick(data.cta.secondaryButtonUrl!)}
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                {data.cta.secondaryButtonText}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .comparison-page {
            font-family: system-ui, -apple-system, sans-serif;
          }
          
          .comparison-hero {
            background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
          }
          
          .comparison-cta {
            background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
          }
          
          @media (max-width: 768px) {
            .comparison-hero h1 {
              font-size: 2rem;
            }
            
            .comparison-hero p {
              font-size: 1rem;
            }
          }
        `
      }} />
    </div>
  );
}
