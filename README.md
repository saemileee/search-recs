# 로컬캐싱과 Trie 자료구조를 활용한 검색어 추천 앱

## 📖 목차

-   [과제 소개](https://github.com/saemileee/search-recs/tree/main#-%EA%B3%BC%EC%A0%9C-%EC%86%8C%EA%B0%9C)
-   [목표 설정](https://github.com/saemileee/search-recs/tree/main#-%EB%AA%A9%ED%91%9C-%EC%84%A4%EC%A0%95)
-   [개발 기간](https://github.com/saemileee/search-recs/tree/main#-%EA%B0%9C%EB%B0%9C-%EA%B8%B0%EA%B0%84)
-   [시작 가이드](https://github.com/saemileee/search-recs/tree/main#-%EC%8B%9C%EC%9E%91-%EA%B0%80%EC%9D%B4%EB%93%9C)
-   [구현 결과](https://github.com/saemileee/search-recs/tree/main#-%EA%B5%AC%ED%98%84-%EA%B2%B0%EA%B3%BC)
-   [과제 구현 방법](https://github.com/saemileee/search-recs/tree/main#-%EA%B3%BC%EC%A0%9C-%EA%B5%AC%ED%98%84-%EB%B0%A9%EB%B2%95)
    1. 로컬 캐싱 구현 방법
    2. 입력별 API 호출 횟수를 줄이는 전략
    3. 키보드&마우스 이용한 추천 검색어 기능 사용법
-   [코드 작성 전략](https://github.com/saemileee/search-recs/tree/main#-%EC%BD%94%EB%93%9C-%EC%9E%91%EC%84%B1-%EC%A0%84%EB%9E%B5)
    1. 리듀서로 패칭 후 상태 업데이트 로직 관리
    2. 복잡한 조건문 변수로 추상화
    3. 복잡한 UI 로직 커스텀훅 사용
    4. 클래스로 자주 쓰이는 유틸 함수 모듈화
-   [Best Practice 도출](https://github.com/saemileee/search-recs/tree/main#-best-practice-%EB%8F%84%EC%B6%9C)
-   [트러블 슈팅](https://github.com/saemileee/search-recs/tree/main#-%ED%8A%B8%EB%9F%AC%EB%B8%94-%EC%8A%88%ED%8C%85)
    1. Trie 자료구조 JSON.stringify 시 뎁스 전체가 저장 되지 않는 문제
    2. Trie 자료구조의 객체 데이터를 조작할 때 이슈
-   [디렉토리 구조](https://github.com/saemileee/search-recs/tree/main#-%EB%94%94%EB%A0%89%ED%86%A0%EB%A6%AC-%EA%B5%AC%EC%A1%B0)
-   [기술스택](https://github.com/saemileee/search-recs/tree/main#-%EA%B8%B0%EC%88%A0%EC%8A%A4%ED%83%9D)

<br/>

## 💡 과제 소개

-   검색창 구현 + 검색어 추천 기능 구현 + 캐싱 기능 구현 + Best Practice 도출
    > Best Practice란 모범사례라는 말로서, 특정 문제를 효과적으로 해결하기 위한 가장 성공적인 해결책
    > 또는 방법론을 의미합니다. 과제 수행 과정에서 Best Practice란 팀원들이 각자의 구현방법을
    > 설명하고 토론했을 때 팀 안에서 이 방법이 가장 효율적이라고 판단되는 것을 정하고 그것을 팀의
    > Best Practice로 삼는것입니다. 해당 레포는 Best Practice 도출 전 개인으로 구현한 내용을 담고
    > 있습니다.

<br/>

## 💡 목표 설정

-   API 호출 최소화하기
    -   로컬캐싱으로 API 호출 대신 캐싱 된 값 사용하기
    -   디바운싱으로 입력 후 일정 시간이 지난 경우에만 API 호출하기
    -   한글 입력 시 완전한 음절인 경우에만 API 호출하기
-   편리한 UI/UX
    -   마우스 이벤트 & 키보드 이벤트 활용하여 추천 검색어 선택 구현하기
-   클린코드 (유지보수 고려)
    -   관심사 분리로 유지보수성 향상
-   추상화/모듈화
    -   리듀서로 패칭 후 상태 업데이트 로직 관리 하기
    -   클래스를 활용하여 자주쓰이는 함수 모듈화 하기
    -   복잡한 조건문 함수로 추상화 하기
    -   복잡한 ui 상태 조작 로직 커스텀훅 사용하기

<br/>

## 💡 개발 기간

2023.09.05 - 2023.09.08

<br/>

## 💡 시작 가이드

-   배포 주소

    🔗 [https://search-app-theta.vercel.app/](https://search-app-theta.vercel.app/)

-   프로젝트 로컬 실행 방법
-   프론트 서버인 3000 포트와 json-server 4000포트가 동시에 실행됩니다.

    ```
    $ npm install
    $ npm start
    ```

<br/>

## 💡 구현 결과

![구현 결과](https://github.com/saemileee/search-recs/assets/68241138/801852f7-53d8-46a5-9997-debd02e7d28a)

<br/>

## 💡 과제 구현 방법

### 1. 로컬 캐싱 구현 방법

-   [x] **로컬 캐싱 구현 목표** - 로컬캐싱을 활용하여 `API 호출 횟수`를 줄이는 것을 목표로하여
        구현하였습니다.

<br/>

-   [x] **API 호출 횟수 줄이는 방법**

    -   사용자가 입력한 검색어 값을 `key`로 활용, 받아 온 데이터를 `value`의 형태로 저장한 후 동일한
        값이 입력 되었을 때 해당 key 값으로 데이터를 찾아 클라이언트 데이터 상태를 업데이트합니다.
    -   사용자가 입력한 검색어 문자열이 `이미 캐싱 된 key + “…”` 형태라면 캐싱 된 key의
        `데이터를 가공/필터링`하여 `재캐싱`하고 상태를 업데이트 합니다.

        -   [예시]
            1. 사용자 입력 값 (`key`) : `“감”`, 캐싱 된 값(`value`) : `[”감염”, “감염성”, “감시”]`
            2. 사용자 입력 값 (`key`) : `“감염”` ⇒ key `“감”`의 value를 필터링한 값인
               `[”감염”, “감염성”]`를 `“감시”`: `[”감염”, “감염성”]`으로 재 캐싱합니다.
        -   해당 탐색을 효율적으로 하기 위하여 `Trie` 자료구조를 활용해 캐싱하고 데이터를 찾습니다.
            <img width="500" alt="Trie 자료 구조" src="https://github.com/wanted-pre-onboarding-12th-11/pre-onboarding-12th-3-11/assets/68241138/6ded9d7d-63b7-49c3-924b-fa6f01067d23"/>

    -   브라우저 캐싱을 활용하여 같은 브라우저를 사용한다면 재접속 할 경우 캐시 데이터 기반으로
        데이터를 불러올 수 있도록 합니다.
    -   영문 입력 시 `소문자로 변환`하여 key 값을 찾고, 추가/비교 하여 대소문자 구분 없이 캐시 된
        값을 활용할 수 있습니다.
        <details>
          <summary><b>👈코드 보기</b></summary>
            <div markdown="1">
                <ul>
                  https://github.com/saemileee/search-recs/blob/d5c74a658624ca227d9cc61c9cb4cfdf7a5e8a53/src/utils/searchTrieCache.ts#L64-L190
                </ul>
            </div>
        </details>

<br/>      
 
- [X] **저장소의 메모리를 효율적으로 사용하기 위해 고려한 방법**
      
    - 시간 복잡도 측면에서 강점이 있으나 `메모리 부분에 취약한 Trie 자료구조`를 사용하고, 캐시가 오래 유지되지만 `용량 제한이 있는 로컬 스토리지`를 사용하기 때문에 어떻게 메모리를 효율적으로 관리할지 고민이 필요했습니다.
      
        - 가비지 컬렉팅 - Trie 자료구조에 새로운 데이터를 추가 할 경우 expireTime과 createdAt 속성을 추가하고, 객체의 루트 부터 인서트 되기 전 노드 까지 `순회 할 때 expireTime`을 확인하여 만료 된 캐시 데이터는 `null` 처리합니다.
          <details>
            <summary><b>👈코드 보기</b></summary>
            <div markdown="1">
                <ul>
                  https://github.com/saemileee/search-recs/blob/d5c74a658624ca227d9cc61c9cb4cfdf7a5e8a53/src/utils/searchTrieCache.ts#L93-L97
                </ul>
            </div>
          </details>
        - `감염성`까지 검색하여 api를 호출하고 인서트할 때 기존 저장된 `감` 데이터의 expireTime을 초과하여 캐시 만료를 확인할 수 있습니다.
          <img width="500" alt="스토리지 초기화" src="https://github.com/wanted-pre-onboarding-12th-11/pre-onboarding-12th-3-11/assets/68241138/d3c97bb5-779c-41d9-99e7-af3e5d50d0bf"/>
        - 로컬스토리지의 용량이 초과 되어 에러를 발생시킬 때 스토리지  `openCacheStorage` 커스텀 모듈을 사용하여 해당 `스토리지를 초기화` 합니다.
        
<br/>

-   [x] **변경 된 데이터 값을 적절한 시점에 가져오는 방법**
    -   캐시 된 데이터를 찾았으나 expireTime이 현재 시간 기준 만료 되었다면 리패칭 하여 받아온
        데이터로 교체합니다.

<br/>

-   [x] **브라우저 스토리지의 단점 극복**
    -   사용자가 직접 로컬스토리지를 조작하는 경우 `JSON 파싱이 불가`하거나,
        `루트부터 캐시 된 노드 까지 순회가 불가한 구조`가 될 수 있습니다. 이 경우
        `에러 핸들링`을하여 `캐시를 저장하는 스토리지를 초기화` 합니다.
    -   로컬 스토리지 조작, 에러메세지, 스토리지 초기화 <br/>
    <img width="500" alt="로털 스토리지 조작" src="https://github.com/wanted-pre-onboarding-12th-11/pre-onboarding-12th-3-11/assets/68241138/c00cda1a-8476-4a26-89a9-58be54462df1"/>
    <br/>
    <img width="500" alt="에러메세지" src="https://github.com/wanted-pre-onboarding-12th-11/pre-onboarding-12th-3-11/assets/68241138/c1f67e0a-6199-41b7-8eaa-1b573db508f1"/>
    <br/>
    <img width="500" alt="스토리지 초기화" src="https://github.com/wanted-pre-onboarding-12th-11/pre-onboarding-12th-3-11/assets/68241138/28535a7d-7348-481d-8431-171c7fe11920">
    <details>
      <summary><b>👈코드 보기</b></summary>
        <div markdown="1">
            <ul>
              https://github.com/saemileee/search-recs/blob/d5c74a658624ca227d9cc61c9cb4cfdf7a5e8a53/src/utils/localStorage.ts#L1-L24
            </ul>
        </div>
    </details>

<br/>

---

### 2. 입력별 API 호출 횟수를 줄이는 전략

-   [x] 입력값이 아무것도 없으면 요청하지 않습니다.
-   [x] 디바운싱을 활용해 500ms이상 타이핑이 멈추면 데이터를 요청하도록 유도하여 불필요한 요청을
        줄였습니다.
-   [x] 한글의 경우 완전한 음절이 완성되지 않으면(자음/모음만 입력 시) 요청하지 않습니다.
  <details>
  <summary><b>👈코드 보기</b></summary>
      <div markdown="1">
          <ul>
            https://github.com/saemileee/search-recs/blob/d5c74a658624ca227d9cc61c9cb4cfdf7a5e8a53/src/utils/regex.ts#L1-L7
          </ul>
      </div></details>
-   [x] API 요청 결과는 캐싱하고, 이후 동일한 요청이 들어오면 API 요청 대신 캐싱된 값을
    활용합니다.(expire time은 기능 작동 확인을 위해 10초로 설정하였습니다.)
<details>
  <summary><b>👈코드 보기</b></summary>
      <div markdown="1">
          <ul>
            https://github.com/saemileee/search-recs/blob/d5c74a658624ca227d9cc61c9cb4cfdf7a5e8a53/src/components/Search.tsx#L45-L57
          </ul>
      </div></details>
-   [x] 구현 결과

![api 호출 결과](https://github.com/saemileee/search-recs/assets/68241138/95bb81a5-b8b5-4009-8f2b-31cdcb95090b)

---

### 3. 키보드&마우스를 이용한 추천 검색어 기능

-   [x] 추천검색어에 마우스를 호버하였으나 엔터를 누를 경우, 사용자는 타이핑한 값의 결과를 예상하기
        때문에 커스텀 훅을 활용해 키보드가 가리키는 값, 마우스가 가리키는 값을 나누어
        관리하였습니다.
-   [x] focusingIdx가 null 일 경우 사용자가 타이핑한 값을 가리킵니다.
-   [x] 추천 검색어가 있는 경우 키보드 위/아래 방향키로 이동 가능하고, 엔터 키를 눌러 검색할 수
        있습니다.
-   [x] 마우스 호버 후 키보드 방향키 동작 시 인덱스가 초기화 되지 않고, 호버한 값을 기준으로
    이동합니다.
  <details>
  <summary><b>👈코드 보기</b></summary>
      <div markdown="1">
          <ul>
            https://github.com/saemileee/search-recs/blob/d5c74a658624ca227d9cc61c9cb4cfdf7a5e8a53/src/hooks/useFocusingIdx.ts#L13-L66
          </ul>
      </div></details>
-   [x] 구현 결과

![키보드&마우스를 이용한 추천 검색어 기능](https://github.com/saemileee/search-recs/assets/68241138/e540cbad-7e41-48f0-bcd2-d0fdb86e63ee)

---

### 4. 검색 및 추천 검색어 상태에 따라 변화하는 UI

-   [x] 검색 및 추천 검색어 상태에 따라 헬퍼박스(추천 검색어 박스), 검색 중 메세지, 검색 리스트,
        추천 검색어가 없습니다 UI를 동적으로 렌더링하였습니다.
-   [x] 노출 조건은 다음과 같습니다.

![스크린샷 2023-09-08 오후 8 50 01](https://github.com/saemileee/search-recs/assets/68241138/5e958268-2de0-43e4-9b98-c7e212354d33)

-   [x] 구현 결과

![검색 및 추천 검색어 상태에 따라 변화하는 UI ](https://github.com/saemileee/search-recs/assets/68241138/ce275a9b-9053-41f9-ae5d-719bdc048904)

<br/>

## 💡 코드 작성 전략

### 리듀서로 패칭 후 상태 업데이트 로직 관리

-   [x] 추천 검색어 패칭 후 상태를 업데이트 하는 로직은 리듀서를 통해 관리하며 로직을 추상화,
        관심사를 분리 하였습니다.
        https://github.com/saemileee/search-recs/blob/d5c74a658624ca227d9cc61c9cb4cfdf7a5e8a53/src/hooks/controllers/useSearch.ts#L7-L40

---

### 복잡한 조건문 변수로 추상화

-   [x] 한 함수 내에서 조건문이 많이 쓰이거나 조건문이 복잡한 경우 변수를 활용하여 조건문을 추상화
        하고 직관적으로 사용할 수 있게 하였습니다.
        https://github.com/saemileee/search-recs/blob/d5c74a658624ca227d9cc61c9cb4cfdf7a5e8a53/src/utils/searchTrieCache.ts#L149-L190
        https://github.com/saemileee/search-recs/blob/d5c74a658624ca227d9cc61c9cb4cfdf7a5e8a53/src/components/Search.tsx#L35-L38

---

### 복잡한 UI 로직 커스텀훅 사용

-   [x] 복잡하거나 구체적인 UI 동작 로직의 경우 커스텀훅으로 작성하여 범용성과 추상화, 관심사를 분리
        하였습니다.
-   [x] 디바운싱, 마우스/키보드 포커싱 상태 관리, 헬퍼박스 노출 유무 상태관리를 추상화 하였습니다.
        https://github.com/saemileee/search-recs/blob/d5c74a658624ca227d9cc61c9cb4cfdf7a5e8a53/src/hooks/useHelperBoxState.ts#L3-L36

---

### 클래스로 자주 쓰이는 유틸 함수 모듈화

-   [x] 단순하지만 자주 쓰이고, 그에따라 기본 값이 가변하는 로직들은 클래스로 추상화하고, 인스턴스를
        활용하였습니다.
-   [x] api 요청 모듈화, localStorage 접근을 모듈화하였습니다.

    로컬스토리지 getItem, setItem 메서드 모듈화
    https://github.com/saemileee/search-recs/blob/d5c74a658624ca227d9cc61c9cb4cfdf7a5e8a53/src/utils/localStorage.ts#L1-L24
    인스턴스 분리
    https://github.com/saemileee/search-recs/blob/d5c74a658624ca227d9cc61c9cb4cfdf7a5e8a53/src/store/cacheStorage.ts#L1-L3
    사용 예시
    https://github.com/saemileee/search-recs/blob/d5c74a658624ca227d9cc61c9cb4cfdf7a5e8a53/src/utils/searchTrieCache.ts#L52-L62

<br/>

## 💡 Best Practice 도출

팀원들과 함께 고민한 내용들은 아래 링크에서 확인하실 수 있습니다.

-   [Notion 링크](https://motley-bird-51b.notion.site/Best-Practice-44d333bf327f4ed182c6d7c9b6ed1361?pvs=4)
    참고

<br/>

## 💡 트러블 슈팅

### Trie 자료구조 JSON.stringify 시 뎁스 전체가 저장 되지 않는 문제

-   **문제**

    캐시 스토리지를 `클래스 인스턴스` ⇒ `로컬 스토리지`로 변경함에 따라 `Map 객체` 내
    `Class 메서드`가 포함된 자료구조 전체를 로컬스토리지로 옮기고자 하였으나 제대로 저장되지
    않았습니다.

    ![스크린샷 2023-09-08 오후 10 07 11](https://github.com/saemileee/search-recs/assets/68241138/e0d550a1-cd42-4bfb-aa79-90a7e1b152f9)

    확인 결과 Map 객체는 JSON.stringify 시 원하는 형태의 문자열로 변환 되지 않았으며, Class의
    prototype 속성도 문자열로 변환이 되지 않았습니다.

-   **해결 방안**
    -   기존 `Map 객체`와 `Class의 메서드`를 활용하여 구현한 캐시 추가/찾기/수정/만료 로직을
        `일반 객체 형식`의 Class와 `함수`를 사용하여 객체를 조작하고 캐싱하였습니다.

---

### Trie 자료구조의 객체 데이터를 조작할 때 이슈

-   **문제**
    -   기존 구조에서는 `메서드를 포함한 클래스 인스턴스`를 활용하여 루트 노드 부터 순회하는
        과정이기 때문에 자료구조 중간에 데이터를 추가/수정이 어렵지 않았습니다.
    -   하지만 이번에는 로컬스토리지로 부터 받아온 전체 자료구조의 루트에서 부터 탐색하며
        `함수로 객체 데이터를 조작`해야만 했습니다.
    -   함수형 프로그래밍에서 불변한 객체를 만들던 습관 때문에 객체가 초기화 되는 문제가
        빈번하였습니다.
-   **해결 방안**
    -   값이 가변하는 객체의 특징을 활용해 노드를 순회하며 노드의 값을 직접 조작하고 전체 객체를
        반환했습니다.

        ```tsx
            const getMostSimilar = (string: string) => {
              	...
                  try {
              				// 전체 캐시 객체를 새로운 변수에 할당
                      const newCache = searchCacheStorage.getItem();
                      let currentNode = newCache.root;
                      ...
              				// 노드를 순회하며 newCache 객체 조작
                      for (const char of lowerCaseString) {
                          ...
                          if (isNeededDeleteData) {
                              currentNode.data = null;
                              currentNode.expireTime = null;
                              currentNode.createdAt = null;
                          }
                          ..
                          currentNode = currentNode?.children[char];
                      }
                      return currentNode;
                  } catch (e) {
                      console.error('순회할 수 없는 캐시입니다. 스토리지를 다시 오픈합니다.');
                      openCache();
                  }
              };
        ```

<br/>

## 💡 디렉토리 구조

```
📦src
 ┣ 📂apis
 ┣ 📂components
 ┣ 📂constants
 ┣ 📂containers
 ┣ 📂hooks
 ┣ 📂styles
 ┣ 📂types
 ┣ 📂utils
```

<br/>

## 💡 기술스택

### Development

<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=Javascript&logoColor=white">
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white">
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white">

### Library

<img src="https://img.shields.io/badge/styled%20components-DB7093?style=for-the-badge&logo=styledcomponents&logoColor=white">
<img src="https://img.shields.io/badge/Axios-DA291C?style=for-the-badge&logo=axios&logoColor=white">
<img src="https://img.shields.io/badge/React Router Dom-3178C6?style=for-the-badge&logo=&logoColor=white">

### Convention

<img src="https://img.shields.io/badge/eslint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white">
<img src="https://img.shields.io/badge/prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white">
<img src="https://img.shields.io/badge/husky-FF4088?style=for-the-badge&logo=hugo&logoColor=white">

### Environment

<img src="https://img.shields.io/badge/visual Studio code-007ACC?style=for-the-badge&logo=VisualStudioCode&logoColor=white">
<img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white">
<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">

### Config

<img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white">

### Communication

<img src="https://img.shields.io/badge/discord-5865F2?style=for-the-badge&logo=discord&logoColor=white">
<img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white">
