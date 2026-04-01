> Source: `grace-link-server/docs/ssot/11-match-archive-policy.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: backend canonical reference.

# Match Archive Policy

## 목적
- 매치 후 장시간 무응답 상태를 `DELETE` 가 아닌 `ARCHIVED` 정책으로 관리한다.
- 보관함 노출 기간과 완전 비노출 시점을 서버/클라이언트 공통 기준으로 고정한다.

## 정책 요약
- 매치가 `ACCEPTED` 되어 채팅방이 열린 뒤, **48시간 동안 참여자 메시지가 1건도 없으면** 자동으로 `ARCHIVED`
- `ARCHIVED` 된 매치는 **보관 시점부터 7일 동안만** inbox/vault 에 노출
- 7일이 지나면 보관함에서도 완전히 숨김
- `DELETE/DELETED` 상태는 더 이상 정책 상태로 사용하지 않음

## 상태 전이
- Match
  - `PENDING -> ACCEPTED`
  - `ACCEPTED -> ARCHIVED` : 48시간 무응답
  - `PENDING -> REJECTED_REFUNDED`
  - `PENDING -> EXPIRED_REFUNDED_UNSEEN|SEEN`
- Recommendation/Vault Card
  - `ACTIVE -> LOCKED` : 48시간 미열람
  - `ACTIVE|LOCKED|SEEN -> ARCHIVED` : 생성 후 7일 경과
  - `ARCHIVED -> LOCKED` : `/vault/restore`

## 노출 규칙
- `GET /chats`
  - `ARCHIVED` 무응답 채팅방은 노출하지 않음
- `GET /inbox/received`, `GET /inbox/sent`
  - `ARCHIVED` 매치는 `archived_at + 7일` 이전까지만 노출
- `GET /vault`
  - `ARCHIVED` 카드는 `archived_at + 7일` 이전까지만 노출
- 추천 목록
  - 매칭된 상대는 동적 필터로 숨기며 카드 상태를 삭제형 상태로 바꾸지 않음

## 구현 메모
- `응답` 판정은 meaningful 여부와 무관하게 **참여자 메시지 1건 이상**
- `archived_at` 는 매치/카드 각각 별도 보관 시각으로 기록
- 복원(`restore`)은 아직 보이는 `ARCHIVED` 카드에 대해서만 허용
