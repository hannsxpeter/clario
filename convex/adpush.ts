import { v } from 'convex/values';
import { action } from './_generated/server';

declare const process: { env: Record<string, string | undefined> };

/**
 * Ad-platform push connectors. Turns a humanized, platform-formatted asset into
 * the exact create-request each platform's API expects, always as a PAUSED ad so
 * a human reviews and enables it. Nothing is ever pushed live automatically.
 *
 * Default is dry-run: it returns the precise request that WOULD be sent. When the
 * relevant credentials are set in Convex env, the Google connector actually
 * creates the paused ad and returns its resource name.
 */

type Field = { label: string; value: string; limit: number };

function values(fields: Field[], prefix: string): string[] {
	return fields.filter((f) => f.label.toLowerCase().startsWith(prefix)).map((f) => f.value);
}
function first(fields: Field[], prefix: string): string {
	return values(fields, prefix)[0] ?? '';
}

/* ---------------------------- request builders ---------------------------- */

export function buildGoogleRequest(fields: Field[], finalUrl: string, customerId?: string, adGroupId?: string) {
	const cid = customerId || 'CUSTOMER_ID';
	const ag = adGroupId || 'AD_GROUP_ID';
	const headlines = values(fields, 'headline').slice(0, 15).map((t) => ({ text: t.slice(0, 30) }));
	const descriptions = values(fields, 'description').slice(0, 4).map((t) => ({ text: t.slice(0, 90) }));
	return {
		method: 'POST',
		url: `https://googleads.googleapis.com/v18/customers/${cid}/adGroupAds:mutate`,
		body: {
			operations: [
				{
					create: {
						adGroup: `customers/${cid}/adGroups/${ag}`,
						status: 'PAUSED',
						ad: {
							finalUrls: [finalUrl],
							responsiveSearchAd: { headlines, descriptions }
						}
					}
				}
			]
		}
	};
}

export function buildMetaRequest(fields: Field[], finalUrl: string, accountId?: string, pageId?: string) {
	return {
		method: 'POST',
		url: `https://graph.facebook.com/v21.0/act_${accountId || 'AD_ACCOUNT_ID'}/adcreatives`,
		body: {
			name: 'Clario creative',
			object_story_spec: {
				page_id: pageId || 'PAGE_ID',
				link_data: {
					message: first(fields, 'primary') || first(fields, 'body'),
					name: first(fields, 'headline'),
					description: first(fields, 'description'),
					link: finalUrl,
					call_to_action: { type: 'LEARN_MORE' }
				}
			}
		},
		followUp: 'Then create an Ad (status PAUSED) referencing this creative under an existing ad set.'
	};
}

export function buildTaboolaRequest(fields: Field[], finalUrl: string, accountId?: string) {
	return {
		method: 'POST',
		url: `https://backstage.taboola.com/backstage/api/1.0/${accountId || 'ACCOUNT_ID'}/campaigns/CAMPAIGN_ID/items`,
		body: {
			url: finalUrl,
			title: first(fields, 'title'),
			description: first(fields, 'description'),
			is_active: false
		},
		followUp: 'Attach the thumbnail brief as the creative image, then submit for review.'
	};
}

/* ------------------------------ live: Google ------------------------------ */

async function googleAccessToken(): Promise<string> {
	const res = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: String(process.env.GOOGLE_ADS_CLIENT_ID),
			client_secret: String(process.env.GOOGLE_ADS_CLIENT_SECRET),
			refresh_token: String(process.env.GOOGLE_ADS_REFRESH_TOKEN),
			grant_type: 'refresh_token'
		})
	});
	const d = (await res.json()) as { access_token?: string };
	if (!d.access_token) throw new Error('Google OAuth token exchange failed.');
	return d.access_token;
}

/* -------------------------------- action --------------------------------- */

export const push = action({
	args: {
		platform: v.string(),
		fields: v.array(v.object({ label: v.string(), value: v.string(), limit: v.number() })),
		finalUrl: v.optional(v.string())
	},
	handler: async (ctx, { platform, fields, finalUrl }): Promise<Record<string, unknown>> => {
		const url = finalUrl && finalUrl.trim() ? finalUrl.trim() : 'https://itstoday.media';

		if (platform === 'google') {
			const cid = process.env.GOOGLE_ADS_CUSTOMER_ID;
			const ag = process.env.GOOGLE_ADS_AD_GROUP_ID;
			const req = buildGoogleRequest(fields, url, cid, ag);
			const live =
				process.env.GOOGLE_ADS_DEVELOPER_TOKEN &&
				process.env.GOOGLE_ADS_REFRESH_TOKEN &&
				process.env.GOOGLE_ADS_CLIENT_ID &&
				cid &&
				ag;
			if (!live) {
				return {
					mode: 'dry-run',
					platform,
					request: req,
					note: 'Set GOOGLE_ADS_* env vars in Convex to create this as a real paused ad. Nothing was sent.'
				};
			}
			try {
				const token = await googleAccessToken();
				const headers: Record<string, string> = {
					Authorization: `Bearer ${token}`,
					'developer-token': String(process.env.GOOGLE_ADS_DEVELOPER_TOKEN),
					'Content-Type': 'application/json'
				};
				if (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID)
					headers['login-customer-id'] = String(process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID);
				const res = await fetch(req.url, { method: 'POST', headers, body: JSON.stringify(req.body) });
				const data = (await res.json()) as { results?: { resourceName?: string }[] };
				if (!res.ok) return { mode: 'error', platform, request: req, error: JSON.stringify(data).slice(0, 400) };
				return {
					mode: 'live',
					platform,
					request: req,
					resourceName: data.results?.[0]?.resourceName,
					note: 'Created as PAUSED in Google Ads. Review and enable it there.'
				};
			} catch (e) {
				return { mode: 'error', platform, request: req, error: e instanceof Error ? e.message : 'push failed' };
			}
		}

		if (platform === 'meta') {
			return {
				mode: 'dry-run',
				platform,
				request: buildMetaRequest(fields, url, process.env.META_AD_ACCOUNT_ID, process.env.META_PAGE_ID),
				note: 'Meta AdCreative payload. Add META_AD_ACCOUNT_ID, META_PAGE_ID, and a token to push a paused ad.'
			};
		}

		if (platform === 'taboola') {
			return {
				mode: 'dry-run',
				platform,
				request: buildTaboolaRequest(fields, url, process.env.TABOOLA_ACCOUNT_ID),
				note: 'Taboola Backstage item payload. Requires advertiser API credentials from Taboola.'
			};
		}

		throw new Error(`Unknown platform: ${platform}`);
	}
});
