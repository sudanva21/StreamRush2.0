import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  Flag, 
  Send, 
  FileText, 
  UserX, 
  Volume2, 
  Eye, 
  Copyright,
  Shield,
  MessageCircle,
  Mail
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ReportForm {
  type: string;
  reason: string;
  description: string;
  contentId?: string;
  contentUrl?: string;
  urgency: 'low' | 'medium' | 'high';
}

const Report: React.FC = () => {
  const [reportForm, setReportForm] = useState<ReportForm>({
    type: '',
    reason: '',
    description: '',
    contentId: '',
    contentUrl: '',
    urgency: 'medium',
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { currentUser } = useAuth();

  const reportTypes = [
    {
      id: 'content',
      label: 'Content Violation',
      icon: Eye,
      description: 'Report inappropriate, harmful, or policy-violating content'
    },
    {
      id: 'copyright',
      label: 'Copyright Infringement',
      icon: Copyright,
      description: 'Report unauthorized use of copyrighted material'
    },
    {
      id: 'harassment',
      label: 'Harassment or Bullying',
      icon: UserX,
      description: 'Report harassment, bullying, or threatening behavior'
    },
    {
      id: 'spam',
      label: 'Spam or Scam',
      icon: Mail,
      description: 'Report spam, scams, or misleading content'
    },
    {
      id: 'hate-speech',
      label: 'Hate Speech',
      icon: MessageCircle,
      description: 'Report content that promotes hatred or discrimination'
    },
    {
      id: 'violence',
      label: 'Violence or Dangerous Acts',
      icon: AlertTriangle,
      description: 'Report content showing violence or dangerous activities'
    },
    {
      id: 'privacy',
      label: 'Privacy Violation',
      icon: Shield,
      description: 'Report content that violates privacy or shares personal information'
    },
    {
      id: 'other',
      label: 'Other',
      icon: Flag,
      description: 'Report other types of violations or issues'
    },
  ];

  const reasonsByType = {
    content: [
      'Inappropriate content for the platform',
      'Sexual or adult content',
      'Violent or graphic content',
      'Content harmful to minors',
      'Misinformation or false claims',
    ],
    copyright: [
      'Unauthorized use of my content',
      'Unauthorized use of music/audio',
      'Unauthorized use of video/images',
      'Trademark violation',
      'Patent infringement',
    ],
    harassment: [
      'Personal attacks or insults',
      'Threatening behavior',
      'Doxxing or sharing personal info',
      'Impersonation',
      'Cyberbullying',
    ],
    spam: [
      'Repetitive or unwanted content',
      'Misleading thumbnails or titles',
      'Phishing or scam attempts',
      'Fake engagement (bots, fake views)',
      'Unwanted commercial content',
    ],
    'hate-speech': [
      'Discrimination based on race/ethnicity',
      'Religious intolerance',
      'Gender-based discrimination',
      'LGBTQ+ discrimination',
      'Disability-based discrimination',
    ],
    violence: [
      'Graphic violence',
      'Dangerous stunts or activities',
      'Instructions for harmful acts',
      'Self-harm content',
      'Animal abuse',
    ],
    privacy: [
      'Sharing personal information without consent',
      'Non-consensual intimate content',
      'Invasion of privacy',
      'Revenge content',
      'Leaked private communications',
    ],
    other: [
      'Platform policy violation',
      'Technical issue',
      'Account-related problem',
      'Community guidelines violation',
      'Other unlisted violation',
    ],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reportForm.type || !reportForm.reason) {
      alert('Please select a report type and reason');
      return;
    }

    setSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would send the report to your backend
      console.log('Report submitted:', {
        ...reportForm,
        userId: currentUser?.uid,
        timestamp: new Date().toISOString(),
      });
      
      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setReportForm({
          type: '',
          reason: '',
          description: '',
          contentId: '',
          contentUrl: '',
          urgency: 'medium',
        });
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTypeSelect = (type: string) => {
    setReportForm(prev => ({
      ...prev,
      type,
      reason: '', // Reset reason when type changes
    }));
  };

  if (!currentUser) {
    return (
      <div className="pt-16 px-6 text-center">
        <div className="max-w-md mx-auto mt-20">
          <Flag size={64} className="mx-auto mb-4 text-youtube-lightgray" />
          <h1 className="text-2xl font-bold mb-4">Report Content</h1>
          <p className="text-youtube-lightgray mb-6">
            Please log in to report content or issues
          </p>
          <Link to="/login" className="btn-primary">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="pt-16 px-6 text-center">
        <div className="max-w-md mx-auto mt-20">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-green-400">Report Submitted</h1>
          <p className="text-youtube-lightgray mb-6">
            Thank you for helping keep StreamRush safe. We'll review your report and take appropriate action if needed.
          </p>
          <p className="text-sm text-youtube-lightgray">
            Report ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 px-3 sm:px-6 max-w-4xl mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <Flag size={32} className="text-youtube-red" />
        <h1 className="text-2xl sm:text-3xl font-bold">Report Content</h1>
      </div>

      <div className="bg-youtube-gray/30 rounded-lg p-4 sm:p-6">
        <div className="mb-6 p-4 bg-yellow-600/20 border border-yellow-600/30 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-400 mb-1">Report Guidelines</p>
              <p className="text-yellow-100">
                Please provide accurate information. False reports may result in account restrictions. 
                For immediate safety concerns, contact emergency services directly.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" data-testid="report-form">
          {/* Report Type Selection */}
          <div>
            <label className="block text-lg font-medium mb-4">What are you reporting?</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {reportTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    type="button"
                    data-testid={`report-type-${type.id}`}
                    onClick={() => handleTypeSelect(type.id)}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      reportForm.type === type.id
                        ? 'border-youtube-red bg-youtube-red/10'
                        : 'border-gray-600 hover:border-gray-500 bg-youtube-gray/30 hover:bg-youtube-gray/50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon size={20} className={reportForm.type === type.id ? 'text-youtube-red' : 'text-youtube-lightgray'} />
                      <div>
                        <h3 className="font-medium">{type.label}</h3>
                        <p className="text-sm text-youtube-lightgray mt-1">{type.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Specific Reason */}
          {reportForm.type && (
            <div>
              <label className="block text-lg font-medium mb-3">
                Specific reason for reporting
              </label>
              <div className="space-y-2">
                {reasonsByType[reportForm.type as keyof typeof reasonsByType]?.map((reason) => (
                  <label key={reason} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-youtube-gray/30 cursor-pointer">
                    <input
                      type="radio"
                      name="reason"
                      value={reason}
                      checked={reportForm.reason === reason}
                      onChange={(e) => setReportForm(prev => ({ ...prev, reason: e.target.value }))}
                      className="mt-1 w-4 h-4 text-youtube-red bg-youtube-gray border-gray-600 focus:ring-youtube-red"
                    />
                    <span className="text-sm">{reason}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Content Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contentId" className="block text-sm font-medium mb-2">
                Content ID <span className="text-youtube-lightgray">(optional)</span>
              </label>
              <input
                type="text"
                id="contentId"
                value={reportForm.contentId}
                onChange={(e) => setReportForm(prev => ({ ...prev, contentId: e.target.value }))}
                placeholder="Video ID or user ID"
                className="w-full bg-youtube-gray border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-youtube-red focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="contentUrl" className="block text-sm font-medium mb-2">
                Content URL <span className="text-youtube-lightgray">(optional)</span>
              </label>
              <input
                type="url"
                id="contentUrl"
                value={reportForm.contentUrl}
                onChange={(e) => setReportForm(prev => ({ ...prev, contentUrl: e.target.value }))}
                placeholder="https://streamrush.com/..."
                className="w-full bg-youtube-gray border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-youtube-red focus:border-transparent"
              />
            </div>
          </div>

          {/* Priority Level */}
          <div>
            <label className="block text-sm font-medium mb-3">Priority Level</label>
            <div className="flex space-x-4">
              {[
                { value: 'low', label: 'Low', color: 'text-green-400' },
                { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
                { value: 'high', label: 'High', color: 'text-red-400' },
              ].map((priority) => (
                <label key={priority.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="urgency"
                    value={priority.value}
                    checked={reportForm.urgency === priority.value}
                    onChange={(e) => setReportForm(prev => ({ ...prev, urgency: e.target.value as any }))}
                    className="w-4 h-4 text-youtube-red bg-youtube-gray border-gray-600 focus:ring-youtube-red"
                  />
                  <span className={`text-sm ${priority.color}`}>{priority.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Additional Details <span className="text-youtube-lightgray">(optional)</span>
            </label>
            <textarea
              id="description"
              rows={4}
              value={reportForm.description}
              onChange={(e) => setReportForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Provide any additional context that might help us review your report..."
              className="w-full bg-youtube-gray border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-youtube-red focus:border-transparent resize-none"
            />
            <p className="text-xs text-youtube-lightgray mt-1">
              Please don't include personal information in your description
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 pt-4">
            <p className="text-sm text-youtube-lightgray">
              All reports are confidential and help improve platform safety
            </p>
            <button
              type="submit"
              data-testid="submit-report"
              disabled={submitting || !reportForm.type || !reportForm.reason}
              className="flex items-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed min-w-32"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Submit Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-youtube-gray/20 rounded-lg p-4 sm:p-6">
        <div className="flex items-center space-x-2 mb-4">
          <FileText size={20} className="text-youtube-red" />
          <h2 className="text-lg font-bold">Need More Help?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium mb-2">Community Guidelines</h3>
            <p className="text-youtube-lightgray">
              Learn about what content is allowed on StreamRush and our community standards.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Safety Center</h3>
            <p className="text-youtube-lightgray">
              Find resources for staying safe online and protecting your privacy.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Copyright Center</h3>
            <p className="text-youtube-lightgray">
              Information about copyright law and how to file copyright claims.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Contact Support</h3>
            <p className="text-youtube-lightgray">
              Get in touch with our support team for additional assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;