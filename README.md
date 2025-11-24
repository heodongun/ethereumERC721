# MyNft (ERC-721) 예제 프로젝트

Hardhat, OpenZeppelin, Ethers v6를 사용한 ERC-721 예제입니다. 배포 시 배포자에게 tokenId 1을 자동으로 민팅하며, 이후 민팅은 컨트랙트 오너만 수행할 수 있습니다. 로컬 Hardhat 노드와 Sepolia 테스트넷 배포 예시를 제공합니다.

## 컨트랙트 개요
- 컨트랙트 이름: `MyNft`
- 상속: `ERC721`, `Ownable`
- 생성자에서 이름/심볼을 `"My NFT"`, `"MYNFT"`로 고정 설정 후 배포자에게 tokenId 1 자동 민팅
- `_nextTokenId`를 2부터 시작해 `mint` 호출 시마다 1씩 증가
- `mint(address to)`는 `onlyOwner` 제어
- `setBaseURI(string newBaseURI)`로 메타데이터 기본 URI 설정 가능

### 온라인 명함 NFT (dongunCoin)
- 컨트랙트 이름: `DongunCoin`
- 상속: `ERC721URIStorage`, `Ownable`
- `mintCard(address to, string cardURI)`: 오너가 명함 NFT 발행 (`CardMinted` 이벤트 발생)
- `updateCardURI(uint256 tokenId, string newCardURI)`: 토큰 소유자만 명함 정보 URI 갱신 가능 (`CardUpdated` 이벤트 발생)
- 사용 예: 명함 정보를 JSON 메타데이터로 만들고(IPFS/HTTPS), `cardURI`에 전달

## 사전 준비
- Node.js 20.x + npm (Node 25 관련 이슈 회피)
- 메타마스크 테스트 지갑 (Sepolia 테스트넷 추가 및 테스트 ETH 보유)
- RPC 엔드포인트 (Infura/Alchemy 등) 및 프라이빗 키 준비

## 환경 변수 설정
`.env.example`를 복사해 `.env`를 만들고 값을 채웁니다.

```bash
cp .env.example .env
# .env 파일을 열어 값 입력
SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/..."
PRIVATE_KEY="0xaaaaaaaa..."   # 메타마스크 계정의 프라이빗 키
```

## 설치 & 컴파일
```bash
npm install
npx hardhat compile
```

## 테스트 실행
추가된 테스트를 실행하여 컨트랙트가 올바르게 동작하는지 확인합니다.
```bash
npx hardhat test
```

## 로컬 네트워크에서 테스트
1) 로컬 노드 실행  
```bash
npx hardhat node
```

2) 새 터미널에서 배포  
```bash
npx hardhat run scripts/deploy.ts --network localhost
```

3) 출력 확인  
- 배포자 주소, 컨트랙트 주소, tokenId 1 소유자 주소가 콘솔에 표시됩니다.

### 명함 NFT 로컬 배포
```bash
npx hardhat run scripts/deploy-donguncoin.ts --network localhost
```
- `DongunCoin` 배포 후 배포자에게 샘플 명함 1개를 민팅합니다.

## Sepolia 테스트넷 배포
1) `.env`에 `SEPOLIA_RPC_URL`, `PRIVATE_KEY` 값 입력  
2) 배포 실행  
```bash
npx hardhat run scripts/deploy.ts --network sepolia
```
명함 NFT:
```bash
npx hardhat run scripts/deploy-donguncoin.ts --network sepolia
```
3) 콘솔에서 컨트랙트 주소 확인 후 Etherscan(또는 Blockscout)에서 조회합니다.  
4) `ownerOf(1)` 호출로 첫 번째 NFT 소유자(배포자)를 확인합니다.

## 직접 NFT 추가 민팅 예시
배포자는 `mint`를 호출해 추가 NFT를 발행할 수 있습니다.

```bash
# Hardhat 콘솔 예시 (네트워크에 맞춰 변경)
npx hardhat console --network sepolia
```

콘솔 내부:
```js
const MyNft = await ethers.getContractFactory("MyNft");
const myNft = MyNft.attach("컨트랙트_주소");
const tx = await myNft.mint("받을_지갑주소");
await tx.wait();
```

### 배포 후 확인 방법
- 블록 익스플로러에서 컨트랙트 주소 검색
- `ownerOf(1)` 호출 → 배포자 주소 확인
- `ownerOf(2)` 등으로 새로 민팅한 토큰 소유자 확인

### 명함 NFT 메타데이터 예시
```json
{
  "name": "홍길동 | Business Card",
  "description": "웹3 개발자 명함",
  "image": "https://pbs.twimg.com/media/FrV6PijakAEExDY.png",
  "attributes": [
    { "trait_type": "Company", "value": "ACME Web3" },
    { "trait_type": "Role", "value": "Blockchain Engineer" },
    { "trait_type": "Email", "value": "hello@example.com" },
    { "trait_type": "Website", "value": "https://example.com" }
  ]
}
```
- 위 JSON을 IPFS(예: Pinata, web3.storage)나 HTTPS 서버에 업로드 후 URL/CID를 `mintCard` 또는 `updateCardURI` 인자로 전달하세요. `image` 필드 기본값은 `https://pbs.twimg.com/media/FrV6PijakAEExDY.png`입니다.

## 명령어 요약
```bash
# 설치
npm install

# 컴파일
npx hardhat compile

# 로컬 배포
npx hardhat node            # 터미널 1
npx hardhat run scripts/deploy.ts --network localhost   # 터미널 2
npx hardhat run scripts/deploy-donguncoin.ts --network localhost   # 명함 NFT

# Sepolia 배포
npx hardhat run scripts/deploy.ts --network sepolia
npx hardhat run scripts/deploy-donguncoin.ts --network sepolia

# 블록 탐색기/메타마스크에서 컨트랙트 주소 확인 후 ownerOf(1) 조회
```

## 메타마스크 연동
- 로컬/세폴리아 네트워크 추가, 테스트 계정 가져오기, NFT 수동 추가 방법은 `METAMASK.md`를 참고하세요.

## 웹 대시보드 (온라인 명함 발행/조회)
- 경로: `frontend/index.html`
- 기능: Metamask 연결, `DongunCoin` 주소 연결, 명함 민팅/업데이트, `ownerOf`·`tokenURI` 조회
- 실행 방법:
  1) 간단히 파일을 브라우저로 열어도 되지만, 권장: 로컬 서버 사용  
     ```bash
     npm install -g http-server   # 없다면 설치
     http-server frontend -p 5173
     ```  
     브라우저에서 `http://localhost:5173` 접속.
  2) 메타마스크 네트워크를 Hardhat(31337) 또는 Sepolia(11155111)로 전환.
  3) “지갑 연결” → 배포한 `DongunCoin` 주소 입력 → 민팅/업데이트/조회 사용.
- 메타데이터는 IPFS/HTTPS에 올린 뒤 URI를 입력하세요.

## 대화/학습 요약 (기억용)
- Hardhat + OpenZeppelin 기반 ERC-721 예제 구축 → MyNft와 명함형 DongunCoin(NFT) 작성.
- DongunCoin은 ERC721URIStorage/Ownable, 오너 전용 `mintCard`, 소유자/승인자의 `updateCardURI`.
- 배포/콘솔 사용 중 발생한 이슈들:
  - Node 25 경고: 무시 가능하지만 Node 20 권장.
  - 주소를 문자열 "배포주소"로 넣어 발생한 `resolveName` 에러 → 실제 주소로 attach 필요.
  - REPL 변수 중복: 새 변수명 사용(c2) 또는 콘솔 재시작.
  - 민팅 후 메타마스크는 자동 표시 안 됨 → 네트워크 맞추고 NFT 수동 추가(컨트랙트 주소 + 토큰 ID).
  - Sepolia 가스 부족 → 퍼셋에서 테스트 ETH 수령 후 배포/민팅 성공.
- 기본 메타데이터에 이미지 URL을 `https://pbs.twimg.com/media/FrV6PijakAEExDY.png`로 통일.
