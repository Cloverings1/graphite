# Graphite

> **Domain:** graphite.io  
> **Tagline:** Your files, faster.  
> **Position:** Premium cloud storage for creators, founders, and startups who refuse to wait.

---

## Brand Identity

### Core Promise
Blazing fast cloud storage. No throttling. No limits. Your full internet speed, every time.

### Personality
- Confident, not arrogant
- Minimal, not empty
- Premium, not pretentious
- Technical credibility without jargon

### Visual Identity
- **Mode:** Dark mode only (toggle optional, but dark is default/hero)
- **Aesthetic:** Minimal luxury. Think Linear, Vercel, Raycast.
- **Colors:** 
  - Background: Deep charcoal (#0a0a0a) to near-black
  - Accent: Single accent color (consider subtle blue, white, or graphite gray)
  - Text: Off-white (#fafafa) for primary, muted gray for secondary
- **Typography:** Clean sans-serif. Inter, SF Pro, or similar.
- **Spacing:** Generous whitespace. Let elements breathe.

### Voice & Tone
- Short sentences. 
- No fluff.
- Lead with speed.
- Let the product speak.

**Good:** "5GB uploaded in 47 seconds."  
**Bad:** "Experience lightning-fast upload speeds with our revolutionary cloud infrastructure!"

---

## The Problem We Solve

Dropbox and Google Drive throttle uploads to 10-15 Mbps regardless of your connection speed. For creators working with large files — video projects, RAW photos, design assets — this is unacceptable.

A 10GB Premiere Pro project takes 15+ minutes on Dropbox.  
On Graphite, it takes under 2 minutes.

**Target Users:**
- Video editors and YouTubers
- Photographers (RAW files, large catalogs)
- Design agencies and freelancers
- SaaS founders and developers
- Small creative studios (2-10 people)
- Anyone in Texas (low latency positioning)

---

## Technical Architecture

### Infrastructure (Proof of Concept: 3-10 Users)

**Server:** OVH Dedicated Server in Dallas, TX
- Advance-1 or equivalent (~$90-150/mo)
- 2x 512GB NVMe in RAID 1 (~500GB usable)
- 64GB RAM minimum
- 1Gbps unmetered (upgradeable to 3Gbps)

**Why Dallas:**
- Low latency to Texas-based target market
- Marketing angle: "Your files, stored in Texas"
- OVH Dallas has excellent peering

### Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Frontend | Next.js 14+ App Router | React Server Components, dark mode |
| Styling | Tailwind CSS | Custom dark theme |
| Auth | Clerk or Auth0 | Simple, secure, handles everything |
| Upload Protocol | tus.io | Resumable, chunked, parallel uploads |
| Upload Client | Uppy | Pairs with tus, great DX |
| Backend | Node.js or Go | Go for performance at scale |
| Database | PostgreSQL | Users, file metadata, billing |
| Storage | Direct NVMe | Files organized by user UUID |
| CDN/Proxy | Cloudflare (optional) | DDoS protection, caching static assets |

### How We Achieve Full Speed

1. **Chunked Parallel Uploads** — Files split into chunks, uploaded across 6-10 simultaneous connections
2. **tus.io Protocol** — Resumable uploads, survives connection drops
3. **No Server-Side Throttling** — Unlike Dropbox/Google, we don't rate limit
4. **NVMe Storage** — Fast disk writes, no spinning rust bottleneck
5. **Dedicated Hardware** — No noisy neighbors, predictable performance

**Target Performance:** 800-950 Mbps real-world on gigabit connections (10x+ faster than Dropbox)

---

## Pricing Structure

Three tiers. Simple. No hidden fees. No per-GB transfer charges.

| | **Creator** | **Pro** | **Studio** |
|---|-------------|---------|------------|
| **Price** | $12/mo | $29/mo | $79/mo |
| **Storage** | 100 GB | 500 GB | 2 TB |
| **Transfer** | Unlimited | Unlimited | Unlimited |
| **Speed** | Full speed | Full speed | Full speed |
| **Users** | 1 | 1 | 5 seats |
| **Support** | Email | Priority email | Dedicated support |
| **Features** | Core features | + File versioning | + Versioning + API access |
| **Annual** | $10/mo (billed yearly) | $24/mo (billed yearly) | $66/mo (billed yearly) |

### Why This Pricing Works
- **Creator** — Entry point, cheaper than Dropbox Plus ($12 vs $12 but faster)
- **Pro** — Money maker, hits freelancer/solopreneur sweet spot
- **Studio** — Captures small teams without enterprise complexity

### Unit Economics
Single OVH box ($90-150/mo) becomes profitable at ~8-10 users. Scale by adding boxes as needed.

---

## Product — Landing Page

### Structure

```
┌─────────────────────────────────────────────────────────────┐
│  NAVBAR                                                      │
│  [Logo: Graphite]                    [Login] [Get Started]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  HERO SECTION                                                │
│                                                              │
│  Your files, faster.                                         │
│                                                              │
│  Cloud storage that actually uses your internet speed.       │
│  No throttling. No limits. Just fast.                        │
│                                                              │
│  [Get Started — Free Trial]    [See it in action ↓]         │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  SPEED DEMO / ANIMATION                              │    │
│  │  Visual showing upload speed comparison              │    │
│  │  Dropbox: 12 Mbps ████░░░░░░░░░░░░░░░░              │    │
│  │  Graphite: 940 Mbps ████████████████████            │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  SOCIAL PROOF (once you have it)                            │
│  "Trusted by creators at [logos]"                           │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  FEATURES — Three columns, minimal                          │
│                                                              │
│  ⚡ Blazing Fast        🔒 Private & Secure    📁 Simple    │
│  Max out your           End-to-end             Drag. Drop.  │
│  connection.            encryption.            Done.        │
│  Every time.            Your files, yours.                  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  THE SPEED SECTION                                          │
│                                                              │
│  "5GB uploaded in 47 seconds."                              │
│                                                              │
│  While Dropbox and Google Drive throttle you to 10-15       │
│  Mbps, Graphite lets you use your full connection.          │
│                                                              │
│  Got gigabit? Use it.                                        │
│                                                              │
│  [Screen recording / demo embed]                            │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PRICING SECTION                                            │
│                                                              │
│  Simple pricing. Unlimited transfers.                       │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │ Creator  │  │   Pro    │  │  Studio  │                  │
│  │  $12/mo  │  │  $29/mo  │  │  $79/mo  │                  │
│  │  100 GB  │  │  500 GB  │  │   2 TB   │                  │
│  │          │  │ POPULAR  │  │ 5 seats  │                  │
│  │ [Start]  │  │ [Start]  │  │ [Start]  │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
│                                                              │
│  All plans include: Unlimited transfer, full speed,         │
│  drag & drop uploads, file sharing, 14-day free trial       │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  FAQ (Accordion style)                                      │
│                                                              │
│  > How is Graphite faster than Dropbox?                     │
│  > Where is my data stored?                                 │
│  > Is there a file size limit?                              │
│  > Can I cancel anytime?                                    │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  FINAL CTA                                                  │
│                                                              │
│  Ready to stop waiting?                                     │
│  [Get Started — 14 Day Free Trial]                          │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  FOOTER                                                     │
│  Graphite                                                   │
│  [Twitter] [GitHub]                                         │
│  Privacy · Terms · Contact                                  │
│  © 2025 Graphite                                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Product — Dashboard / Web App

### Layout

```
┌────────────────────────────────────────────────────────────────────┐
│  SIDEBAR (Left, ~240px)           MAIN CONTENT AREA                │
│  ┌──────────────────────┐  ┌────────────────────────────────────┐  │
│  │                      │  │                                    │  │
│  │  [Graphite Logo]     │  │  UPLOAD ZONE (Center)              │  │
│  │                      │  │  ┌──────────────────────────────┐  │  │
│  │  ─────────────────   │  │  │                              │  │  │
│  │                      │  │  │   Drag files here            │  │  │
│  │  📁 All Files        │  │  │   or click to browse         │  │  │
│  │  ⭐ Starred          │  │  │                              │  │  │
│  │  🕐 Recent           │  │  │   [  Upload Files  ]         │  │  │
│  │  🗑️ Trash            │  │  │                              │  │  │
│  │                      │  │  └──────────────────────────────┘  │  │
│  │  ─────────────────   │  │                                    │  │
│  │                      │  │  RECENT UPLOADS (Below)            │  │
│  │  FOLDERS             │  │  ┌──────────────────────────────┐  │  │
│  │  📂 Projects         │  │  │ video-final-v3.mp4    2.3GB  │  │  │
│  │  📂 Assets           │  │  │ uploaded 2 min ago           │  │  │
│  │  📂 Exports          │  │  ├──────────────────────────────┤  │  │
│  │  + New Folder        │  │  │ shoot-raw-files.zip   890MB  │  │  │
│  │                      │  │  │ uploaded 1 hour ago          │  │  │
│  │  ─────────────────   │  │  ├──────────────────────────────┤  │  │
│  │                      │  │  │ client-deck.pdf       12MB   │  │  │
│  │  STORAGE             │  │  │ uploaded yesterday           │  │  │
│  │  ████████░░ 340GB    │  │  └──────────────────────────────┘  │  │
│  │  of 500GB used       │  │                                    │  │
│  │                      │  │                                    │  │
│  │  [Upgrade Plan]      │  │                                    │  │
│  │                      │  │                                    │  │
│  │  ─────────────────   │  │                                    │  │
│  │                      │  │                                    │  │
│  │  [Settings]          │  │                                    │  │
│  │  [Help]              │  │                                    │  │
│  │  [Log Out]           │  │                                    │  │
│  │                      │  │                                    │  │
│  └──────────────────────┘  └────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

### Dashboard Features (MVP)
- Drag & drop upload zone (prominent, center)
- Real-time upload progress with speed indicator
- File browser (list view, grid view toggle)
- Folder creation and organization
- File sharing (generate link)
- Storage usage indicator
- Recent uploads list
- Search
- Settings (account, billing, password)

### Dashboard Features (Post-MVP)
- File versioning (Pro+)
- Team management (Studio)
- API key generation (Studio)
- Bulk operations
- Keyboard shortcuts
- Desktop app (Electron or native)

---

## Marketing Angles

### Primary Message
**Speed.** Everything else is secondary.

### Secondary Messages
1. **Privacy** — Your files stored in Dallas, not scattered across random AWS regions
2. **Simplicity** — No bloat, no "smart" features you don't need
3. **For Creators** — Built for people who work with large files daily

### Demo Content
- Screen recording: Upload a 5GB file in under a minute
- Side-by-side comparison: Dropbox vs Graphite same file
- Speed test results showing 900+ Mbps

### Launch Channels
1. **Product Hunt** — Lock down the graphite.io listing
2. **Twitter/X** — Build in public, share progress
3. **Indie Hackers** — Community loves this kind of product
4. **YouTube creator communities** — They feel this pain daily
5. **r/editors, r/videography, r/photography** — Target audience

---

## Roadmap

### Phase 1: Foundation (Weeks 1-4)
- [ ] Set up OVH dedicated server in Dallas
- [ ] Configure NVMe storage, security, backups
- [ ] Build auth flow (Clerk)
- [ ] Implement tus.io upload pipeline
- [ ] Basic file storage and retrieval
- [ ] Simple dashboard with upload + file list

### Phase 2: Polish (Weeks 5-8)
- [ ] Full dashboard UI (dark mode, beautiful)
- [ ] File sharing (generate links)
- [ ] Folder organization
- [ ] Landing page
- [ ] Stripe billing integration
- [ ] Storage limits by plan

### Phase 3: Launch (Weeks 9-10)
- [ ] Coming soon page with waitlist
- [ ] Private beta (3-10 users)
- [ ] Gather feedback, fix bugs
- [ ] Product Hunt launch
- [ ] Public launch

### Phase 4: Scale (Post-Launch)
- [ ] File versioning
- [ ] Team features
- [ ] API access
- [ ] Desktop app
- [ ] Additional data center locations

---

## Key Metrics to Track

- **Upload speed delivered** (avg Mbps per user)
- **MRR** (Monthly Recurring Revenue)
- **Churn rate** 
- **Storage utilization per server**
- **Cost per GB stored**
- **Customer acquisition cost**
- **Time to first upload** (onboarding friction)

---

## Competitive Positioning

| Feature | Dropbox | Google Drive | Graphite |
|---------|---------|--------------|----------|
| Upload Speed | ~15 Mbps | ~15 Mbps | 900+ Mbps |
| Dark Mode | Partial | No | Yes (default) |
| Pricing (500GB) | $12/mo (2TB) | $3/mo (100GB) | $29/mo |
| Target User | Everyone | Everyone | Creators/Founders |
| Data Location | Unknown | Unknown | Dallas, TX |
| Bloat | High | High | None |

**We don't compete on price. We compete on speed and experience.**

---

## Open Questions

- [ ] End-to-end encryption: Full E2EE or at-rest only?
- [ ] Free tier: Offer one or go straight paid?
- [ ] Desktop app: Electron, Tauri, or native?
- [ ] Mobile: PWA first or native apps?
- [ ] Backup strategy: RAID + offsite? Second datacenter?

---

## Resources & References

- [tus.io](https://tus.io) — Resumable upload protocol
- [Uppy](https://uppy.io) — Upload client library
- [OVH Dedicated Servers](https://www.ovhcloud.com/en/bare-metal/) — Infrastructure
- [Clerk](https://clerk.com) — Authentication
- [Linear](https://linear.app) — Design inspiration
- [Vercel](https://vercel.com) — Design inspiration
- [Raycast](https://raycast.com) — Design inspiration

---

*Last updated: December 2024*  
*Domain: graphite.io*  
*Status: Building*
