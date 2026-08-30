# Cafe24 공통 작업 구조

`_aisoul`은 Cafe24 기본 파일과 분리하여 관리하는 커스텀 폴더입니다.
현재 공통화가 확인된 파일을 기준으로 사용하며,
그 외 파일은 공통화 여부 확인 후 필요한 항목만 추가합니다.


# 1. `_aisoul`

현재 공통화 확인 범위:

```text
_aisoul/
├─ css/
│  ├─ common.css
│  └─ reset.css
│
├─ import/
│  ├─ board/
│  ├─ main/
│  └─ prod_detail/
│
└─ js/
   └─ board.js
```

## 1-1. import/board
게시판에서 공통으로 사용하는 HTML을 관리합니다.

## 1-2. import/main
메인 화면에 노출되는 공통 섹션을 관리합니다.

## 1-3. import/prod_detail
상품 상세에서 공통으로 사용하는 하단 섹션 구조를 관리합니다.

## 1-4. js/board.js
게시판 공통 JS를 관리합니다.

현재 주요 기능:
- 게시판별 `board_no` 분기
- FAQ 아코디언
- 게시판 공통 UI 처리

FAQ 아코디언의 DOM 의존성 및 적용 방법은 별도 노션 문서를 참고합니다.


# 2. CSS

## 2-1. Font Family
폰트 적용 시 아래 파일의 기존 `font-family` 선언을 확인합니다.
- `/_aisoul/css/reset.css`
- `/layout/basic/css/layout.css`
- `/layout/basic/css/common.css`
- `/layout/basic/css/add_theme01.css`

## 2-2. Button
사용 파일:
- `/layout/basic/css/ec-base-button.css`
- `/layout/basic/css/sub_style.css`
`gBottom`, `gColumn` 등 Cafe24 기본 레이아웃 클래스는 삭제하지 않고,
커스텀 디자인과 충돌하는 스타일만 필요한 범위에서 override 합니다.

## 2-3. Form / Checkbox / Radio / Quantity 등
사용 파일:
- `/layout/basic/css/ec-base-ui.css`
form, checkbox, path, field, radio, quantity, step 등의
공통 UI 스타일을 관리합니다.


# 3. JS

## 3-1. layout.js
사용 파일:
- `/layout/js/layout.js`
Cafe24 기본 `layout.js` 대신 공통화 폴더의 수정된 `layout.js` 코드로 교체하여 사용합니다.
기존 Cafe24 코드에서 발생하는 불필요한 콘솔 에러를 제거하고,
기본 동작을 유지하도록 디버깅한 버전입니다.
> 적용 전 현재 스킨의 `layout.js`에 별도 커스텀 코드가 추가되어 있는지 확인한 뒤 교체합니다.
마지막 업데이트: `260715`