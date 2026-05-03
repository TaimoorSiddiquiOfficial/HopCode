export type QuranicAngle =
  | 'verification'
  | 'truthfulness'
  | 'patience'
  | 'justice'
  | 'mercy'
  | 'trust'
  | 'humility'
  | 'good_speech'
  | 'avoid_harm'
  | 'avoid_mockery'
  | 'avoid_assumption'
  | 'beneficial_work'
  | 'wisdom'
  | 'privacy_and_trust'
  | 'responsibility'
  | 'gratitude'
  | 'excellence'
  | 'moderation'
  | 'transparency'
  | 'accountability'
  | 'steadfastness'
  | 'seeking_knowledge'
  | 'cooperation'
  | 'empowerment'
  | 'capability'
  | 'stewardship';

export type AgentSituation =
  | 'uncertain_bug'
  | 'confirmed_bug'
  | 'user_mistake'
  | 'planning_feature'
  | 'code_review'
  | 'security_risk'
  | 'privacy_risk'
  | 'user_frustration'
  | 'architecture_decision'
  | 'missing_context'
  | 'performance_issue'
  | 'ethical_risk'
  | 'general_advice'
  | 'izn_mode_active'
  | 'complex_implementation'
  | 'empowered_execution';

export type AyahGuidance = {
  ref: string;
  surah: number;
  ayah: number;
  arabic?: string;
  translation?: string;
  translationSource?: string;

  /**
   * Curated principle angles.
   * The agent must not invent new tafsir from the ayah.
   */
  angles: QuranicAngle[];

  /**
   * Human-reviewed principle.
   */
  principle: string;

  /**
   * Practical behavior for an AI coding agent.
   */
  agentStrategy: {
    useWhen: AgentSituation[];
    do: string[];
    avoid: string[];
    tone: string[];
  };

  references?: Array<{
    source: string;
    note: string;
    url?: string;
  }>;
};

export type SituationAnalysis = {
  situation: AgentSituation;
  confidence: number;
  detectedSignals: string[];
  requiredAngles: QuranicAngle[];
};

export type GuidanceDecision = {
  situation: AgentSituation;
  appliedAngles: QuranicAngle[];
  ayahRefs: string[];
  strategy: {
    do: string[];
    avoid: string[];
    tone: string[];
  };
  responsePattern: string;
};
