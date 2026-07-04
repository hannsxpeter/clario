/**
 * Authoritative TypeScript shapes for the AI outputs stored under `data` on the
 * dna / recommendations / assets tables. The frontend imports these to render
 * strongly-typed views over the reactive Convex documents.
 */

export type Fit = 'high' | 'medium' | 'low';
export type Band = 'human' | 'mixed' | 'ai';

export interface VoiceProfile {
	register: string; // e.g. "warm, plainspoken, lightly irreverent"
	cadence: string; // sentence music and rhythm
	vocabulary: string; // diction, jargon level, word origin
	figurativeDensity: string; // how much metaphor / imagery
	sentenceShape: string; // architecture, length variation
	humor: string;
	signaturePhrases: string[];
	avoid: string[]; // words / moves that break the voice
}

export interface Identity {
	mission: string;
	category: string;
	valueProposition: string;
	differentiators: string[];
	proofPoints: string[];
	audience: string;
}

export interface BrandStory {
	origin: string;
	villain: string; // the problem / enemy the brand fights
	transformation: string; // the change it promises
	motifs: string[];
}

export interface CompanyDna {
	companyName: string;
	oneLine: string;
	archetype: { name: string; why: string };
	voice: VoiceProfile;
	identity: Identity;
	story: BrandStory;
	rules: { always: string[]; never: string[]; consider: string[] };
	keywords: string[];
	confidence: 'high' | 'medium' | 'low';
	confidenceNote: string;
}

export interface Persona {
	name: string;
	snapshot: string;
	demographics: string;
	psychographics: string;
	wateringHoles: string[];
	messageAngle: string;
}

export interface ChannelRec {
	key: string;
	name: string;
	group: string;
	fit: Fit;
	budgetPct: number; // 0-100, across recommended channels
	successRange: string; // honest range with assumptions
	roiRange: string; // honest range with assumptions
	kpis: string[];
	rationale: string;
	messaging: string; // DNA-aligned angle for this channel
	isTopPick: boolean;
}

export interface Recommendations {
	summary: string;
	personas: Persona[];
	channels: ChannelRec[];
	topPicks: string[]; // channel keys, ~5
	budget: { total: number | null; currency: string; notes: string };
}

export interface AuthFlag {
	span: string;
	family: string; // A-F
	pattern: string;
	note: string;
}

export interface AuthScore {
	score: number; // 0-100
	band: Band;
	flags: AuthFlag[];
	basis: string;
}

export interface CreativeAsset {
	channelKey: string;
	channelName: string;
	kind: string; // e.g. "TV script", "email", "ad copy"
	title: string;
	draft: string;
	scoreBefore: AuthScore;
	humanized: string;
	scoreAfter: AuthScore;
	changed: string[];
	steps: string[]; // step-by-step playbook to run it
}
