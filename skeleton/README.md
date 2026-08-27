# Cafe24 상품상세 스켈레톤 UI 키트

카페24 상품상세 페이지 첫 화면에 붙이는 스켈레톤 로딩 UI 공용 컴포넌트입니다.
새 프로젝트(다른 몰)에서 재사용할 때 이 폴더째로 가져가서, 아래
"프로젝트별로 확인할 것" 항목만 고쳐서 붙이면 됩니다.

## 폴더 구조

```
cafe24-product-detail-kit/
├── README.md
├── css/
│   └── product-detail-skeleton.css          # 스켈레톤 스타일 + 실콘텐츠 가림 처리
├── html/
│   └── product-detail-skeleton.snippet.html # 스켈레톤 마크업 스니펫
└── js/
    └── product-detail-skeleton.js           # 스켈레톤 표시/해제 스크립트
```

## 동작 방식

1. 상품상세 페이지가 로드되면 `html/product-detail-skeleton.snippet.html`의
   마크업이 실제 콘텐츠 위에 흰 배경 + 시머(shimmer) 애니메이션으로 덮입니다.
2. `css/product-detail-skeleton.css`의 `.product-detail-skeleton:not(.is-hidden) ~ *`
   규칙이, 스켈레톤과 같은 부모의 형제인 실제 콘텐츠 요소들을 `opacity: 0`으로
   가려서 로딩 중 레이아웃이 비어져 보이는 걸 막습니다.
3. `js/product-detail-skeleton.js`가 메인 상품 이미지의 로드(load/error) 완료를
   감지해서 스켈레톤에 `is-hidden` 클래스를 붙입니다. 이때 CSS가 스켈레톤을
   페이드아웃시키고, 동시에 가려뒀던 실제 콘텐츠도 `opacity: 1`로 되돌립니다.
4. 이미지 로드가 비정상적으로 오래 걸리는 경우를 대비해, 스크립트 내
   `FALLBACK_TIMEOUT_MS`(기본 2500ms) 이후 강제로 스켈레톤을 숨깁니다.

## 적용 방법

1. `css/product-detail-skeleton.css`를 상품상세 페이지(또는 layout.html)에 로드.
2. `html/product-detail-skeleton.snippet.html`을 상품상세 실제 콘텐츠 루트
   바로 앞(형제 위치)에 삽입.
3. `js/product-detail-skeleton.js`를 상품상세 페이지 스크립트로 로드.
   jQuery가 이 스크립트보다 늦게 로드돼도 자동으로 대기 후 초기화됩니다.

## 프로젝트별로 확인할 것

| 위치 | 내용 |
| --- | --- |
| `js/product-detail-skeleton.js`의 메인 이미지 셀렉터 (`#prdDetailImg`, `.xans-product-detail .imgArea .RW .prdImg .thumbnail img`) | 스킨마다 상품 대표 이미지 마크업이 다를 수 있어 실제 구조에 맞게 조정 |
| `css/product-detail-skeleton.css`의 `.product-detail-skeleton ~ *` | 스켈레톤과 실제 콘텐츠가 **같은 부모의 형제 관계**여야 정상 동작. 구조가 다르면 이 선택자를 실제 콘텐츠 래퍼 클래스로 교체 |
| `FALLBACK_TIMEOUT_MS` | 이미지 로드 실패/지연 시 강제로 스켈레톤을 숨기기까지의 대기 시간(ms) |

## 참고

- `html.has-detail-skeleton.is-page-loading #wrap { opacity: 1 !important; }`는
  전역 레이아웃(layout.html)에 페이지 전체 로딩 opacity 처리가 따로 있는
  경우, 그 처리와 스켈레톤이 중복으로 겹치지 않도록 막아주는 규칙입니다.
  전역 로딩 처리가 없는 프로젝트라면 없어도 무방합니다.
