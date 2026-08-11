// Provider-agnostic AI abstraction for the Lead Management "AI Assistant".
//
// V1 does not call any real AI API — this only establishes the interface so
// a provider can be wired in later purely via environment variables, with no
// changes needed to leads-routes.mjs or the frontend.
//
// To enable a provider later: implement its adapter's generate() method
// below (using whatever SDK/fetch call that provider needs), then set
// AI_PROVIDER=openai|anthropic|gemini and the matching *_API_KEY in .env.

const PROVIDERS = {
  openai: {
    name: 'OpenAI',
    isConfigured: () => !!process.env.OPENAI_API_KEY,
    async generate() {
      throw new Error('OpenAI adapter not implemented yet.');
    }
  },
  anthropic: {
    name: 'Anthropic Claude',
    isConfigured: () => !!process.env.ANTHROPIC_API_KEY,
    async generate() {
      throw new Error('Anthropic adapter not implemented yet.');
    }
  },
  gemini: {
    name: 'Google Gemini',
    isConfigured: () => !!process.env.GEMINI_API_KEY,
    async generate() {
      throw new Error('Gemini adapter not implemented yet.');
    }
  }
};

function getActiveProvider() {
  const key = (process.env.AI_PROVIDER || 'none').toLowerCase();
  return PROVIDERS[key] || null;
}

function isAIConfigured() {
  const provider = getActiveProvider();
  return !!provider && provider.isConfigured();
}

// draftType: 'introduction' | 'followup'
// context: { lead, activities, companyContext }
async function generateLeadEmail(draftType, context) {
  const provider = getActiveProvider();
  if (!provider || !provider.isConfigured()) {
    return {
      configured: false,
      message: 'AI integration not configured.'
    };
  }

  try {
    const result = await provider.generate(draftType, context);
    return { configured: true, ...result };
  } catch (err) {
    return { configured: true, error: true, message: err.message || 'AI generation failed.' };
  }
}

export { getActiveProvider, isAIConfigured, generateLeadEmail };
