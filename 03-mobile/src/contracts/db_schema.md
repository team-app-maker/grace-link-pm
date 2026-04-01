> Source: `grace-link-RN/src/contracts/db_schema.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: mobile/source reference.

# GraceLink v7.3 DB Schema Contract

## Principles
- No photo-related fields.
- Manna balances split into paid and bonus.
- Ledger (`transactions`) is source of truth for every balance mutation.

## users
- user_uuid: string (PK)
- ci_hash: string (unique)
- status: SUBMITTED | UNDER_REVIEW | APPROVED | REJECTED | NEEDS_EDIT | SUSPENDED
- paid_manna_balance: number
- bonus_manna_balance: number
- exposure_weight: number
- created_at: string (ISO8601)
- last_active_at: string (ISO8601)

## profiles
- user_uuid: string (PK, FK users.user_uuid)
- nickname: string
- gender: MALE | FEMALE
- birth_year: number
- region_sido: string
- region_sigungu: string
- denomination: string
- church_id: string | null
- church_verified: boolean
- work_verified: boolean
- tags: string[]
- l1_answers_json: Record<string, string>
- l2_answers_json: Record<string, string>
- favorite_verses_json: Array<{ ref: string; reason?: string }>
- favorite_ccm_json: Array<{ title: string; reason?: string }>

## recommendation_cards
- card_id: string (PK)
- viewer_uuid: string
- target_uuid: string
- status: ACTIVE | LOCKED | SEEN | PASSED | DELETED
- created_at: string
- opened_at: string | null
- locked_at: string | null
- deleted_at: string | null
- passed_at: string | null

## unlocks
- unlock_id: string (PK)
- viewer_uuid: string
- target_uuid: string
- unlock_type: L1 | L2 | VERSE_REASON | CCM_REASON
- created_at: string
- unique(viewer_uuid, target_uuid, unlock_type)

## matches
- match_id: string (PK)
- sender_uuid: string
- receiver_uuid: string
- match_type: NORMAL | SUPER
- status: PENDING | ACCEPTED | REJECTED_REFUNDED | EXPIRED_REFUNDED_UNSEEN | EXPIRED_REFUNDED_SEEN
- created_at: string
- responded_at: string | null
- receiver_opened_at: string | null
- expired_at: string | null

## chat_rooms
- chat_id: string (PK)
- match_id: string
- status: OPEN | CLOSED
- created_at: string
- first_msg_deadline_at: string
- reply_deadline_at: string | null

## chat_messages
- msg_id: string (PK)
- chat_id: string
- sender_uuid: string
- body: string
- created_at: string
- meaningful_flag: boolean

## transactions
- tx_id: string (PK)
- user_uuid: string
- currency: MANNA_PAID | MANNA_BONUS
- amount: number
- action_type: SPEND | REFUND | REWARD_AD | PURCHASE | RESTORE | EXTEND | UNLOCK
- related_id: string | null
- meta_json: Record<string, unknown>
- created_at: string

## rewarded_ads
- reward_id: string (PK)
- user_uuid: string
- placement: paywall | my_free_manna | empty_state
- provider: string
- token_hash: string
- amount: number
- verified_at: string

## reports
- report_id: string (PK)
- reporter_uuid: string
- target_uuid: string
- context: profile | chat
- reason: string
- detail: string | null
- created_at: string
- status: OPEN | REVIEWING | CLOSED

## blocks
- block_id: string (PK)
- blocker_uuid: string
- blocked_uuid: string
- created_at: string

## risk_flags
- target_uuid: string (PK)
- risk_level: LOW | HIGH
- flags_json: Array<{ code: string; score: number }>
- matches_json: Array<{ start: number; end: number; text: string }>
- created_at: string

## admin_actions
- action_id: string (PK)
- admin_id: string
- action_type: APPROVE | REJECT | SUSPEND | UNSUSPEND | MASK_TOGGLE
- target_id: string
- reason_code: string
- meta_json: Record<string, unknown>
- created_at: string
