# Ad-platform push connectors

Clario can push a humanized asset straight into an ad platform as the exact create-request that platform's API expects. Two rules make this safe:

1. Every ad is created **PAUSED**. Nothing goes live automatically. A human reviews and enables it.
2. It is **dry-run by default**. Without credentials, the connector returns the precise request that would be sent (no call is made). With credentials, the Google connector actually creates the paused ad.

This lives in `convex/adpush.ts` and is surfaced on each generated asset under "Export for a platform" (the "Push (paused)" button). The same builders are exposed as MCP tools (`push_to_google`, `push_to_meta`, `push_to_taboola`).

## What each platform gets

- **Google Ads (RSA):** an `adGroupAds:mutate` operation creating a `responsiveSearchAd` (up to 15 headlines, 4 descriptions) with `status: PAUSED`.
- **Meta:** an `AdCreative` payload (`object_story_spec.link_data`) ready to attach to a paused Ad under an ad set.
- **Taboola:** a Backstage campaign-item payload with `is_active: false`.

## Enabling real (paused) Google Ads insertion

The Google connector goes live only when all of these are set in Convex. Set each with `npx convex env set NAME value`:

```
GOOGLE_ADS_DEVELOPER_TOKEN     # from a Google Ads manager account (a test manager account gives a test token immediately)
GOOGLE_ADS_CLIENT_ID           # OAuth2 client (Google Cloud console)
GOOGLE_ADS_CLIENT_SECRET
GOOGLE_ADS_REFRESH_TOKEN       # from the OAuth2 consent flow, scope https://www.googleapis.com/auth/adwords
GOOGLE_ADS_CUSTOMER_ID         # target account, digits only, no dashes
GOOGLE_ADS_AD_GROUP_ID         # the ad group the RSA is created under
GOOGLE_ADS_LOGIN_CUSTOMER_ID   # optional, the manager account id if the target is under an MCC
```

With a test manager account and a test customer, this creates real paused ads you can inspect without spending money. For production, the developer token needs basic access (an approval step) and you point at a live account.

## Meta and Taboola

Meta needs an app, a token with `ads_management`, an ad account, and a Page. You can operate on your own accounts and there is a sandbox ad account for testing; broader access needs app review. Taboola's Backstage API credentials are requested from Taboola (not self-serve), so that connector is dry-run until you have them. Set `META_AD_ACCOUNT_ID`, `META_PAGE_ID`, and `TABOOLA_ACCOUNT_ID` to fill those into the built payloads.

## Why paused-only

An autonomous tool that spends live ad budget is a liability, not a feature. Building the ad paused, showing the exact request, and leaving the enable step to a human is the responsible default for a media-buying team, and it still saves the buyer the copy-paste.
