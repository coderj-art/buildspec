declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
) {
  console.log(`[Analytics] ${eventName}`, {
    timestamp: new Date().toISOString(),
    ...properties,
  });
}

export function trackSurveyStart(sessionId: string) {
  trackEvent("survey_start", { sessionId });
}

export function trackSurveyAnswer(
  step: number,
  question: string,
  answer: string | string[]
) {
  trackEvent("survey_answer", { step, question, answer });
}

export function trackStepView(step: number) {
  trackEvent("survey_step_view", { step });
}

export function trackBackClick(fromStep: number) {
  trackEvent("survey_back_click", { fromStep });
}

export function trackSurveyComplete(
  sessionId: string,
  answers: Record<string, unknown>
) {
  trackEvent("survey_complete", { sessionId, answers });
}

// Facebook Pixel events
export function trackFbLead(segment?: string) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Lead", {
      content_category: segment || "quiz",
    });
  }
  trackEvent("fb_lead", { segment });
}

export function trackFbCompleteRegistration(segment: string) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "CompleteRegistration", {
      content_name: segment,
      content_category: "quiz_result",
    });
  }
  trackEvent("fb_complete_registration", { segment });
}
