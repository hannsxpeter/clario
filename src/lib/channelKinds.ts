import type { ChannelRec } from './appTypes';

/**
 * Pick a sensible default creative format for a channel, plus a couple of
 * alternatives the user can switch to. Matches on key/name keywords so it stays
 * robust even if the model returns channel keys we did not anticipate.
 */
export function creativeKinds(channel: Pick<ChannelRec, 'key' | 'name' | 'group'>): string[] {
	const h = `${channel.key} ${channel.name}`.toLowerCase();
	const has = (...w: string[]) => w.some((x) => h.includes(x));

	if (has('tv', 'ctv', 'ott', 'television')) return ['30s TV script', '15s TV script', 'CTV storyboard'];
	if (has('radio', 'audio', 'podcast')) return ['30s radio spot', 'podcast host-read', '60s audio ad'];
	if (has('out-of-home', 'ooh', 'billboard', 'transit')) return ['billboard headline set', 'transit poster'];
	if (has('print')) return ['print ad', 'magazine spread copy'];
	if (has('search', 'ppc', 'sem')) return ['responsive search ad', 'RSA headline + description set'];
	if (has('social') && has('paid')) return ['paid social ad', 'UGC-style ad script', 'carousel copy'];
	if (has('display', 'programmatic', 'banner')) return ['display ad set', 'native display copy'];
	if (has('native', 'taboola', 'outbrain', 'discovery')) return ['native headline + hook', 'advertorial intro'];
	if (has('affiliate')) return ['affiliate angle brief', 'pre-lander hook'];
	if (has('influencer', 'creator')) return ['creator brief', 'talking-points script'];
	if (has('retail')) return ['retail media ad', 'sponsored product copy'];
	if (has('seo')) return ['SEO content brief', 'article outline'];
	if (has('geo', 'aeo', 'answer engine')) return ['GEO answer block', 'FAQ schema copy'];
	if (has('content', 'blog')) return ['blog post outline', 'story-led article intro'];
	if (has('email')) return ['welcome email', 'cold email', 'nurture sequence step'];
	if (has('sms')) return ['SMS sequence', 'single SMS blast'];
	if (has('landing', 'website', 'page')) return ['landing page hero + sections', 'lead-capture page copy'];
	if (has('app', 'push')) return ['push notification set', 'in-app message'];
	if (has('community', 'dark social')) return ['community post', 'Reddit-native answer'];
	if (has('pr')) return ['digital PR pitch', 'press angle'];
	if (has('review', 'ugc')) return ['review-request flow', 'UGC prompt'];
	if (has('organic')) return ['organic social post set', 'thread'];
	if (has('referral', 'word-of-mouth')) return ['referral offer copy', 'share prompt'];
	if (has('experiential', 'irl', 'event')) return ['experiential concept', 'event activation brief'];
	if (has('xr', 'spatial', 'ar', 'vr')) return ['XR activation concept'];
	if (has('ai', 'agentic', 'chat')) return ['agent-ready product blurb', 'chat assistant script'];
	return ['ad copy', 'story-led post'];
}
