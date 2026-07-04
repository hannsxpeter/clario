/**
 * Grounded marketing knowledge base injected into the LLM prompt that generates
 * marketing-channel recommendations for It's Today Media.
 *
 * Sourced from the verified "Future of Marketing in the AI Era: Single Source of
 * Truth" (compiled July 2026), which carries an inline fact-check ledger. Every
 * roiRange, KPI, and caveat below is deliberately conservative: where the source
 * flagged a stat as a projection, a vendor number, a selection effect, or
 * misleading-as-framed, that caution is carried into the text. Do not "sharpen"
 * these ranges into false precision downstream.
 */

export const MARKETING_KNOWLEDGE = {
  thesis:
    "AI has commoditized execution: content, targeting, testing, localization, media buying, personalization, and reporting are now cheap and fast for everyone, so AI alone stops being a durable advantage. The moat shifts to what AI cannot fake, verified human trust, taste, proof, consent, and a distinctive point of view. The winning shape is a barbell: machine-facing precision (structured, citable, agent-ready data) on one end and deeply human trust (community, live experience, distinctive voice, consented data) on the other, with the generic interruptive middle collapsing.",

  honestyRules: [
    "Present ROI, ROAS, conversion, and success as RANGES with the assumptions stated, never as single hero numbers. Directional beats falsely precise.",
    "Label every forward-looking figure as a projection or forecast, not a measured outcome, and read it with its scope and assumptions (e.g. agentic-commerce dollar forecasts of $30T machine-influenced by 2030 or $1-5T orchestrated by 2030 are analyst scenarios, not booked revenue).",
    "Flag selection effects explicitly. AI-referred traffic converting at multiples of organic (Adobe ~31% higher, vendor benchmarks quoting ~5x) is a high-intent, late-funnel selection effect, not proof the same landing page is more persuasive to a like-for-like visitor.",
    "Distinguish vendor-reported and trade-body figures from independent measurement; treat self-reported numbers (adoption rates, holiday conversion, citation shares) as directional, not definitive.",
    "Do not equate related-but-different metrics: zero-click search is not 'AI answered the query'; SMS 'open rates' measure deliverability and lock-screen visibility, not confirmed reads; 'influenced' revenue counts any order AI touched, not revenue AI alone generated.",
    "Never fabricate precision. If the evidence is an industry opinion, a dated study, or an uncited aggregator, say so and fall back to the underlying trust logic rather than a made-up multiple.",
    "Recommend incrementality and holdout testing (MMM, brand lift, cohort retention, LTV, share-of-voice) over last-click attribution before reallocating budget on the strength of a reported multiple.",
    "Prefer 'invisible AI': use AI operationally behind the scenes, keep a human in the loop on customer-facing creative, and disclose AI use plainly. Disclosure done well is a trust play; hiding cheap AI 'slop' is the real risk.",
  ],

  businessContext: {
    company: "It's Today Media",
    model:
      "Affiliate and performance marketing operator. Buys media at scale across ad platforms to build owned email and SMS lists, then monetizes those lists. ROI-obsessed and measured on direct-response economics (ROAS, CPA, EPC, contribution margin), not brand impressions.",
    platforms: ["Google", "Meta", "Taboola", "TikTok"],
    assets: [
      "Landing pages",
      "Email lists",
      "SMS lists",
      "First-party and zero-party subscriber data",
    ],
  },

  frameworks: {
    barbell:
      "Marketing is splitting into two ends. Machine-facing: structured data, AI citations, agent-ready commerce, verifiable facts. Human-facing: community, live experience, distinctive voice, earned trust. The mass generic interruptive-digital middle is dying, and it is exactly what dominates budgets today. The move is to defund the middle and invest at both ends. Note the counter-evidence: mass paid digital still works and Google is still growing, so this is an argument about diminishing returns, not a claim that mass digital has stopped functioning.",
    dualAudience:
      "Brands now market to two entities at once: the rational, data-driven AI agent that filters and pre-qualifies options, and the emotionally driven, digitally fatigued human who feels. The agent needs algorithmic legibility (clean feeds, schema, machine-readable pricing and policies); the human needs authenticity, proof, and a point of view. They reinforce each other: build enough loyalty that a human explicitly tells their agent to prefer you. For a performance operator this means agent-readable landing pages AND creative a fatigued human actually trusts.",
    geo:
      "Generative Engine Optimization / Answer Engine Optimization: structure your data, entity footprint, and content so LLM answer engines (ChatGPT, Perplexity, Gemini, Google AI Overviews/AI Mode) retrieve, evaluate, and cite you. Click-through drops sharply when AI summaries appear (Pew: ~8% clicks with an AI summary vs ~15% without), and top-10 ranking no longer guarantees citation. Practitioner heuristics (answer early, keep content fresh, be present in cited communities like Reddit) are directional, not laws. GEO/AEO is largely an enterprise initiative today; the SMB first-mover window is open but closing.",
    trustInterfaces:
      "Rebuild preference centers, unsubscribe flows, SMS opt-ins, quizzes, product matchers, and loyalty profiles as trust interfaces that earn zero-party data (what a customer proactively shares: preferences, budget, intent) through a clear value exchange, not as compliance afterthoughts. High-quality explicit signals are what make AI personalization non-generic. Attest (2024) found 48% of consumers say they would be more likely to trust brands that collect zero-party data (this measured trust, not 'comfort').",
  },

  channelGroups: [
    {
      group: "Paid outbound",
      channels: [
        {
          key: "linear-tv",
          name: "Linear TV",
          whatItIs: "Spot advertising on traditional broadcast and cable TV schedules.",
          typicalKpis: ["Reach", "Frequency", "GRP/TRP", "brand lift", "incremental sales"],
          roiRange:
            "No reliable universal ROAS. The widely cited frequency curve (single exposure +5.7% purchase likelihood; 6-10 exposures ~4.1% worse than 2-5; 11+ a further ~4.2% worse) is real but from a 2018 Simulmedia linear-TV study, not digital, and is ~8 years old; treat only the direction (over-frequency erodes conversion) as durable.",
          successNotes:
            "Broad awareness and trust-building, weak for tight direct-response attribution. The frequency data proves diminishing/negative returns past a moderate exposure band. Measure with incrementality and holdout, not last click.",
          fitForAffiliate: "low",
          humanizeAngle:
            "If used at all, distinctive creative and a memorable point of view outperform generic spots; a fatigued audience rewards a real story over polished filler.",
        },
        {
          key: "ctv-ott",
          name: "Connected TV / OTT",
          whatItIs: "Streaming-delivered video ads on smart TVs and OTT apps, addressable and biddable.",
          typicalKpis: ["CPM", "completion rate (VCR)", "reach", "CPA", "incremental conversions"],
          roiRange:
            "Directional only; CPMs and CPA vary widely by inventory, targeting, and vertical. No single defensible ROAS from the source; validate with your own holdout tests before scaling.",
          successNotes:
            "More addressable and measurable than linear, but still an upper/mid-funnel awareness channel; frequency-fatigue dynamics from linear TV carry over. Guard against the same over-saturation penalty.",
          fitForAffiliate: "medium",
          humanizeAngle:
            "Use human-crafted, story-led creative; a fatigued streaming viewer skips or ignores ~93% of ads (Clutch, mostly passive avoidance), so distinctiveness and honesty win attention.",
        },
        {
          key: "broadcast-radio",
          name: "Broadcast radio",
          whatItIs: "Audio spots on terrestrial AM/FM radio.",
          typicalKpis: ["Reach", "frequency", "CPM", "response/promo-code redemption", "brand recall"],
          roiRange:
            "No verified ROAS in the source; treat as directional awareness spend measured via promo codes, vanity URLs, and incrementality rather than a hero multiple.",
          successNotes:
            "Local reach and trust; hard to attribute precisely. Industry framing that audio is 'the human alternative' comes partly from radio companies (e.g. iHeartMedia), so weight it as interested.",
          fitForAffiliate: "low",
          humanizeAngle:
            "Host-read endorsements and a consistent voice build trust an AI-generated read cannot fake; lean on presenter credibility.",
        },
        {
          key: "streaming-audio-podcasts",
          name: "Streaming audio & podcasts",
          whatItIs: "Ads and host-read sponsorships across music streaming and podcasts.",
          typicalKpis: ["CPM", "promo-code redemption", "listen-through", "CPA", "brand lift"],
          roiRange:
            "Directional; host-read podcast sponsorships can perform well on direct response via promo codes, but reported ROAS is inconsistent and context-dependent. Measure with unique codes and holdout.",
          successNotes:
            "Host trust is the asset; effectiveness concentrates in credible creators with engaged niche audiences. Attribution relies on codes and pixels, both leaky.",
          fitForAffiliate: "medium",
          humanizeAngle:
            "Authentic host endorsement to a niche audience is high-trust and hard to replicate with AI; favor genuine long-term creator relationships over one-off reads.",
        },
        {
          key: "out-of-home",
          name: "Out-of-home (OOH)",
          whatItIs: "Billboards, transit, and place-based ads, increasingly digital (DOOH) and programmatic.",
          typicalKpis: ["Impressions/plays", "reach", "brand lift", "footfall lift", "branded search lift"],
          roiRange:
            "No verified direct-response ROAS; OOH is awareness and salience spend. Programmatic DOOH adds targeting but attribution stays coarse (footfall, branded-search lift, incrementality).",
          successNotes:
            "Commands attention outside an algorithmically filtered feed, part of the experiential/IRL renaissance, but weak for last-click affiliate economics.",
          fitForAffiliate: "low",
          humanizeAngle:
            "Surprise and wit (wildposting, projection takeovers, flash placements) cut through digital fatigue precisely because they are physical and unskippable.",
        },
        {
          key: "print",
          name: "Print",
          whatItIs: "Advertising in newspapers, magazines, and direct mail.",
          typicalKpis: ["Reach", "response rate", "promo-code redemption", "CPA (direct mail)", "brand recall"],
          roiRange:
            "No verified ROAS in the source. Direct mail can be measured via codes and remains a tactile, trust-signaling format; general print is awareness spend with coarse attribution.",
          successNotes:
            "A physical, non-algorithmic touchpoint amid digital fatigue, but costly and slow to test. Direct mail is the only print variant with tight direct-response measurement.",
          fitForAffiliate: "low",
          humanizeAngle:
            "Tangibility itself signals effort and authenticity; a well-crafted physical piece reads as human in a feed full of AI slop.",
        },
      ],
    },
    {
      group: "Paid digital",
      channels: [
        {
          key: "paid-search",
          name: "Paid search / PPC",
          whatItIs: "Bidded text/shopping ads on search-engine results for high-intent queries.",
          typicalKpis: ["ROAS", "CPA", "CTR", "conversion rate", "Quality Score", "EPC"],
          roiRange:
            "Directional ROAS varies widely by vertical, keyword intent, and Quality Score; treat any single multiple as a starting hypothesis to validate, not a benchmark. Watch the structural headwind: zero-click US Google searches rose from ~50% (2019) to ~58-60% (2024) to ~68% (early 2026), and clicks fall when AI summaries appear, so high-intent click volume is under pressure.",
          successNotes:
            "Captures existing demand at the bottom of the funnel, ideal for a performance operator. But search is fracturing into answer engines; pair PPC with GEO/AEO so you remain visible when queries resolve inside an AI without a click.",
          fitForAffiliate: "high",
          humanizeAngle:
            "Landing pages must earn a fatigued, pre-qualified click; distinctive proof, real reviews, and a clear value exchange beat generic AI-written copy that reads as slop.",
        },
        {
          key: "paid-social",
          name: "Paid social",
          whatItIs: "Bidded feed/story/reels ads on Meta, TikTok, and similar platforms.",
          typicalKpis: ["ROAS", "CPA", "CTR", "CPM", "thumb-stop/hook rate", "conversion rate"],
          roiRange:
            "Directional; ROAS is highly creative- and vertical-dependent and decays as creative fatigues. Algorithmic ad systems (e.g. Meta's Andromeda, a self-reported ~10,000x retrieval-model capacity increase with +6% recall / +8% quality on selected segments) accelerate saturation, so refresh cadence matters. Avoid the unsupported 'creative lifespans halved to 2-3 weeks' claim; the direction (shorter lifespans) holds, the precise math does not.",
          successNotes:
            "Core scalable acquisition channel for list-building, but consumers skip/ignore ads at scale and repetitive ads reduce brand favorability (Epsilon 2025: 76% like a brand less after repetition). Manage frequency and creative refresh deliberately.",
          fitForAffiliate: "high",
          humanizeAngle:
            "Human-crafted, story-led, UGC-style creative outperforms obvious AI output; only 48% of consumers like AI-generated ad images and 57% worry about fake/misleading AI ads (Kantar), and 63% say they'd be less likely to buy from a brand using AI-generated ads (Harris Poll). Keep a human in the loop and disclose plainly.",
        },
        {
          key: "display-programmatic",
          name: "Display & programmatic",
          whatItIs: "Automated banner/rich-media buying across the open web via exchanges and DSPs.",
          typicalKpis: ["CPM", "CTR", "viewability", "CPA", "incremental conversions"],
          roiRange:
            "Low and highly variable CTRs; performance depends on inventory quality and targeting. Report ROAS as directional and lean on incrementality, since view-through and last-click both overstate credit.",
          successNotes:
            "Cheap reach and retargeting, but a prime home of the 'dying middle' (mass, generic, interruptive) and ad-blocking exposure (~912M active ad-block users worldwide, Q2 2023). Retargeting still works if frequency-capped.",
          fitForAffiliate: "medium",
          humanizeAngle:
            "Frequency-cap aggressively to avoid the fatigue penalty; use retargeting to continue a genuine conversation, not to bombard.",
        },
        {
          key: "native-content-discovery",
          name: "Native / content discovery (Taboola, Outbrain)",
          whatItIs: "In-feed 'recommended content' ads on publisher sites, a core It's Today Media platform.",
          typicalKpis: ["CPC", "CTR", "conversion rate", "EPC", "ROAS", "CPA"],
          roiRange:
            "Directional; native performance is advertorial- and vertical-dependent, with wide swings in EPC and ROAS. Validate every campaign with its own economics rather than a platform-quoted benchmark.",
          successNotes:
            "Strong for advertorial-driven list-building at scale (the It's Today Media model), but quality and compliance vary by publisher; creative and landing-page fit drive most of the result. Test aggressively and cut fast.",
          fitForAffiliate: "high",
          humanizeAngle:
            "Advertorials must deliver real, useful narrative value, not clickbait or AI slop; genuine storytelling sustains EPC where thin content burns out.",
        },
        {
          key: "affiliate",
          name: "Affiliate & performance partnerships",
          whatItIs: "Revenue- or action-share partnerships where publishers/creators drive tracked conversions.",
          typicalKpis: ["EPC", "conversion rate", "CPA", "AOV", "contribution margin", "ROI"],
          roiRange:
            "Structurally efficient because it is pay-for-performance (cost tied to outcomes), but network-quoted 'average ROI' figures are self-interested; treat as directional and judge on your own realized EPC and margin.",
          successNotes:
            "Core to It's Today Media's model and inherently ROI-aligned. Main risks are attribution overlap, incentivized/low-quality traffic, and fraud; use incrementality and holdout to confirm partners add net-new conversions.",
          fitForAffiliate: "high",
          humanizeAngle:
            "Favor partners with genuine audience trust and a distinctive voice over volume-only arbitrage; trusted recommendations convert and retain better.",
        },
        {
          key: "influencer-creator",
          name: "Influencer / creator",
          whatItIs: "Paid partnerships with creators to reach their audiences, weighted toward mid-tier and nano creators.",
          typicalKpis: ["Engagement rate", "CPA", "promo-code redemption", "conversion rate", "reach"],
          roiRange:
            "Directional; creator ROI is highly variable and often over-attributed. US influencer spend is roughly $43-44B in 2026 (eMarketer, this is spend, not 'industry size'); the popular '90% of budgets to the top 7%' claim is fabricated, so ignore it.",
          successNotes:
            "Trust transfers from creator to brand, strongest with mid-tier, niche, and nano creators treated as long-term partners, not rented billboards (micro/nano are projected ~45.5% of spend). Measure with codes and holdout; beware inflated follower and engagement metrics.",
          fitForAffiliate: "high",
          humanizeAngle:
            "Authentic, in-voice creator content is exactly what AI cannot fake; protect creative authenticity and disclose partnerships honestly to keep the trust intact.",
        },
        {
          key: "retail-media",
          name: "Retail media",
          whatItIs: "Ads on retailer properties (search, PDP, on-site) using retailer first-party purchase data.",
          typicalKpis: ["ROAS", "CPC", "conversion rate", "share of shelf/search", "new-to-brand rate"],
          roiRange:
            "Retailer-reported ROAS tends to look strong partly because it captures bottom-funnel, in-store-intent shoppers (a selection effect); treat platform-quoted ROAS as directional and net out cannibalization of organic sales.",
          successNotes:
            "Closest-to-purchase digital placement with real purchase data, but mostly relevant to brands selling through those retailers; less applicable to a pure list-building affiliate operator. As agentic commerce matures, retailer-controlled surfaces gain leverage.",
          fitForAffiliate: "low",
          humanizeAngle:
            "Even on transactional surfaces, distinctive positioning and honest reviews differentiate against commoditized AI-mediated comparison.",
        },
      ],
    },
    {
      group: "Owned",
      channels: [
        {
          key: "seo",
          name: "SEO (organic search)",
          whatItIs: "Earning unpaid ranking and traffic from traditional search results.",
          typicalKpis: ["Organic sessions", "rankings", "click-through rate", "conversion rate", "assisted conversions"],
          roiRange:
            "High long-run ROI when it compounds, but under structural threat: Gartner projects many brands' organic traffic falls 50%+ by 2028 as AI search grows (a projection scoped to informational-query-dependent sectors), and zero-click sits near ~68% of US Google searches. Treat organic-traffic forecasts as scenario-dependent, not fate.",
          successNotes:
            "Still valuable, but ranking #1 no longer guarantees being seen or cited; the overlap between top-10 rankings and AI citations has fallen sharply (part real, part measurement artifact). Pair SEO with GEO/AEO.",
          fitForAffiliate: "medium",
          humanizeAngle:
            "Proprietary knowledge assets (original research, benchmarks, calculators, templates) stay valuable even when an AI summarizes them; generic AI-written SEO filler does not.",
        },
        {
          key: "geo-aeo",
          name: "GEO / AEO (answer-engine optimization)",
          whatItIs: "Structuring data, entities, and content so LLM answer engines discover, evaluate, and cite the brand.",
          typicalKpis: ["AI citation share", "share of voice in AI answers", "AI-referred sessions", "AI-referred conversion rate", "branded-search lift"],
          roiRange:
            "Too new for a stable ROI figure. AI-referred visitors do convert well (Adobe: ~31% higher conversion, ~33% lower bounce in the 2025 holiday season, rising toward ~42% by March 2026), but this is a high-intent, late-funnel selection effect, not proof the page is more persuasive. Never present multiples like '5x' or '14% vs 2.8%' as like-for-like channel superiority; those come from small, filtered vendor benchmarks.",
          successNotes:
            "First-mover advantage is real but narrowing, especially for SMBs. Heuristics (answer in the first ~60-120 words, keep content fresh, be cited in communities like Reddit) are directional practitioner advice, not validated laws; per-engine citation counts are mode- and engine-dependent.",
          fitForAffiliate: "high",
          humanizeAngle:
            "Being citable rewards genuine expertise and verifiable facts; inspectable proof and a clear point of view are what answer engines and humans both reward.",
        },
        {
          key: "content-blog",
          name: "Content / blog",
          whatItIs: "Owned editorial and educational content that attracts, informs, and converts.",
          typicalKpis: ["Organic sessions", "engaged time", "email/SMS signups", "assisted conversions", "AI citation share"],
          roiRange:
            "ROI is diffuse and long-tail; measure via assisted conversions, signups, and incrementality rather than a direct ROAS. AI has commoditized generic content, so undifferentiated volume yields little.",
          successNotes:
            "Shift from generic production toward proprietary insight and a distinctive point of view; 'AI slop' actively erodes trust and floods feeds. Depth, originality, and proof are the edge.",
          fitForAffiliate: "medium",
          humanizeAngle:
            "Original research, real customer stories, and a clear brand belief are unfakeable; use AI to assist research and drafts, keep the voice and judgment human.",
        },
        {
          key: "email",
          name: "Email",
          whatItIs: "Owned lifecycle and promotional messaging to a consented subscriber list, a primary It's Today Media asset.",
          typicalKpis: ["Open rate", "click-through rate", "conversion rate", "revenue per email", "unsubscribe rate", "LTV"],
          roiRange:
            "Consistently high-ROI owned channel when cadence is disciplined, but avoid quoting a hero ROI multiple; e-commerce email CTR benchmarks realistically run ~1.1% (MailerLite) to ~1.7-3% (Mailchimp and others), and 2025 open rates (~35-45%) are inflated by Apple Mail Privacy Protection. The channel is not collapsing; over-frequency is the failure mode.",
          successNotes:
            "Relevance-calibrated cadence per individual is a cheap, underused edge. Fatigue is real (Optimove: 55% switched brands due to bombardment) yet appetite for useful contact persists (58% want more when useful; 75% value personalization). Restraint and relevance beat retreat; watch that established brands are now top spam-flag targets.",
          fitForAffiliate: "high",
          humanizeAngle:
            "Earn zero-party preferences and segment on them so every send feels chosen, not blasted; a human, specific voice outperforms generic automated copy.",
        },
        {
          key: "sms",
          name: "SMS",
          whatItIs: "Owned, permission-based text messaging to a consented list, a primary It's Today Media asset.",
          typicalKpis: ["Click-through rate", "conversion rate", "opt-out rate", "delivery rate", "revenue per send"],
          roiRange:
            "High immediacy but treat the classic '90-98% open rate' as unmeasurable lore (it reflects ~96-98% deliverability and lock-screen visibility, not confirmed reads). More defensible: SMS CTR ~19-20% and reply rate ~45%, versus email CTR ~2-3%. Directional, from dated vendor origins.",
          successNotes:
            "Consumer tolerance is low and nuanced: 84% are opted into at least one brand's SMS (up from 62% in 2021), but 53% cite 'texting too often' as the top opt-out reason and 49% prefer roughly biweekly promos. A scam-driven 'friction tax' (~$470M lost to text scams in 2024, FTC) erodes trust in legitimate messages.",
          fitForAffiliate: "high",
          humanizeAngle:
            "Treat the opt-in and permission flow as a trust interface; send fewer, more relevant, clearly-from-a-human messages to preserve the list.",
        },
        {
          key: "website-landing-pages",
          name: "Website & landing pages",
          whatItIs: "Owned conversion surfaces where paid and organic traffic is captured and monetized, core It's Today Media assets.",
          typicalKpis: ["Conversion rate", "bounce rate", "EPC", "page speed / Core Web Vitals", "form completion rate"],
          roiRange:
            "No standalone ROI; the landing page is the multiplier on every other channel's ROAS. Small conversion-rate gains compound across all paid spend, so treat CRO as leverage, not a line item.",
          successNotes:
            "Also increasingly an agent-facing surface: clean structured data, machine-readable pricing/policies, and schema help AI agents evaluate and cite you. Build for both the filtering agent and the feeling human.",
          fitForAffiliate: "high",
          humanizeAngle:
            "Real proof (genuine reviews, specifics, a point of view) and honest, human copy convert a fatigued, pre-qualified visitor far better than generic AI-generated pages.",
        },
        {
          key: "app-push",
          name: "App & push notifications",
          whatItIs: "Owned mobile app engagement and push/in-app messaging.",
          typicalKpis: ["Opt-in rate", "push CTR", "retention", "DAU/MAU", "conversion rate", "opt-out rate"],
          roiRange:
            "Directional; push CTR and retention vary widely by category and relevance. High-frequency, low-value push drives opt-outs, so measure net retention, not just click rates.",
          successNotes:
            "Most relevant to brands with a genuine app use case; less applicable to a pure list-building affiliate operator without an app. Same fatigue dynamics as email/SMS apply to notification frequency.",
          fitForAffiliate: "low",
          humanizeAngle:
            "Notifications should feel like a useful nudge from a person who knows the user, triggered by real intent, not scheduled blasts.",
        },
        {
          key: "community-dark-social",
          name: "Community & dark social",
          whatItIs: "Owned/operated communities plus the untracked sharing in DMs, group chats, Slack, and closed servers.",
          typicalKpis: ["Branded-search lift", "direct traffic", "share-button usage", "referral signups", "active members"],
          roiRange:
            "No credible ROI multiple exists; popular figures (e.g. '95% of sharing is dark social', community-led-growth '2.1x revenue / +46% CLV / -32% CAC') are unsourced or fabricated. The nearest real datapoint is ~21% higher revenue growth for firms with dedicated community programs (CMX 2022). Build on trust logic, not false precision.",
          successNotes:
            "A large, unmeasurable share of high-trust sharing happens privately; engineer for frictionless private sharing (one-tap share, pre-written messages, referral hooks) and measure by proxy. Community content also feeds AI answers (Reddit appears in a meaningful share of cited sources).",
          fitForAffiliate: "medium",
          humanizeAngle:
            "This is pure human trust and cannot be automated; show up authentically and make it effortless for real people to pass you along.",
        },
      ],
    },
    {
      group: "Earned",
      channels: [
        {
          key: "digital-pr",
          name: "Digital PR",
          whatItIs: "Earning coverage, mentions, and authoritative links from publications and journalists.",
          typicalKpis: ["Earned placements", "referring domains", "branded search lift", "share of voice", "AI citation share"],
          roiRange:
            "ROI is indirect; value shows up as authority, referral traffic, and increasingly AI-citation eligibility rather than a direct multiple. Measure via branded-search and share-of-voice movement.",
          successNotes:
            "Authoritative, frequently-updated coverage improves both traditional ranking and answer-engine citation (recency and authority both matter). Original data and a genuine point of view earn coverage; press-release spam does not.",
          fitForAffiliate: "medium",
          humanizeAngle:
            "Journalists and answer engines both reward genuine newsworthiness and proprietary insight; a real story beats AI-spun boilerplate.",
        },
        {
          key: "reviews-ugc",
          name: "Reviews & UGC",
          whatItIs: "Customer reviews, ratings, and user-generated content displayed on-site and across platforms.",
          typicalKpis: ["Review volume", "average rating", "conversion rate", "UGC engagement", "return rate"],
          roiRange:
            "UGC genuinely helps conversion, but not by the headline multiple; the cited '+161% conversion / +154% revenue per visitor' is a Bazaarvoice self-selection stat (viewers of UGC vs non-viewers on the same pages), so most of the gap is high-intent selection. Controlled tests typically show single-digit to low-double-digit lifts.",
          successNotes:
            "Review-readers are inherently further down the funnel, so attribute lift with holdouts, not on-page comparisons. Reviews also feed AI evaluation, where agents weigh verifiable ratings heavily.",
          fitForAffiliate: "high",
          humanizeAngle:
            "Real, specific, unedited customer voices are unfakeable proof; never fabricate or over-polish reviews, since authenticity is the entire value.",
        },
        {
          key: "organic-social",
          name: "Organic social",
          whatItIs: "Unpaid brand presence and content on social platforms.",
          typicalKpis: ["Engagement rate", "reach", "follower growth", "saves/shares", "referral traffic"],
          roiRange:
            "Low and declining direct ROI as feeds fill with ads and AI slop (86% of consumers feel they see more ads at the expense of friends' posts, iHeartMedia); treat as a brand/community surface, not a direct-response channel.",
          successNotes:
            "Two-thirds of consumers say social media makes them feel worse and more disconnected, so generic branded posting underperforms. Distinctive voice and genuine community interaction are what still land.",
          fitForAffiliate: "low",
          humanizeAngle:
            "A consistent, human, opinionated voice cuts through slop; automated generic posting is exactly what audiences are fatigued by.",
        },
        {
          key: "referral-wom",
          name: "Referral & word-of-mouth",
          whatItIs: "Programs and mechanics that turn satisfied customers into advocates who recommend the brand.",
          typicalKpis: ["Referral rate", "viral coefficient", "referred conversion rate", "CAC (referred)", "LTV (referred)"],
          roiRange:
            "Structurally efficient (referred customers often convert and retain better), but avoid inflated 'trust' multiples; peer-recommendation trust is ~83-88% (Nielsen 2015/2021), not the older 90%+ figure. Measure realized referred-CAC and LTV.",
          successNotes:
            "Peer recommendation remains the most-trusted format and far outranks paid ads, but the effect is self-reported and hard to measure precisely. Engineer low-friction referral hooks and track by proxy.",
          fitForAffiliate: "high",
          humanizeAngle:
            "People refer brands they genuinely trust; a real relationship and a share-worthy experience drive this, not incentive gimmicks alone.",
        },
      ],
    },
    {
      group: "Emerging",
      channels: [
        {
          key: "ai-agentic-surfaces",
          name: "AI / agentic surfaces & chat",
          whatItIs: "Visibility and transactability inside AI assistants and agent-to-agent commerce (agents transacting on a consumer's behalf).",
          typicalKpis: ["AI citation share", "AI-referred conversion rate", "agent-readable feed coverage", "share of voice in AI answers"],
          roiRange:
            "Real but nascent, with no measurable ROI yet; every headline is a projection (Gartner: $30T machine-influenced purchases by 2030 on 'influence or participate'; McKinsey: up to $1T US / $3-5T global orchestrated by 2030 on a ~18% moderate scenario). Salesforce's ~$262B 'AI-influenced' 2025 holiday online sales counts any order AI touched, not AI-generated revenue. Read all of it as scenario, not booked outcome.",
          successNotes:
            "Protocols (UCP, ACP, AP2, AdCP) are new (2025-2026) with limited proven adoption, promoted by co-creating vendors; real advertiser spend and effectiveness through AI-native surfaces are largely unproven. Prepare with clean data, machine-readable pricing/policies, and real-time feeds; evaluate protocols as they mature.",
          fitForAffiliate: "medium",
          humanizeAngle:
            "Agents evaluate on price, availability, reviews, and verifiable performance, so build enough human loyalty that a person tells their agent to prefer you; brand preference becomes an input agents weigh.",
        },
        {
          key: "xr-spatial",
          name: "XR / spatial computing",
          whatItIs: "Marketing via AR, VR, smart glasses, and ambient/spatial devices.",
          typicalKpis: ["Engagement/dwell time", "activation completions", "reach", "brand lift"],
          roiRange:
            "No marketing ROI benchmark; market figures are forecast-heavy (combined AR/VR projected ~$118.79B in 2026, a forecast not an achieved valuation, growing to ~$693B by 2035). Gartner projects 30% of consumer brand experiences via ambient smart devices by 2028 (a projection).",
          successNotes:
            "Smaller and more speculative than the hype; smart glasses reached roughly half of XR shipments in 2025 but exact splits are conflated forecasts, and named 'installed bases' are often platform-wide, not device-specific. Vendor case studies (e.g. Walmart's 96% training-time cut) are narrow and single-module.",
          fitForAffiliate: "low",
          humanizeAngle:
            "Where it fits, use XR for genuinely novel, memorable experiences a fatigued consumer chooses to engage with, not as a gimmick layer.",
        },
        {
          key: "experiential-irl",
          name: "Experiential / IRL",
          whatItIs: "In-person events, activations, pop-ups, and guerrilla marketing.",
          typicalKpis: ["Attendance", "signups captured", "branded-search lift", "social/earned mentions", "footfall"],
          roiRange:
            "No clean ROI multiple; measure via signups captured, branded-search lift, and earned media rather than a direct return. Intent is strong: ~7 in 10 marketers plan to increase physical/experiential investment (ANA/Harris via Digiday), and 74% of Fortune 1000 marketers expected to raise experiential spend in 2025 (EventTrack).",
          successNotes:
            "The direct antidote to digital fatigue and AI slop; real-world connection is rising (Strava run clubs grew ~3.5x YoY in 2025). Guerrilla tactics command attention outside the filtered feed. Attribution is coarse, so pair with lead-capture and proxies.",
          fitForAffiliate: "medium",
          humanizeAngle:
            "Physical presence and live experience are the most human, least fakeable channel; capture emails/SMS on-site to convert the trust into an owned asset.",
        },
      ],
    },
  ],
} as const;

export type MarketingKnowledge = typeof MARKETING_KNOWLEDGE;
export type ChannelGroup = (typeof MARKETING_KNOWLEDGE)["channelGroups"][number];
export type Channel = ChannelGroup["channels"][number];
export type ChannelFit = Channel["fitForAffiliate"];
