import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Get or create visitor ID (reuse from chat if exists)
const getVisitorId = (): string => {
  const key = 'tommy-visitor-id';
  let visitorId = localStorage.getItem(key);
  if (!visitorId) {
    visitorId = `visitor-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(key, visitorId);
  }
  return visitorId;
};

// Session-based deduplication key for this path
const getSessionKey = (path: string): string => `pageview-tracked-${path}`;

// Check if page view was already tracked this session
const wasTrackedThisSession = (path: string): boolean => {
  return sessionStorage.getItem(getSessionKey(path)) === 'true';
};

// Mark page view as tracked for this session
const markTrackedThisSession = (path: string): void => {
  sessionStorage.setItem(getSessionKey(path), 'true');
};

export const usePageView = (path?: string) => {
  const tracked = useRef(false);

  useEffect(() => {
    // Only track once per component mount
    if (tracked.current) return;
    tracked.current = true;

    const currentPath = path || window.location.pathname;

    // Session-based deduplication - only track once per session per path
    if (wasTrackedThisSession(currentPath)) {
      return;
    }

    const trackPageView = async () => {
      try {
        const visitorId = getVisitorId();
        
        // Mark as tracked before async call to prevent race conditions
        markTrackedThisSession(currentPath);
        
        await supabase.from('page_views').insert({
          visitor_id: visitorId,
          path: currentPath,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
          screen_width: window.screen.width,
          screen_height: window.screen.height,
        });
      } catch (error) {
        // Silently fail - don't disrupt user experience for analytics
        console.debug('Analytics tracking failed:', error);
      }
    };

    trackPageView();
  }, [path]);
};
