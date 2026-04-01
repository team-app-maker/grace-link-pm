> Source: `grace-link-RN/src/contracts/api_contract.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: mobile/source reference.

# GraceLink v7.3 API Contract

## Base
- `Content-Type: application/json`
- Auth header is assumed (`Authorization: Bearer <token>`) in real mode.

## Reco
### GET /reco/today
- 200: `{ cards: RecommendationCard[] }`

### POST /reco/extra
- body: `{ amount: 2 }`
- 200: `{ cards: RecommendationCard[], spent: { currency, amount } }`
- 402: `{ error: 'INSUFFICIENT_MANNA', required: 1 }`

### POST /card/unlock
- body: `{ card_id: string }`
- 200: `{ card: RecommendationCard, spent: { currency, amount: 1 } }`

### POST /card/pass
- body: `{ card_id: string }`
- 200: `{ status: 'PASSED' }`

## Vault
### GET /vault
- 200: `{ cards: RecommendationCard[] }`

### POST /vault/extend
- body: `{ target_uuid: string }`
- 200: `{ expires_at: string, spent: { amount: 1 } }`

### POST /vault/restore
- body: `{ card_id: string }`
- 200: `{ card: RecommendationCard, spent: { amount: 2 } }`

## Unlock
### POST /unlock/l1
- body: `{ target_uuid: string }`
- 200: `{ unlock: UnlockRecord, spent?: { amount: 1 } }`

### POST /unlock/l2
- body: `{ target_uuid: string }`
- 200: `{ unlock: UnlockRecord, spent?: { amount: 2 } }`

### POST /unlock/reason
- body: `{ target_uuid: string, reason_type: 'VERSE_REASON' | 'CCM_REASON' }`
- 200: `{ unlock: UnlockRecord, spent?: { amount: 1 } }`

## Match / Inbox
### POST /match/request
- body: `{ receiver_uuid: string, match_type: 'NORMAL' | 'SUPER' }`
- 200: `{ match: MatchRecord, spent: { amount: 3 | 6 } }`

### POST /match/accept
- body: `{ match_id: string }`
- 200: `{ match: MatchRecord, chat_room_id: string, spent?: { amount: 3 } }`

### POST /match/reject
- body: `{ match_id: string }`
- 200: `{ match: MatchRecord, refund_to_sender: { amount: number } }`

### GET /inbox/received
- 200: `{ items: MatchRecord[] }`

### GET /inbox/sent
- 200: `{ items: MatchRecord[] }`

## Chat
### GET /chats
- 200: `{ rooms: ChatRoom[], messagesByRoom: Record<string, ChatMessage[]> }`

### POST /chat/send
- body: `{ chat_id: string, body: string }`
- 200: `{ message: ChatMessage, meaningful_flag: boolean }`

## Shop / Purchase
### GET /shop/packages
- 200: `{ packages: Array<{ package_id: string; manna_amount: number; price: string }> }`

### POST /purchase/verify
- body: `{ package_id: string, receipt: string }`
- 200: `{ granted: { currency: 'MANNA_PAID', amount: number }, tx_id: string }`

## Rewarded Ads
### POST /rewarded-ad/claim
- body: `{ placement: 'paywall' | 'my_free_manna' | 'empty_state', reward_token: string }`
- 200: `{ granted: { currency: 'MANNA_BONUS', amount: 1 }, tx_id: string }`
- 429: `{ error: 'AD_COOLDOWN' | 'AD_DAILY_CAP_REACHED' }`
- 403: `{ error: 'NOT_APPROVED' | 'TOKEN_INVALID' }`

## Safety
### POST /report
- body: `{ target_uuid: string, context: 'profile' | 'chat', reason: string, detail?: string }`
- 201: `{ report_id: string }`

### POST /block
- body: `{ target_uuid: string }`
- 201: `{ block_id: string }`

## Admin
### GET /admin/review/queue
- 200: `{ low_risk: RiskFlag[], high_risk: RiskFlag[] }`

### GET /admin/review/detail?target_uuid=
- 200: `{ profile: Profile, risk: RiskFlag }`

### POST /admin/review/approve
- body: `{ target_uuid: string, reason_code?: string }`
- 200: `{ ok: true }`

### POST /admin/review/reject
- body: `{ target_uuid: string, reason_code: string }`
- 200: `{ ok: true }`
