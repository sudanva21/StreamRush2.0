import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Upload, 
  Play, 
  User, 
  Shield, 
  CreditCard, 
  Settings,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Video,
  Heart,
  Bell
} from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface HelpCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
}

const Help: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFAQs, setOpenFAQs] = useState<string[]>([]);

  const categories: HelpCategory[] = [
    { id: 'all', title: 'All Topics', icon: HelpCircle, description: 'Browse all help topics' },
    { id: 'getting-started', title: 'Getting Started', icon: Play, description: 'New to StreamRush? Start here' },
    { id: 'uploading', title: 'Uploading Videos', icon: Upload, description: 'How to upload and manage your content' },
    { id: 'account', title: 'Account & Profile', icon: User, description: 'Manage your account settings' },
    { id: 'privacy', title: 'Privacy & Safety', icon: Shield, description: 'Protect your privacy and stay safe' },
    { id: 'monetization', title: 'Monetization', icon: CreditCard, description: 'Earn money from your content' },
    { id: 'technical', title: 'Technical Issues', icon: Settings, description: 'Troubleshoot technical problems' },
  ];

  const faqs: FAQ[] = [
    {
      id: '1',
      category: 'getting-started',
      question: 'How do I create an account on StreamRush?',
      answer: 'You can create an account by clicking the "Sign Up" button in the top right corner. You can register using your email address or sign in with your Google account. After registration, you can customize your profile and start uploading videos right away.'
    },
    {
      id: '2',
      category: 'getting-started',
      question: 'Is StreamRush free to use?',
      answer: 'Yes! StreamRush is completely free to use. You can upload videos, watch content, subscribe to channels, and use all basic features without any cost. We also offer premium features for creators who want to monetize their content.'
    },
    {
      id: '3',
      category: 'uploading',
      question: 'What video formats does StreamRush support?',
      answer: 'StreamRush supports most common video formats including MP4, MOV, AVI, WebM, MKV, and more. We recommend MP4 format with H.264 codec for best compatibility. Maximum file size is 2GB per video, and videos can be up to 12 hours long.'
    },
    {
      id: '4',
      category: 'uploading',
      question: 'How long does it take for my video to process?',
      answer: 'Video processing time depends on your video length and quality. Most videos under 10 minutes process within 2-5 minutes. Longer or higher quality videos may take 10-30 minutes. You\'ll receive a notification when processing is complete.'
    },
    {
      id: '5',
      category: 'uploading',
      question: 'Can I edit my video details after uploading?',
      answer: 'Yes! You can edit your video title, description, tags, thumbnail, and privacy settings at any time. Go to your channel dashboard, find the video, and click "Edit Details". Changes are saved immediately.'
    },
    {
      id: '6',
      category: 'account',
      question: 'How do I change my channel name?',
      answer: 'Go to your Profile settings by clicking your avatar in the top right corner, then select "Profile". You can update your display name, channel description, and upload a new profile picture or banner image.'
    },
    {
      id: '7',
      category: 'account',
      question: 'How do I delete my account?',
      answer: 'To delete your account, go to Settings > Privacy > Account Settings. Scroll down to find "Delete Account" option. Please note that this action is permanent and will remove all your videos, comments, and data.'
    },
    {
      id: '8',
      category: 'privacy',
      question: 'How do I make my videos private?',
      answer: 'When uploading a video, you can set its visibility to Private, Unlisted, or Public. For existing videos, go to your channel dashboard, click on the video, and change the privacy setting in the "Edit Details" section.'
    },
    {
      id: '9',
      category: 'privacy',
      question: 'Can I block specific users?',
      answer: 'Yes, you can block users by going to their profile and clicking "Block User". Blocked users cannot comment on your videos, send you messages, or interact with your content. You can manage blocked users in your Privacy settings.'
    },
    {
      id: '10',
      category: 'technical',
      question: 'Why is my video not playing?',
      answer: 'If videos aren\'t playing, try refreshing the page, clearing your browser cache, or trying a different browser. Check your internet connection and ensure JavaScript is enabled. If the problem persists, the video might still be processing.'
    },
    {
      id: '11',
      category: 'technical',
      question: 'How do I report a bug or technical issue?',
      answer: 'You can report bugs through our Report page or contact our support team. Please include details about your browser, operating system, and steps to reproduce the issue. Screenshots or screen recordings are very helpful.'
    },
    {
      id: '12',
      category: 'monetization',
      question: 'How can I monetize my content?',
      answer: 'StreamRush offers several monetization options including ad revenue sharing, channel memberships, super chats, and direct viewer donations. You need at least 1,000 subscribers and 4,000 watch hours to be eligible for monetization.'
    },
  ];

  const toggleFAQ = (faqId: string) => {
    setOpenFAQs(prev => 
      prev.includes(faqId) 
        ? prev.filter(id => id !== faqId)
        : [...prev, faqId]
    );
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-16 px-3 sm:px-6 max-w-6xl mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <HelpCircle size={32} className="text-youtube-red" />
        <h1 className="text-2xl sm:text-3xl font-bold">Help Center</h1>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search size={20} className="absolute left-3 top-3 text-youtube-lightgray" />
          <input
            type="text"
            data-testid="help-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search help articles..."
            className="w-full pl-10 pr-4 py-3 bg-youtube-gray border border-gray-600 rounded-lg focus:ring-2 focus:ring-youtube-red focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Categories Sidebar */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-youtube-gray/30 rounded-lg p-4">
            <h2 className="text-lg font-bold mb-4">Help Categories</h2>
            <nav className="space-y-1">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    data-testid={`help-category-${category.id}`}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-start space-x-3 p-3 rounded-lg text-left transition-colors ${
                      activeCategory === category.id
                        ? 'bg-youtube-red text-white'
                        : 'hover:bg-youtube-gray/50 text-youtube-lightgray'
                    }`}
                  >
                    <Icon size={20} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium">{category.title}</div>
                      <div className="text-xs opacity-75 mt-1">{category.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Contact Section */}
          <div className="bg-youtube-gray/30 rounded-lg p-4 mt-6">
            <h2 className="text-lg font-bold mb-4">Still need help?</h2>
            <div className="space-y-3">
              <a 
                href="mailto:support@streamrush.com"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-youtube-gray/50 transition-colors text-youtube-lightgray hover:text-white"
              >
                <Mail size={18} />
                <div>
                  <div className="font-medium">Email Support</div>
                  <div className="text-xs">support@streamrush.com</div>
                </div>
              </a>
              
              <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-youtube-gray/50 transition-colors text-youtube-lightgray hover:text-white">
                <MessageCircle size={18} />
                <div>
                  <div className="font-medium">Live Chat</div>
                  <div className="text-xs">Available 24/7</div>
                </div>
              </button>
              
              <a 
                href="tel:1-800-STREAM"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-youtube-gray/50 transition-colors text-youtube-lightgray hover:text-white"
              >
                <Phone size={18} />
                <div>
                  <div className="font-medium">Phone Support</div>
                  <div className="text-xs">1-800-STREAM-1</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="flex-1">
          {/* Category Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">
              {activeCategory === 'all' ? 'Frequently Asked Questions' : 
               categories.find(c => c.id === activeCategory)?.title}
            </h2>
            <p className="text-youtube-lightgray">
              {searchQuery && `Found ${filteredFAQs.length} results for "${searchQuery}"`}
              {!searchQuery && activeCategory === 'all' && 'Find answers to common questions'}
              {!searchQuery && activeCategory !== 'all' && categories.find(c => c.id === activeCategory)?.description}
            </p>
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => (
                <div 
                  key={faq.id}
                  data-testid={`faq-item-${faq.id}`}
                  className="bg-youtube-gray/30 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-youtube-gray/50 transition-colors"
                  >
                    <h3 className="font-medium pr-4">{faq.question}</h3>
                    {openFAQs.includes(faq.id) ? (
                      <ChevronDown size={20} className="text-youtube-red flex-shrink-0" />
                    ) : (
                      <ChevronRight size={20} className="text-youtube-lightgray flex-shrink-0" />
                    )}
                  </button>
                  
                  {openFAQs.includes(faq.id) && (
                    <div className="px-4 pb-4 text-youtube-lightgray">
                      <div className="pt-2 border-t border-gray-600">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Search size={64} className="mx-auto mb-4 text-youtube-lightgray" />
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-youtube-lightgray mb-4">
                  We couldn't find any help articles matching your search.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="btn-primary"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>

          {/* Popular Articles Section */}
          {searchQuery === '' && activeCategory === 'all' && (
            <div className="mt-12">
              <h2 className="text-xl font-bold mb-6">Popular Help Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-youtube-gray/30 rounded-lg p-4 hover:bg-youtube-gray/50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3 mb-2">
                    <Upload size={20} className="text-youtube-red" />
                    <h3 className="font-medium">How to Upload Videos</h3>
                  </div>
                  <p className="text-sm text-youtube-lightgray">
                    Step-by-step guide to uploading your first video
                  </p>
                </div>

                <div className="bg-youtube-gray/30 rounded-lg p-4 hover:bg-youtube-gray/50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3 mb-2">
                    <Video size={20} className="text-youtube-red" />
                    <h3 className="font-medium">Video Quality Guidelines</h3>
                  </div>
                  <p className="text-sm text-youtube-lightgray">
                    Best practices for high-quality video uploads
                  </p>
                </div>

                <div className="bg-youtube-gray/30 rounded-lg p-4 hover:bg-youtube-gray/50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3 mb-2">
                    <Shield size={20} className="text-youtube-red" />
                    <h3 className="font-medium">Privacy Settings</h3>
                  </div>
                  <p className="text-sm text-youtube-lightgray">
                    Control who can see your content and profile
                  </p>
                </div>

                <div className="bg-youtube-gray/30 rounded-lg p-4 hover:bg-youtube-gray/50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3 mb-2">
                    <CreditCard size={20} className="text-youtube-red" />
                    <h3 className="font-medium">Monetization Basics</h3>
                  </div>
                  <p className="text-sm text-youtube-lightgray">
                    Learn how to earn money from your videos
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Links */}
          {searchQuery === '' && activeCategory === 'all' && (
            <div className="mt-12 bg-youtube-gray/20 rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Quick Links</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <a href="/terms" className="flex flex-col items-center text-center p-3 rounded-lg hover:bg-youtube-gray/30 transition-colors text-youtube-lightgray hover:text-white">
                  <FileText size={24} className="mb-2" />
                  <span className="text-sm">Terms of Service</span>
                </a>
                
                <a href="/privacy" className="flex flex-col items-center text-center p-3 rounded-lg hover:bg-youtube-gray/30 transition-colors text-youtube-lightgray hover:text-white">
                  <Shield size={24} className="mb-2" />
                  <span className="text-sm">Privacy Policy</span>
                </a>
                
                <a href="/community-guidelines" className="flex flex-col items-center text-center p-3 rounded-lg hover:bg-youtube-gray/30 transition-colors text-youtube-lightgray hover:text-white">
                  <Heart size={24} className="mb-2" />
                  <span className="text-sm">Community Guidelines</span>
                </a>
                
                <a href="/report" className="flex flex-col items-center text-center p-3 rounded-lg hover:bg-youtube-gray/30 transition-colors text-youtube-lightgray hover:text-white">
                  <Bell size={24} className="mb-2" />
                  <span className="text-sm">Report Content</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Help;