# 전역 페이지 로딩 페이드인 + 헤더 장바구니 카운트 노출

카페24 `layout.html`에 전역으로 박아두는 코드입니다. 페이지 진입 시
`#wrap`을 잠깐 투명 처리해뒀다가 로딩이 끝나는 시점에 살짝 페이드인시켜서,
리소스(카페24 코어스크립트, 스킨 렌더링 등)가 채워지는 과정에서 생기는
깜빡임/어색한 순간 노출(FOUC)을 가려주는 용도입니다. 같은 파일 안에
헤더 장바구니 개수 뱃지를 값이 채워질 때까지 숨겨주는 로직도 함께 있습니다.

## 파일

```
global-page-loading/
├── README.md
└── global-page-loading.snippet.html   # style + script 3종, layout.html에 그대로 삽입
```

CSS/JS를 따로 분리하지 않고 한 스니펫에 합쳐둔 이유: 이 코드는 **최대한 빨리,
렌더링 전에** 실행돼야 효과가 있는 크리티컬 인라인 코드라서, 외부 파일로
분리해 별도 네트워크 요청을 만들면 오히려 타이밍이 늦어져 FOUC를 못 막습니다.
그래서 `<head>` 상단에 인라인으로 그대로 붙여넣는 방식을 유지합니다.

## 구성 3단계

### 1) `is-page-loading` 클래스 동기 추가 (첫 번째 `<script>`)

```html
<script>document.documentElement.classList.add('is-page-loading');</script>
```

페이지 파싱이 이 지점에 도달하는 즉시(동기적으로) `<html>`에 클래스를 붙입니다.
`defer`/`async` 없이, **`<head>` 최상단**에 위치해야 아래 스타일이 적용되기
전에 `#wrap`이 이미 숨겨진 상태로 첫 페인트가 이루어집니다. 이 스크립트가
늦게 실행되면 잠깐이라도 콘텐츠가 다 드러난 화면이 먼저 보였다가 사라지는
역효과가 납니다.

### 2) 스타일 (opacity 트랜지션)

```css
html.is-page-loading #wrap {opacity: 0;}
#wrap {opacity: 1;transition: opacity 0.2s ease;}
html.is-page-loaded #wrap {opacity: 1;}
@media (prefers-reduced-motion: reduce) {#wrap {transition: none;}}
```

- `is-page-loading` 상태: `#wrap` 투명.
- 로딩이 끝나 `is-page-loaded`가 붙으면(또는 애초에 `is-page-loading`이
  없으면) `opacity: 1`로, `transition`을 통해 서서히 나타남.
- `prefers-reduced-motion: reduce` 환경에서는 트랜지션 없이 즉시 노출.

### 3) 로딩 완료 감지 + 페이드인 (두 번째 `<script>`)

```js
var fallbackTimer = window.setTimeout(showPage, 2000);

function showPage() {
    window.clearTimeout(fallbackTimer);
    document.documentElement.classList.remove('is-page-loading');
    document.documentElement.classList.add('is-page-loaded');
}
```

- `DOMContentLoaded` 시점(또는 스크립트 실행 시 이미 로딩이 끝난 상태라면
  즉시)에 `is-page-loading`을 떼고 `is-page-loaded`를 붙여 `#wrap`을
  페이드인시킵니다.
- `DOMContentLoaded`가 어떤 이유로든 지연되거나 안 터지는 경우를 대비해
  **2000ms 폴백 타이머**로 강제 노출.
- `pageshow` 이벤트에서 `event.persisted`(브라우저 뒤로/앞으로 가기로
  bfcache에서 페이지가 복원된 경우)를 감지해 다시 `showPage()`를 호출합니다.
  이 처리가 없으면, 뒤로가기로 돌아왔을 때 이미 실행된 스크립트가 다시
  안 돌아서 `#wrap`이 계속 숨김 상태로 남는 경우가 생길 수 있습니다.

### 4) 헤더 장바구니 카운트 노출 (세 번째 `<script>`)

```js
var el = document.getElementById('xans_myshop_basket_cnt');
...
new MutationObserver(reveal).observe(el, {
    childList: true,
    characterData: true,
    subtree: true
});
```

- 카페24 헤더의 장바구니 개수(`#xans_myshop_basket_cnt`)는 코어스크립트가
  비동기로 채워 넣기 때문에, 페이지 로드 직후엔 빈 값/0으로 잠깐 보였다가
  실제 값으로 바뀌는 깜빡임이 생깁니다.
- `MutationObserver`로 그 요소의 텍스트 변경을 감지해서, **값이 채워진
  뒤에만** `is-ready` 클래스를 붙여 노출합니다. `count > 0`일 때만
  `is-ready`가 붙으므로, 장바구니가 실제로 비어 있으면(0개) 뱃지 자체가
  계속 노출되지 않는 방식입니다.
- 값이 너무 늦게 채워지는 경우를 대비해 **1500ms 폴백**으로 한 번 더
  `reveal()`을 호출합니다(이 시점에도 0개면 여전히 숨김 유지).
- 이후 장바구니에 담기 등으로 카운트가 0→양수로 바뀌면 옵저버가 그 변화도
  잡아서 `is-ready`를 붙여줍니다. 단, `is-ready`가 한 번 붙은 뒤 다시
  0개로 줄어들어도 클래스를 **떼는 로직은 없으므로**, "0개면 완전히
  숨김"을 계속 유지하고 싶다면 별도 처리가 필요합니다.

## 이 스니펫에 포함되지 않은 것 (별도 정의 필요)

- `#xans_myshop_basket_cnt`를 실제로 숨기고/보여주는 CSS는 이 파일에
  없습니다. 예를 들어 `#xans_myshop_basket_cnt {opacity: 0;} #xans_myshop_basket_cnt.is-ready {opacity: 1;}`
  같은 규칙이 헤더 스타일 쪽에 별도로 정의돼 있어야 이 스크립트가 실제로
  뱃지를 숨겼다 보여주는 효과를 냅니다.

## 적용 위치

`layout.html`의 `<head>` 안, 다른 CSS/JS보다 **최대한 위쪽**에 통째로
붙여넣습니다. 순서를 바꾸지 마세요 — 첫 번째 클래스 추가 스크립트가
스타일보다 먼저 실행돼야 초기 페인트부터 `#wrap`이 숨겨진 채 시작됩니다.

## 프로젝트별로 확인할 것

| 위치 | 내용 |
| --- | --- |
| `#wrap` | 페이드인 대상 루트 컨테이너 id. 스킨마다 다르면 교체 |
| `#xans_myshop_basket_cnt` | 헤더 장바구니 카운트 요소 id. 스킨마다 다르면 교체 |
| `2000` (첫 번째 폴백), `1500` (카운트 폴백) | 각각 페이지/카운트 로딩이 비정상적으로 늦을 때 강제 노출까지 대기하는 시간(ms) |

## product-detail-skeleton과의 관계

상품상세 페이지에서는 `../product-detail-skeleton`이 자체 로딩 연출을
담당합니다. 그 컴포넌트의 CSS에 아래 규칙이 있어, 상품상세 페이지에서는
이 전역 `#wrap` 페이드인이 무력화되고 스켈레톤이 대신 그 역할을 합니다.

```css
html.has-detail-skeleton.is-page-loading #wrap {
    opacity: 1 !important;
}
```

두 컴포넌트를 함께 쓰지 않는 페이지(상품상세가 아닌 일반 페이지)에서는
이 전역 코드 단독으로 정상 동작합니다.