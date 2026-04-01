> Source: `grace-link-server/docs/ssot/13-db-design-and-constraints.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: backend canonical reference.

# 13. Server DB Design

작성 기준:
- 기준 시점: 2026-03-30
- 스캔 대상
  - `src/main/kotlin/com/gracelink/server/domain/*.kt`
  - `src/main/kotlin/com/gracelink/server/domain/auth/*.kt`
  - `src/main/resources/db/migration/V1~V15.sql`

## 1) DB 스키마 전체 개요

서버는 JPA 엔티티 3개 묶음(`domain`, `domain/auth`, `FeatureEntities`)과 Flyway 마이그레이션(V1~V15)으로 구성된다.

- 사용자 계정 축: `users`, `profiles`, `churches`, `members`, `member_oauth_accounts`, `member_tokens`
- 인증/토큰 축: `user_access_tokens`, `member_tokens`
- 매칭/뷰/차단 축: `recommendation_cards`, `unlock_records`, `match_records`, `block_records`
- 채팅 축: `chat_rooms`, `chat_messages`
- 알림/푸시 축: `notification_records`, `notification_preferences`, `device_push_tokens`, `push_delivery_records`
- 레포트/어드민 축: `report_records`, `admin_action_records`
- 결제/보상/뱅크축: `vault_events`, `purchase_records`, `rewarded_ad_records`
- 연락처 기반 필터링 축: `user_filter_settings`, `user_contact_hashes`

## 2) 엔티티 기반 테이블 스펙

### users
- PK: `user_uuid`
- 주요 컬럼: `status`, `paid_manna_balance`, `bonus_manna_balance`, `sso_provider`, `sso_subject`, `pass_verified`, `pass_verified_at`, `created_at`, `last_active_at`
- 제약/인덱스: `uq_users_sso_identity`

### profiles
- PK: `user_uuid`
- 주요 컬럼: `nickname`, `gender`, `birth_year`, `region_sido`, `region_sigungu`, `denomination`, `church_id`, `church_verified`, `work_verified`, `tags_json`, `l1_answers_json`, `l2_answers_json`, `favorite_verses_json`, `favorite_ccm_json`, `phone_hash`
- 제약/인덱스: `idx_profiles_phone_hash`, `idx_profiles_gender_user_uuid`
- 비고: `church_id`는 canonical church id 또는 legacy 자유입력 문자열이 함께 존재할 수 있어 앱 레벨 canonicalization이 중요하다.

### churches
- PK: `church_id`
- 주요 컬럼: `name`, `name_normalized`, `denomination`, `region_sido`, `region_sigungu`, `created_at`
- 제약/인덱스: `uq_churches_identity`

### recommendation_cards
- PK: `card_id`
- 주요 컬럼: `viewer_uuid`, `target_uuid`, `status`, `created_at`, `opened_at`, `locked_at`, `deleted_at`, `passed_at`, `archived_at`
- 제약/인덱스: `idx_recommendation_cards_viewer`, `idx_recommendation_cards_viewer_created_at`
- 비고: `deleted_at`는 legacy 컬럼이며 현재 운영 정책은 `ARCHIVED`를 사용한다.

### unlock_records
- PK: `unlock_id`
- 주요 컬럼: `viewer_uuid`, `target_uuid`, `unlock_type`, `created_at`
- 제약/인덱스: `uq_unlock_records_triplet`

### match_records
- PK: `match_id`
- 주요 컬럼: `sender_uuid`, `receiver_uuid`, `match_type`, `status`, `created_at`, `responded_at`, `receiver_opened_at`, `expired_at`, `archived_at`
- 제약/인덱스: `idx_match_receiver`, `idx_match_sender`

### chat_rooms
- PK: `chat_id`
- 주요 컬럼: `match_id`, `status`, `created_at`, `first_msg_deadline_at`, `reply_deadline_at`, `sender_last_read_at`, `receiver_last_read_at`
- 제약/인덱스: `uq_chat_rooms_match`

### chat_messages
- PK: `msg_id`
- 주요 컬럼: `chat_id`, `sender_uuid`, `body`, `created_at`
- 비고: `meaningful_flag`는 v12에서 제거되었다.

### report_records
- PK: `report_id`
- 주요 컬럼: `reporter_uuid`, `target_uuid`, `context`, `reason_code`, `reason`, `detail`, `status`, `created_at`, `reviewed_at`, `reviewed_by`, `slack_channel_id`, `slack_message_ts`
- 제약/인덱스: `idx_report_target`, `idx_report_records_reporter_target`

### block_records
- PK: `block_id`
- 주요 컬럼: `blocker_uuid`, `blocked_uuid`, `created_at`
- 제약/인덱스: `uq_block_pair`

### user_filter_settings
- PK: `user_uuid`
- 주요 컬럼: `exclude_contacts`, `exclude_same_church`, `exclude_same_company`

### admin_action_records
- PK: `action_id`
- 주요 컬럼: `action_type`, `target_id`, `reason_code`, `masked`, `created_at`
- 제약/인덱스: `idx_admin_action_target`

### rewarded_ad_records
- PK: `reward_id`
- 주요 컬럼: `user_uuid`, `placement`, `provider`, `token_hash`, `amount`, `verified_at`
- 제약/인덱스: `uq_rewarded_ad_token`

### purchase_records
- PK: `tx_id`
- 주요 컬럼: `user_uuid`, `package_id`, `receipt_hash`, `amount`, `created_at`
- 제약/인덱스: `uq_purchase_records_receipt_hash`

### vault_events
- PK: `event_id`
- 주요 컬럼: `user_uuid`, `target_uuid`, `card_id`, `action_type`, `week_key`, `created_at`
- 제약/인덱스: `idx_vault_events_user`, `idx_vault_events_user_action_created_at`

### notification_records
- PK: `notification_id`
- 주요 컬럼: `recipient_uuid`, `actor_uuid`, `event_type`, `title`, `body`, `chat_id`, `match_id`, `deep_link`, `payload_json`, `read_at`, `created_at`
- 제약/인덱스: `idx_notification_records_recipient_uuid_created_at`

### notification_preferences
- PK: `user_uuid`
- 주요 컬럼: `match_enabled`, `chat_enabled`, `system_enabled`, `updated_at`, `created_at`

### device_push_tokens
- PK: `token_id`
- 주요 컬럼: `user_uuid`, `push_token`, `platform`, `device_name`, `updated_at`, `created_at`
- 제약/인덱스: `uq_device_push_tokens_push_token`, `idx_device_push_tokens_user_uuid`

### push_delivery_records
- PK: `delivery_id`
- 주요 컬럼: `notification_id`, `recipient_uuid`, `category`, `push_token`, `status`, `ticket_id`, `error_code`, `error_message`, `response_json`, `receipt_checked_at`, `created_at`, `updated_at`
- 제약/인덱스: `idx_push_delivery_records_notification_id`, `idx_push_delivery_records_status_ticket_id`

### user_contact_hashes
- PK: `contact_hash_id`
- 주요 컬럼: `user_uuid`, `contact_hash`, `created_at`
- 제약/인덱스: `uq_user_contact_hashes_user_hash`, `idx_user_contact_hashes_hash`

### members / member_oauth_accounts / member_tokens / user_access_tokens
- 인증과 세션 관리용 보조 테이블이다.
- 주요 인덱스: `uq_member_oauth_provider_subject`, `uq_member_tokens_hash`, `idx_member_tokens_session_id`, `idx_member_tokens_member_id`, `idx_user_access_tokens_user`

## 3) 핵심 관계

- `users` 1:1 `profiles`
- `users` 1:N `recommendation_cards`, `match_records`, `unlock_records`, `report_records`, `block_records`, `notification_records`, `device_push_tokens`, `vault_events`
- `match_records` 1:1 `chat_rooms`
- `chat_rooms` 1:N `chat_messages`
- `notification_records` 1:N `push_delivery_records`
- `members` 1:N `member_oauth_accounts`, `member_tokens`

## 4) 마이그레이션 포인트

- `V4`: `users.pass_verified`, `users.pass_verified_at` 추가
- `V5`: `purchase_records.receipt_hash` 유니크 인덱스
- `V6`: `users(sso_provider, sso_subject)` 유니크 인덱스
- `V10`: `chat_rooms.sender_last_read_at`, `chat_rooms.receiver_last_read_at` 추가
- `V11`: `recommendation_cards.archived_at`, `match_records.archived_at` 추가
- `V12`: `chat_messages.meaningful_flag` 제거
- `V13`: `report_records.reviewed_at`, `reviewed_by`, `slack_channel_id`, `slack_message_ts` 추가
- `V14`: `profiles.phone_hash` 및 `user_contact_hashes` 추가
- `V15`: recommendation/filter 조회용 인덱스 추가

## 5) 구현/운영 시 주의

1. 시간 컬럼이 문자열 기반이므로 포맷 일관성이 중요하다.
2. recommendation/filter 조회는 앱 레벨 상태 전이와 인덱스 조합에 크게 의존한다.
3. 교회 필터는 canonical church id와 legacy 자유입력 교회명을 함께 다루므로 비교 시 canonicalization이 필요하다.
4. Slack 신고 승인 권한은 DB 컬럼(`reviewed_by`, `reviewed_at`)은 유지하되 authority는 Bearer JWT 관리자 경로에만 둔다.
5. `recommendation_cards.deleted_at`는 legacy 흔적이므로 신규 정책 변경 시 `ARCHIVED` 흐름과 함께 검토해야 한다.
