> Source: `grace-link-server/docs/ssot/06-rest-api-surface.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: backend canonical reference.

# REST API Surface

이 문서는 현재 구현 기준 REST 엔드포인트를 주제별로 나눈 **빠른 참조표**입니다.
상세 의미는 각 하위 spec 문서를 따릅니다.

## Auth / Onboarding

| Method | Path | Detail |
|---|---|---|
| POST | `/auth/sso/sign-in` | ID token 기반 모바일 로그인 |
| POST | `/auth/sso/code/sign-in` | OAuth code 기반 로그인 |
| POST | `/auth/pass/verify` | PASS 본인인증 검증 + canonical phone hash 저장 |
| POST | `/onboarding/submit` | 온보딩 제출 |
| GET | `/auth/status` | 현재 회원 상태 조회 |
| GET | `/auth/me` | 세션 복구 기준 API |
| POST | `/auth/token/refresh` | token rotation |
| POST | `/auth/logout` | 현재 세션 로그아웃 |
| POST | `/auth/logout-all` | 전체 세션 로그아웃 |

## Profile / Reco / Vault

| Method | Path | Detail |
|---|---|---|
| GET | `/profile/me` | 내 프로필 조회 |
| PATCH | `/profile/me` | 내 프로필 수정 |
| GET | `/profile/detail` | 상대 프로필 + unlock 정보 |
| POST | `/profile/unlock` | 프로필 섹션 unlock |
| GET | `/reco/today` | 오늘 추천 카드 |
| POST | `/reco/extra` | 추가 추천 카드 |
| GET | `/vault` | 볼트 카드 조회 |
| POST | `/card/unlock` | 카드 잠금 해제 |
| POST | `/card/pass` | 카드 pass |
| POST | `/vault/extend` | 볼트 연장 |
| POST | `/vault/restore` | 볼트 카드 복구 |

## Match / Inbox / Chat

| Method | Path | Detail |
|---|---|---|
| POST | `/match/request` | PENDING 매치 생성 |
| POST | `/match/accept` | 매치 수락 + 채팅방 생성 |
| POST | `/match/reject` | 매치 거절 + 환불 처리 |
| GET | `/inbox/received` | 받은 요청 목록 |
| GET | `/inbox/sent` | 보낸 요청 목록 |
| GET | `/chats` | 채팅방 목록 + 메시지 맵 |
| GET | `/chat/{chatId}` | 단일 채팅방 상세 |
| POST | `/chat/leave` | 채팅 종료 |

## Commerce / Safety / Admin

| Method | Path | Detail |
|---|---|---|
| GET | `/shop/packages` | 판매 패키지 조회 |
| POST | `/purchase/verify` | 영수증 검증 |
| POST | `/rewarded-ad/claim` | 광고 보상 지급 |
| GET | `/report/reasons` | 신고 사유 목록 조회 |
| POST | `/report` | 유저 신고 |
| POST | `/block` | 유저 차단 |
| GET | `/filters` | 필터 조회 |
| PATCH | `/filters` | 필터 수정 |
| PUT | `/contacts/me/hashes` | 주소록 해시 스냅샷 교체 |
| DELETE | `/contacts/me/hashes` | 주소록 해시 스냅샷 삭제 |
| GET | `/notifications/preferences` | 푸시 알림 설정 조회 |
| PATCH | `/notifications/preferences` | 푸시 알림 설정 수정 |
| POST | `/v1/push/me` | 현재 회원 대상 Expo test push 발송 |
| GET | `/admin/review/queue` | 리스크 리뷰 큐 |
| GET | `/admin/review/detail` | 리스크 리뷰 상세 |
| GET | `/admin/review/actions` | 관리자 액션 이력 |
| POST | `/admin/review/approve` | 관리자 승인 |
| POST | `/admin/review/reject` | 관리자 반려 |
| POST | `/admin/review/suspend` | 관리자 정지 |
| POST | `/admin/review/unsuspend` | 관리자 정지 해제 |
| POST | `/admin/review/mask` | 관리자 마스킹 토글 |
| POST | `/admin/review/report/approve` | 신고 승인 |
| POST | `/admin/review/report/reject` | 신고 거절 |

## Dev Support

| Method | Path | Detail |
|---|---|---|
| GET | `/dev/admin` | 개발용 DEV 홈 대시보드 페이지 |
| GET | `/dev/admin/users` | 개발용 사용자 관리 페이지 |
| GET | `/dev/admin/chats` | 개발용 채팅방 생성/접속 페이지 |
| GET | `/dev/admin/chats/live` | 개발용 WebSocket 라이브 채팅 페이지 |
| GET | `/dev/admin/system` | 개발용 시스템 작업 페이지 |
| GET | `/dev/admin/users/search` | 개발용 사용자 검색 |
| POST | `/dev/admin/users` | 개발용 단건 사용자 생성 |
| GET | `/dev/admin/chat-lab` | 개발용 라이브 채팅 페이지 레거시 alias |
| GET | `/dev/admin/chats/api/users` | 개발용 채팅 참여자 검색 |
| POST | `/dev/admin/chats/api/rooms/open` | 개발용 채팅방 생성 또는 재사용 |
| GET | `/dev/admin/chats/api/rooms/{chatId}` | 개발용 채팅방 조회 |
| POST | `/dev/admin/chats/api/messages` | 개발용 채팅 랩 메시지 전송 fallback |
| POST | `/dev/admin/chats/api/read` | 개발용 채팅 랩 읽음 처리 fallback |
| POST | `/dev/admin/approve-user` | 개발용 승인 |
| POST | `/dev/admin/grant-manna` | 개발용 만나 충전 |
| POST | `/dev/admin/issue-token-pair` | 개발용 토큰 페어 발급 |
| POST | `/dev/admin/seed-opposite-users` | 개발용 반대 성별 유저 생성 |
| POST | `/dev/admin/seed-users` | 개발용 남녀 유저 일괄 생성 |
| POST | `/dev/admin/accept-match-by-users` | 개발용 유저 쌍 기준 매치 수락 |
| POST | `/dev/admin/reset-all-data` | 개발용 전체 데이터 초기화 |
| POST | `/dev/test/google/id-token` | 개발용 Google 유사 ID token 발급 |
| GET | `/dev/test/google/jwks` | 개발용 JWKS 노출 |
| POST | `/dev/test/google/sign-in` | 개발용 Google test sign-in |
| POST | `/dev/test/google/inspect-token` | 개발용 토큰 inspection |

## Support / Utilities

| Method | Path | Detail |
|---|---|---|
| GET | `/churches/search` | 교회 검색 |
| POST | `/churches` | 교회 등록 |
| GET | `/users/me/manna` | 내 만나 잔액 |
| GET | `/users/{user_uuid}/manna` | 호환용 만나 잔액 경로 |
| POST | `/devices/push-token` | push token 등록 |
| DELETE | `/devices/push-token` | push token 해제 |
| POST | `/slack/interactivity` | Slack interactivity legacy compatibility callback (notify-only, moderation authority 없음) |
| GET | `/login` | 임시 login page |
