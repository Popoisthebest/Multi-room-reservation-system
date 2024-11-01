## 협업 규칙 (Collaboration Guidelines)

### 1. **Branch 관리**

- **main**: 배포 가능한 상태의 코드만 머지합니다. 직접적으로 main 브랜치에 push하는 것을 금지합니다.
- **dev**: 개발 진행 중인 최신 기능을 머지하는 브랜치입니다. 모든 기능 추가와 버그 수정을 위해 이 브랜치에서 작업합니다.
- **개인 브랜치**: 각 개발자는 자신의 브랜치에서 기능을 개발합니다. 브랜치 이름은 다음과 같이 작성합니다:
  - `feature/기능명`: 새로운 기능 개발 시
  - `bugfix/버그명`: 버그 수정 시
  - 예시: `feature/offline-map`, `bugfix/location-error`

### 2. **Pull Request (PR)**

- PR 생성 시, 충분한 설명과 관련 이슈 번호를 포함합니다.
- 다른 팀원의 리뷰 없이 **main** 또는 **dev** 브랜치에 머지하지 않습니다.
- PR 제목 예시:
  - `[Feature] 꿀팁 기능 추가`
  - `[Bugfix] 내 위치 오류 수정`
- PR 본문에 작업 내용, 테스트 여부, 예상되는 변화 등을 명시합니다.
- **한 명 이상의 리뷰어**가 승인한 후에만 PR을 머지합니다.

### 3. **커밋 메시지 규칙**

- 커밋 메시지는 영어 또는 한국어로 간결하고 명확하게 작성합니다.
- **형식**: `[작업 타입] 작업 내용`
  - `feat`: 새로운 기능 추가
  - `fix`: 버그 수정
  - `docs`: 문서 수정
  - `style`: 코드 포맷팅, 세미콜론 누락 등
  - `refactor`: 코드 리팩토링
  - `test`: 테스트 코드 추가/수정
  - `chore`: 기타 변경 사항
- 예시:
  - `[feat] 일본어 기본 회화 기능 추가`
  - `[fix] Papago API 연결 오류 해결`

### 4. **코드 스타일**

- **코딩 스타일 가이드**를 준수합니다. Dart 코드의 경우 [Effective Dart](https://dart.dev/guides/language/effective-dart) 스타일을 따릅니다.
- 모든 커밋 전 **코드 린트(lint)**와 **포매팅(formatting)**을 적용합니다.
- `flutter analyze`와 `flutter format`을 통해 코드가 일관되도록 유지합니다.

### 5. **이슈 관리**

- 새로운 작업은 GitHub **Issues**로 관리하며, 작업 시작 전에 이슈를 생성합니다.
- 각 이슈에는 담당자를 지정하고, 작업이 완료되면 해당 이슈를 닫습니다.
- 이슈 제목 형식: `[카테고리] 작업 내용`
  - 예시: `[Feature] 일본어 기본 회화 기능 추가`, `[Bug] 환율 계산기 오류`

### 6. **의사소통**

- GitHub Issues, PR, 또는 Discord을 통해 **원활한 커뮤니케이션**을 유지합니다.
- 모든 중요한 결정사항은 GitHub에 기록하고, Discord에서 논의한 내용도 이슈에 적절히 반영합니다.

### 7. **테스트**

- 새로운 기능을 추가하거나 버그를 수정할 때는 반드시 **테스트**를 진행하고, `test/` 폴더에 테스트 코드를 작성합니다.
- 코드 리뷰 전, 각자 기능의 테스트를 완료한 상태에서 PR을 요청합니다.

### 8. **리뷰**

- 코드를 리뷰할 때는 가독성, 성능, 유지보수성, 버그 가능성 등을 고려하여 리뷰합니다.
- 리뷰어는 개선 사항을 제안하고, 설명이 필요한 부분에 대해 적극적으로 의견을 남깁니다.
- 코드 리뷰는 1일 이내에 완료하는 것을 원칙으로 하며, 최대한 신속히 피드백을 제공합니다.

## 협업 방법 (Collaboration Method)

### 1. **개인 브랜치에서 작업**

**목표**: 각 개발자는 할당된 작업을 독립적으로 진행하기 위해 **개인 브랜치**에서 작업을 시작합니다.

#### 단계별 설명:

1. **dev 브랜치에서 개인 브랜치 생성**:

   - 최신 **dev 브랜치**로부터 새 개인 브랜치를 생성합니다. 개인 브랜치는 각자 독립적으로 기능 개발 또는 버그 수정을 진행할 수 있는 브랜치입니다.
   - 브랜치 이름은 작업 목적에 맞게 명확히 지정합니다. 예를 들어, 기능 개발은 `feature/기능명`, 버그 수정은 `bugfix/버그명`으로 이름을 짓습니다.

   **명령어**:

   ```bash
   git checkout dev          # dev 브랜치로 이동
   git pull origin dev        # 최신 dev 브랜치 업데이트
   git checkout -b feature/기능명   # 새로운 개인 브랜치 생성
   ```

   예시: 일본어 기본 회화 기능 개발을 위한 브랜치

   ```bash
   git checkout -b feature/japanese-phrases
   ```

2. **개인 브랜치에서 작업**:

   - 개인 브랜치에서 해당 작업(기능 개발 또는 버그 수정)을 진행합니다.
   - 작업 도중 변경된 파일들을 **commit**하여 기록하고, 작업이 끝나면 **push**를 통해 원격 저장소에 올립니다.

   **명령어**:

   ```bash
   git add .                       # 변경된 파일 추가
   git commit -m "작업 설명"       # 커밋 메시지 작성
   git push origin feature/기능명   # 원격 저장소로 푸시
   ```

   예시 커밋 메시지:

   ```bash
   git commit -m "[feat] 일본어 기본 회화 기능 추가"
   ```

### 2. **Pull Request (PR) 요청**

**목표**: 작업한 내용을 **dev 브랜치**로 통합하기 위해 **Pull Request (PR)**를 생성합니다.

1. **PR 생성**:

   - 작업이 완료되면 개인 브랜치에서 dev 브랜치로 **Pull Request (PR)**를 생성합니다.
   - PR 제목에는 작업 내용을 간결하게 요약하고, 본문에는 작업한 내용, 변경 사항, 테스트 여부 등을 명확히 설명합니다. 이슈가 있다면 **이슈 번호**도 함께 참조합니다.

   예시 PR 제목과 설명:

   - PR 제목: `[Feature] 일본어 기본 회화 기능 추가`
   - PR 설명: "일본어 기본 회화 기능을 추가했습니다. #12 이슈와 관련되어 있습니다."

2. **PR 검토 요청**:
   - 다른 팀원들에게 리뷰를 요청하여 코드 검토를 진행합니다.
   - 팀원들이 피드백을 주면, 필요 시 추가 수정 작업을 진행합니다.

### 3. **코드 리뷰 및 피드백**

**목표**: 팀원들이 서로의 코드를 검토하고, 품질을 개선합니다.

1. **코드 리뷰**:

   - PR을 받은 팀원은 코드를 리뷰합니다. 이 과정에서 코드의 가독성, 성능, 유지보수성, 오류 가능성 등을 확인하고 피드백을 남깁니다.
   - 발견된 문제점이 있으면 리뷰어가 **수정 제안**을 남기고, PR 작성자는 해당 피드백을 반영하여 코드를 수정합니다.

2. **PR 승인**:

   - 모든 리뷰어가 코드에 대해 동의하면 PR을 승인합니다.
   - 승인 후, 개인 브랜치의 변경 사항을 **dev 브랜치로 머지**합니다.

   **명령어**:

   ```bash
   git checkout dev                # dev 브랜치로 이동
   git pull origin dev             # dev 브랜치 최신화
   git merge feature/기능명         # 개인 브랜치 머지
   git push origin dev             # 원격 저장소로 푸시
   ```

### 4. **dev 브랜치 통합 및 테스트**

**목표**: dev 브랜치에서 모든 기능이 통합된 후, 전체적인 테스트를 진행하여 문제를 발견하고 해결합니다.

1. **dev 브랜치 테스트**:

   - PR이 dev 브랜치에 머지된 후, 전체 프로젝트의 통합 테스트를 진행합니다.
   - 이 과정에서 다른 기능들과의 충돌 여부, 예상하지 못한 버그 발생 여부를 확인합니다.
   - 통합 테스트에서 문제가 발생하면, 관련된 개발자가 수정 작업을 진행합니다.

2. **버그 수정 및 추가 PR**:
   - 통합 테스트에서 발견된 문제를 해결하기 위해 추가적인 PR을 생성하고, 해당 수정 사항을 다시 dev 브랜치로 머지합니다.

### 5. **main 브랜치로 배포 준비**

**목표**: dev 브랜치에서 모든 테스트가 완료되면, 최종적으로 **main 브랜치**로 머지하여 배포를 준비합니다.

1. **main 브랜치로 머지**:

   - dev 브랜치에서 충분한 테스트가 완료되고 안정성이 확보되면, dev 브랜치의 코드를 **main 브랜치**로 머지합니다.
   - main 브랜치는 **배포 가능한 상태**의 코드만 포함해야 하므로, 이 과정에서 문제가 없는지 마지막으로 확인합니다.

   **명령어**:

   ```bash
   git checkout main               # main 브랜치로 이동
   git pull origin main            # 최신 main 브랜치 업데이트
   git merge dev                   # dev 브랜치의 변경 사항을 머지
   git push origin main            # 원격 저장소로 푸시
   ```

2. **배포 준비 완료**:
   - main 브랜치로 머지된 코드가 문제없이 작동한다면, 배포 준비가 완료됩니다.
   - 배포가 완료된 후에도 발생할 수 있는 문제를 모니터링하고, 필요한 경우 긴급 수정을 진행합니다.

Dart 및 Flutter 기반의 앱을 개발할 때, 일관된 코딩 스타일을 유지하고 효율적인 코드를 작성하는 것은 매우 중요합니다. 이는 코드의 가독성을 높이고, 유지 보수를 쉽게 하며, 버그를 줄이는 데 큰 도움이 됩니다. 아래에는 **Dart & Flutter 코딩 규칙**을 정리해 드리겠습니다.

## 1. **일반적인 Dart 코딩 규칙**

### 1.1. **네이밍 컨벤션**

- **클래스명 및 enum명**: `PascalCase`를 사용합니다.
  - 예: `class UserProfile`, `enum UserRole`
- **변수명, 함수명**: `camelCase`를 사용합니다.
  - 예: `var userProfile`, `void fetchUserData()`
- **상수**: 상수는 `camelCase`를 사용하되, 클래스 밖에서 선언된 상수는 `const` 키워드를 사용하고 대문자와 밑줄(`UPPER_SNAKE_CASE`)을 사용합니다.
  - 예: `const int MAX_USER_COUNT = 1000;`

### 1.2. **주석**

- **단일 라인 주석**: `//`를 사용합니다.
  - 예: `// This is a single line comment`
- **블록 주석**: 여러 줄 주석은 `/* */`을 사용합니다.
  - 예:
    ```dart
    /*
     * This is a multi-line comment.
     * Useful for providing more context.
     */
    ```

### 1.3. **세미콜론 및 콤마**

- **세미콜론**: 모든 명령문 끝에 반드시 세미콜론(`;`)을 붙입니다.
- **마지막 콤마**: Dart는 리스트, 맵, 함수 인수 등에서 마지막 항목 뒤에 콤마를 허용합니다. 이를 사용하면 코드 수정 시 편리합니다.
  - 예:
    ```dart
    List<String> fruits = [
      'apple',
      'banana',
      'orange', // 마지막 콤마 허용
    ];
    ```

## 2. **Flutter 관련 코딩 규칙**

### 2.1. **위젯 계층 구조 최적화**

- **중복된 위젯 계층 방지**: 불필요한 중첩을 피하고, 가능한 한 위젯 계층을 간결하게 유지합니다. 중복된 레이아웃 위젯을 방지하여 성능을 최적화합니다.
  - 안 좋은 예:
    ```dart
    Padding(
      padding: EdgeInsets.all(8.0),
      child: Container(
        margin: EdgeInsets.all(8.0), // 불필요한 중복
        child: Text('Hello World'),
      ),
    );
    ```
  - 좋은 예:
    ```dart
    Padding(
      padding: EdgeInsets.all(8.0),
      child: Text('Hello World'),
    );
    ```

### 2.2. **빌드 메서드의 단순화**

- **빌드 메서드가 너무 길어지지 않도록**: `build` 메서드 내에서 위젯이 복잡하거나 길어지면, 이를 **별도의 메서드** 또는 **별도의 위젯**으로 분리하여 관리합니다.

  - 예:

    ```dart
    @override
    Widget build(BuildContext context) {
      return Scaffold(
        appBar: AppBar(title: Text('Profile')),
        body: Column(
          children: [
            _buildProfileHeader(),
            _buildProfileDetails(),
          ],
        ),
      );
    }

    Widget _buildProfileHeader() {
      return Text('Header');
    }

    Widget _buildProfileDetails() {
      return Text('Details');
    }
    ```

### 2.3. **상태 관리**

- **StatefulWidget과 StatelessWidget의 사용 구분**: 상태가 변하지 않는 UI는 `StatelessWidget`을 사용하고, 상태 변화가 필요한 경우 `StatefulWidget`을 사용합니다.
  - 예: 사용자가 상호작용하여 UI가 변경되지 않는 경우, `StatelessWidget`을 사용하는 것이 성능에 더 효율적입니다.

### 2.4. **const 사용**

- **const** 키워드를 적극적으로 사용하여 불변(immutable) 위젯을 생성합니다. 불변 위젯은 Flutter의 성능을 최적화하는 데 중요한 역할을 합니다.
  - 예:
    ```dart
    const Text('Hello, World');
    ```

### 2.5. **null 안전성 (Null Safety)**

- Dart는 **null-safety**를 지원하므로, 가능하면 변수에 nullable 타입(`?`)을 명시하고, null 값을 처리할 수 있도록 합니다.
  - 예:
    ```dart
    String? userName; // null 가능
    ```

## 3. **클래스 및 함수 관련 규칙**

### 3.1. **클래스 설계**

- **싱글턴 패턴**: 글로벌 상태 관리가 필요한 클래스는 싱글턴 패턴으로 구현할 수 있습니다.
  - 예:
    ```dart
    class MySingleton {
      static final MySingleton _instance = MySingleton._internal();
      factory MySingleton() {
        return _instance;
      }
      MySingleton._internal();
    }
    ```

### 3.2. **함수**

- **짧은 함수**는 화살표 함수(arrow function)를 사용해 간결하게 작성할 수 있습니다.

  - 예:
    ```dart
    int add(int a, int b) => a + b;
    ```

- **매개변수와 인수의 명확성**: 함수를 설계할 때 매개변수는 의미가 명확해야 하며, 가능하면 **이름 있는 매개변수(named parameters)**를 사용하여 호출할 때 가독성을 높입니다.

  - 예:

    ```dart
    void createUser({required String name, required int age}) {
      // ...
    }

    createUser(name: 'John', age: 30);
    ```

## 4. **패키지 및 라이브러리 사용 규칙**

### 4.1. **의존성 관리**

- 프로젝트에서 사용하지 않는 **불필요한 패키지**를 `pubspec.yaml` 파일에서 제거하여 의존성을 최소화합니다.
- 가능하면 **가벼운 패키지**를 선택하고, 대형 패키지 사용을 피하는 것이 좋습니다. 성능과 앱 크기에 영향을 줄 수 있기 때문입니다.

### 4.2. **비동기 프로그래밍**

- **async/await** 키워드를 사용하여 비동기 프로그래밍을 처리합니다. 비동기 함수의 반환값은 반드시 `Future` 타입으로 정의합니다.
  - 예:
    ```dart
    Future<void> fetchData() async {
      await Future.delayed(Duration(seconds: 2));
      print('Data fetched');
    }
    ```

## 5. **기타 권장 사항**

### 5.1. **DRY 원칙 (Don't Repeat Yourself)**

- 중복 코드를 줄이고, 재사용 가능한 위젯이나 함수로 분리하여 관리합니다. 예를 들어, 같은 UI 요소가 여러 곳에서 사용된다면 별도의 위젯으로 만들어 재사용합니다.

### 5.2. **KISS 원칙 (Keep It Simple, Stupid)**

- 코드는 간결하고 명확하게 작성하며, 복잡한 로직은 단순화합니다. 너무 복잡한 로직은 유지 보수에 어려움을 주므로, 가능하면 단순한 구조로 설계합니다.
