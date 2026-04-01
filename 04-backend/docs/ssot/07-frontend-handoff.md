> Source: `grace-link-server/docs/ssot/07-frontend-handoff.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: backend canonical reference.

# Frontend Handoff (Canonical)

이 문서는 RN/웹 프론트가 서버 계약을 구현할 때 바로 확인하는 **실행 체크리스트**입니다.

## 인증 / 세션
- 보호 API는 `Authorization: Bearer <access_token>` 로 호출
- 세션 복구는 `GET /auth/me`
- 토큰 재발급은 `POST /auth/token/refresh`
- `user_uuid` fallback 을 공식 계약으로 가정하지 않기

## 매치 / 인박스
- `POST /match/request` 성공 직후 채팅방이 생긴다고 가정하지 않기
- `requestMatch.response.chat_room` 은 `null` 가능
- pending 상태는 inbox/sent 에서 관리
- `POST /match/accept` 성공 시점에만 채팅 진입 처리

## 채팅
- `GET /chats` 는 수락된 채팅만 노출된다고 가정
- `match.accepted` 이벤트를 새 채팅방 생성 이벤트로 처리
- 메시지 전송은 WebSocket `chat.send` 만 사용
- 실시간 fallback REST/SSE 경로는 없다고 가정
- `chat.room.closed` 수신 시 입력창 비활성화

## 결제 / 광고 / 안전
- purchase/reward claim 실패 코드를 그대로 노출 가능한 UX로 매핑
- report/block 이후 목록/노출/채팅 상태 갱신 고려
- 주소록 필터는 raw 번호가 아니라 **정규화된 전화번호 SHA-256 hex** 목록을 `PUT /contacts/me/hashes` 로 전체 교체 업로드
- 연락처 동기화 해제 또는 권한 철회 시 `DELETE /contacts/me/hashes` 호출
- `exclude_same_church`, `exclude_contacts` 토글은 추천만이 아니라 프로필 상세/매치 요청 visibility 에도 영향 준다고 가정

## 문서 사용 규칙
- 이 체크리스트는 구현 action item 용 문서
- API 계약 상세는 `03~06` 문서를 우선 참조
- 화면 기획/우선순위는 `01-product-prd.md`, `02-user-stories.md` 를 참조
