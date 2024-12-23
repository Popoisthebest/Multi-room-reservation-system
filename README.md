## 해당 사이트
https://popoisthebest.github.io/Multi-room-reservation-system/

## 협업 규칙 (Collaboration Guidelines)

### 1. **Branch 관리**

- **main**: 배포 가능한 상태의 코드만 머지합니다. 직접적으로 main 브랜치에 push하는 것은 금지합니다.
- **dev**: 개발 진행 중인 최신 기능을 머지하는 브랜치입니다. 모든 기능 추가와 버그 수정을 이 브랜치에서 작업합니다.
- **개인 브랜치**: 각 개발자는 자신의 브랜치에서 기능을 개발합니다. 브랜치 이름은 다음과 같이 작성합니다:
  - `feature/기능명`: 새로운 기능 개발 시
  - `bugfix/버그명`: 버그 수정 시
  - 예시: `feature/reservation-page`, `bugfix/login-error`

### 2. **Pull Request (PR)**

- PR 생성 시, 충분한 설명과 관련 이슈 번호를 포함합니다.
- 다른 팀원의 리뷰 없이 **main** 또는 **dev** 브랜치에 머지하지 않습니다.
- PR 제목 예시:
  - `[Feature] 예약 페이지 추가`
  - `[Bugfix] 로그인 오류 수정`
- PR 본문에 작업 내용, 테스트 여부, 예상되는 변화 등을 명시합니다.
- **한 명 이상의 리뷰어**가 승인한 후에만 PR을 머지합니다.

### 3. **커밋 메시지 규칙**

- 커밋 메시지는 간결하고 명확하게 영어 또는 한국어로 작성합니다.
- **형식**: `[작업 타입] 작업 내용`
  - `feat`: 새로운 기능 추가
  - `fix`: 버그 수정
  - `docs`: 문서 수정
  - `style`: 코드 포맷팅, 세미콜론 누락 등
  - `refactor`: 코드 리팩토링
  - `test`: 테스트 코드 추가/수정
  - `chore`: 기타 변경 사항
- 예시:
  - `[feat] 예약 페이지 추가`
  - `[fix] 로그인 세션 오류 해결`

### 4. **이슈 관리**

- 새로운 작업은 GitHub **Issues**로 관리하며, 작업 시작 전에 이슈를 생성합니다.
- 각 이슈에는 담당자를 지정하고, 작업이 완료되면 해당 이슈를 닫습니다.
- 이슈 제목 형식: `[카테고리] 작업 내용`
  - 예시: `[Feature] 예약 페이지 구현`, `[Bug] 로그인 오류 해결`

### 5. **의사소통**

- GitHub Issues, PR, 또는 Discord를 통해 **원활한 커뮤니케이션**을 유지합니다.
- 모든 중요한 결정사항은 GitHub에 기록하고, Discord에서 논의한 내용도 이슈에 적절히 반영합니다.

### 6. **테스트**

- 새로운 기능을 추가하거나 버그를 수정할 때는 반드시 **테스트**를 진행하고, `test/` 폴더에 테스트 코드를 작성합니다.
- 코드 리뷰 전, 각자 기능의 테스트를 완료한 상태에서 PR을 요청합니다.

### 7. **리뷰**

- 코드의 가독성, 성능, 유지보수성, 버그 가능성 등을 고려하여 리뷰합니다.
- 리뷰어는 개선 사항을 제안하고, 설명이 필요한 부분에 대해 의견을 남깁니다.
- 코드 리뷰는 **1일 이내**에 완료하는 것을 원칙으로 하고, 신속히 피드백을 제공합니다.

---

## 협업 방법 (Collaboration Method)

### 1. **개인 브랜치에서 작업**

**목표**: 각 개발자는 할당된 작업을 독립적으로 진행하기 위해 **개인 브랜치**에서 작업을 시작합니다.

#### 단계별 설명:

1. **dev 브랜치에서 개인 브랜치 생성**:

   - 최신 **dev 브랜치**로부터 새 개인 브랜치를 생성하여 기능 개발 또는 버그 수정을 진행할 수 있는 브랜치를 만듭니다.
   - 브랜치 이름은 작업 목적에 맞게 명확히 지정합니다. 예: `feature/reservation-function`, `bugfix/login-error`.

   **명령어**:

   ```bash
   git checkout dev                # dev 브랜치로 이동
   git pull origin dev             # 최신 dev 브랜치 업데이트
   git checkout -b feature/기능명   # 새로운 개인 브랜치 생성
   ```

2. **개인 브랜치에서 작업**:

   - 작업을 진행하면서 변경된 파일들을 **commit**하여 기록하고, 작업이 끝나면 **push**를 통해 원격 저장소에 올립니다.

   **명령어**:

   ```bash
   git add .                       # 변경된 파일 추가
   git commit -m "작업 설명"       # 커밋 메시지 작성
   git push origin feature/기능명   # 원격 저장소로 푸시
   ```

### 2. **Pull Request (PR) 요청**

1. **PR 생성**:

   - 작업이 완료되면 개인 브랜치에서 dev 브랜치로 **Pull Request (PR)**를 생성합니다.
   - PR 제목에는 작업 내용을 간결하게 요약하고, 본문에 작업 내용, 변경 사항, 테스트 여부 등을 명확히 설명합니다.

2. **PR 검토 요청**:
   - 팀원들에게 리뷰를 요청하여 코드 검토를 진행합니다.
   - 필요 시 추가 수정 작업을 진행합니다.

### 3. **코드 리뷰 및 피드백**

1. **코드 리뷰**:

   - PR을 받은 팀원은 코드를 리뷰하여 가독성, 성능, 유지보수성 등을 확인하고 피드백을 남깁니다.
   - 발견된 문제는 수정 제안을 남기고, 작성자는 이를 반영하여 수정합니다.

2. **PR 승인**:

   - 모든 리뷰어가 동의하면 PR을 승인하고, 개인 브랜치의 변경 사항을 **dev 브랜치로 머지**합니다.

### 4. **dev 브랜치 통합 및 테스트**

1. **dev 브랜치 테스트**:

   - PR이 dev 브랜치에 머지된 후 전체 프로젝트의 통합 테스트를 진행하여 다른 기능들과의 충돌 여부, 예상치 못한 버그 발생 여부를 확인합니다.

2. **버그 수정 및 추가 PR**:
   - 통합 테스트에서 발견된 문제를 해결하기 위해 추가적인 PR을 생성하여 dev 브랜치로 머지합니다.

### 5. **main 브랜치로 배포 준비**

1. **main 브랜치로 머지**:

   - dev 브랜치의 코드를 **main 브랜치**로 머지하여 배포 준비를 완료합니다.
   - 이 과정에서 마지막으로 문제가 없는지 확인합니다.

---

## 코딩 규칙 (Coding Guidelines)

### 1. **HTML 코딩 규칙**

#### 1.1 **네이밍 컨벤션**

- **ID와 클래스명**: 소문자와 하이픈(`-`)을 사용하여 명명합니다. 명확하고 기능적인 이름을 사용합니다.
  - 예: `header-menu`, `reservation-form`, `btn-submit`

#### 1.2 **구조화된 마크업**

- HTML 문서는 논리적으로 구조화합니다. 의미가 명확한 HTML 요소를 사용하여 가독성과 접근성을 높입니다.
  - 예: `header`, `main`, `section`, `footer` 태그 등을 적절히 사용하여 문서 구조를 나눕니다.
- HTML5 요소를 사용하여 의미 있는 마크업을 작성하고, 시멘틱 태그(`<article>`, `<aside>`, `<nav>` 등)를 적극적으로 사용합니다.

#### 1.3 **속성 순서**

- 태그의 속성은 다음 순서로 작성합니다: `id`, `class`, `name`, `data-*`, `src`, `for`, `type`, `href`, `alt`, `title` 등 기타 속성.
  - 예:
    ```html
    <input
      id="username"
      class="input-field"
      type="text"
      name="username"
      placeholder="Enter username"
    />
    ```

#### 1.4 **닫는 태그 일관성**

- HTML 요소는 가능한 닫는 태그를 생략하지 않고, 명확히 닫습니다. 빈 태그는 슬래시(`/`)를 추가합니다.
  - 예: `<br />`, `<img src="image.jpg" alt="image description" />`

### 2. **CSS 코딩 규칙**

#### 2.1 **네이밍 컨벤션**

- **클래스와 ID**: 소문자와 하이픈(`-`)을 사용하며, BEM(Block Element Modifier) 방식을 권장합니다.
  - 예: `btn--primary`, `header__logo`, `form__input--error`

#### 2.2 **CSS 파일 구조**

- **구조**: 공통 스타일, 레이아웃, 컴포넌트, 유틸리티 순으로 구분하여 스타일을 정의합니다.
- **CSS 파일 분리**: 스타일이 복잡한 경우, 파일을 기능별로 분리하고 메인 CSS 파일에서 import하여 관리합니다.

#### 2.3 **속성 순서**

- CSS 속성은 **레이아웃 → 박스 모델 → 타이포그래피 → 기타 속성** 순으로 작성합니다.
  - 예:
    ```css
    .example {
      display: flex;
      align-items: center;
      width: 100px;
      height: 50px;
      margin: 10px;
      padding: 5px;
      font-size: 16px;
      color: #333;
      background-color: #f5f5f5;
    }
    ```

#### 2.4 **단위 사용**

- 가능하면 `px` 대신 상대 단위(`em`, `rem`, `%`)를 사용합니다. 단, 경계(border)나 그림자(shadow)와 같은 속성에는 `px`을 사용합니다.
- 색상은 일관되게 `hex`, `rgba`, 또는 CSS 변수(`var(--color-name)`)를 사용합니다.

#### 2.5 **미디어 쿼리**

- **모바일 우선 접근 방식**을 사용하여 기본 스타일을 설정하고, 화면 크기에 따라 미디어 쿼리를 추가합니다.

  - 예:

    ```css
    .container {
      width: 100%;
    }

    @media (min-width: 768px) {
      .container {
        width: 80%;
      }
    }
    ```

### 3. **JavaScript 코딩 규칙**

#### 3.1 **네이밍 컨벤션**

- **변수와 함수**: `camelCase`를 사용합니다.
  - 예: `let reservationList`, `function fetchReservationData()`
- **상수**: 상수는 `UPPER_SNAKE_CASE`로 작성합니다.
  - 예: `const MAX_RETRY_COUNT = 5`

#### 3.2 **코드 구조화**

- **ES6 문법 사용**: `const`, `let`을 사용하여 변수 범위를 명확히 하고, 함수 표현식 또는 화살표 함수를 사용하여 코드를 작성합니다.
- **모듈화**: 기능별로 모듈을 분리하여 파일을 구성하고, 필요한 경우 `import`와 `export`를 사용해 모듈화합니다.

  - 예:

    ```javascript
    // reservation.js
    export function createReservation(data) {
      // 예약 생성 코드
    }

    // main.js
    import { createReservation } from "./reservation.js";
    ```

#### 3.3 **함수 작성 규칙**

- 함수를 짧고 명확하게 작성합니다. 각 함수는 하나의 기능에만 집중하여 단일 책임 원칙(SRP)을 준수합니다.
- 함수 인자는 이름을 명확하게 지정하고, 선택적 인자는 기본값을 지정합니다.
  - 예:
    ```javascript
    function fetchData(url, retryCount = 3) {
      // ...
    }
    ```

#### 3.4 **주석**

- 중요한 로직이나 복잡한 코드에는 주석을 작성하여 이해를 돕습니다. 함수 상단에는 JSDoc 형식으로 간단한 설명을 추가합니다.
  - 예:
    ```javascript
    /**
     * 예약 데이터를 서버에서 가져옵니다.
     * @param {string} url - API 엔드포인트 URL
     * @returns {Promise<Object>} 예약 데이터
     */
    async function fetchReservationData(url) {
      // fetch 코드
    }
    ```

#### 3.5 **비동기 처리**

- 비동기 작업은 `async/await`을 사용하고, 오류 처리를 위해 `try/catch`를 추가합니다.
  - 예:
    ```javascript
    async function fetchData() {
      try {
        const response = await fetch("api/reservations");
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    ```

### 4. **기타 권장 사항**

#### 4.1 **DRY 원칙 (Don't Repeat Yourself)**

- 중복 코드를 줄이고, 재사용 가능한 함수를 작성합니다. 예를 들어, 같은 동작을 수행하는 코드가 여러 곳에 사용된다면 별도의 함수로 만들어 재사용합니다.

#### 4.2 **KISS 원칙 (Keep It Simple, Stupid)**

- 코드는 간결하고 명확하게 작성하며, 복잡한 로직은 단순화합니다. 너무 복잡한 로직은 유지 보수에 어려움을 주므로 가능한 한 단순한 구조로 설계합니다.

---
