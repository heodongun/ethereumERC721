# MyNft (ERC-721) 예제 프로젝트

Hardhat, OpenZeppelin, Ethers v6를 사용한 ERC-721 예제입니다. 배포 시 배포자에게 tokenId 1을 자동으로 민팅하며, 이후 민팅은 컨트랙트 오너만 수행할 수 있습니다. 로컬 Hardhat 노드와 Sepolia 테스트넷 배포 예시를 제공합니다.

## 컨트랙트 개요
- 컨트랙트 이름: `MyNft`
- 상속: `ERC721`, `Ownable`
- 생성자에서 이름/심볼을 `"My NFT"`, `"MYNFT"`로 고정 설정 후 배포자에게 tokenId 1 자동 민팅
- `_nextTokenId`를 2부터 시작해 `mint` 호출 시마다 1씩 증가
- `mint(address to)`는 `onlyOwner` 제어
- `setBaseURI(string newBaseURI)`로 메타데이터 기본 URI 설정 가능

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

## Sepolia 테스트넷 배포
1) `.env`에 `SEPOLIA_RPC_URL`, `PRIVATE_KEY` 값 입력  
2) 배포 실행  
```bash
npx hardhat run scripts/deploy.ts --network sepolia
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

## 명령어 요약
```bash
# 설치
npm install

# 컴파일
npx hardhat compile

# 로컬 배포
npx hardhat node            # 터미널 1
npx hardhat run scripts/deploy.ts --network localhost   # 터미널 2

# Sepolia 배포
npx hardhat run scripts/deploy.ts --network sepolia

# 블록 탐색기/메타마스크에서 컨트랙트 주소 확인 후 ownerOf(1) 조회
```

## 메타마스크 연동
- 로컬/세폴리아 네트워크 추가, 테스트 계정 가져오기, NFT 수동 추가 방법은 `METAMASK.md`를 참고하세요.
