> Source: `grace-link-server/docs/ssot/12-report-review-jwt-authority.md`
> Migrated into `grace-link-pm` on 2026-04-01.
> Status: backend canonical reference.

# Report Review JWT Authority Policy

## 목적
- 신고 알림 채널(Slack)과 실제 승인 권한 경계를 분리한다.
- 최종 신고 승인/거절 authority 를 앱/관리 화면의 Bearer JWT `ROLE_ADMIN` 으로 고정한다.

## 정책 요약
- Slack 은 **신고 알림 + 관리자 화면 진입 링크** 역할만 한다.
- Slack 메시지 클릭만으로 신고 승인/거절이 완료되면 안 된다.
- 실제 신고 승인/거절은 **인증된 관리자 세션**에서만 가능하다.
- 서버는 admin review endpoint 호출 시 JWT principal 의 `ROLE_ADMIN` 을 기준으로 최종 권한을 판정한다.
- Slack canonical review link 는 **`gracelink://admin/reports/{reportId}`** 로 고정한다.

## 권한 경계
- Allowed:
  - Bearer JWT 를 가진 관리자
  - 서버가 `ROLE_ADMIN` 으로 검증한 principal
- Not authoritative:
  - Slack user id
  - Slack channel membership
  - Slack 버튼 클릭 자체

## 목표 흐름
1. 사용자가 `POST /report` 호출
2. 서버가 신고를 `OPEN` 으로 저장
3. Slack 으로 moderation 알림 전송
4. 운영자가 Slack 메시지의 deep link(`gracelink://admin/reports/{reportId}`)를 눌러 앱 관리자 화면 진입
5. 앱/관리 화면이 Bearer JWT 와 함께 `POST /admin/review/report/approve|reject` 호출
6. 서버가 JWT principal 의 `ROLE_ADMIN` 을 검증하고 신고를 최종 처리

## API 원칙
- Canonical moderation authority
  - `POST /admin/review/report/approve`
  - `POST /admin/review/report/reject`
- Slack 관련 surface
  - notify-only
  - canonical deep link: `gracelink://admin/reports/{reportId}`
  - 승인/거절 authority surface 아님

## 감사 원칙
- reviewer 는 internal admin identity 기준으로 기록
- Slack actor 는 운영 편의 정보일 수는 있어도 최종 승인 주체로 간주하지 않음

## 구현 메모
- Slack interactivity callback 은 legacy compatibility 용으로만 유지하며, notify-only 응답만 반환한다.
- Slack 메시지는 관리자 화면 deep link 를 제공하지만 서버 상태를 직접 변경하지 않는다.
- 웹 admin fallback URL 은 이 문서 범위에서 정의하지 않는다.
