# 메타마스크 연동 가이드 (Hardhat 로컬 + Sepolia)

## 준비물
- 메타마스크 설치 및 지갑 생성 완료
- Hardhat 프로젝트 준비 (이 저장소)
- 로컬 테스트 시: `npx hardhat node` 실행
- Sepolia 테스트 시: `.env`에 `SEPOLIA_RPC_URL`, `PRIVATE_KEY` 설정

---

## 1. 네트워크 추가

### 로컬 Hardhat
- 네트워크 이름: `Hardhat Local`
- RPC URL: `http://127.0.0.1:8545`
- 체인 ID: `31337`
- 통화 기호: `ETH`

### Sepolia
- 네트워크 이름: `Sepolia`
- RPC URL: `.env`에 입력한 엔드포인트 (예: `https://sepolia.infura.io/v3/...`)
- 체인 ID: `11155111`
- 통화 기호: `ETH`

---

## 2. 테스트 계정 가져오기 (로컬 노드)
1. 터미널에서 로컬 노드를 실행:
```bash
npx hardhat node
```
2. 출력되는 `Account #0`의 프라이빗 키를 복사 (예: `0xac09...f2ff80`).
3. 메타마스크 → 계정 가져오기 → 프라이빗 키 붙여넣기.
   - 주소 예시: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
   - 이 계정이 로컬 배포 시 기본 배포자가 됨.

---

## 3. 컨트랙트 배포

### 로컬 배포
터미널 새 창에서 (노드 실행 중이어야 함):
```bash
cd ~/Desktop/ethereumERC721
npx hardhat run scripts/deploy.ts --network localhost
## dongunCoin(명함) 배포
npx hardhat run scripts/deploy-donguncoin.ts --network localhost
```
- 출력되는 컨트랙트 주소를 메모 (예: `0x5FbD...aa3`).

### Sepolia 배포
`.env` 설정 후:
```bash
cd ~/Desktop/ethereumERC721
npx hardhat run scripts/deploy.ts --network sepolia
## dongunCoin(명함) 배포
npx hardhat run scripts/deploy-donguncoin.ts --network sepolia
```
- 콘솔에 표시된 컨트랙트 주소를 메모.

---

## 4. 메타마스크에 NFT 추가
1. 메타마스크 → 포트폴리오(Portfolio) → NFT → “수동으로 추가”.
2. 컨트랙트 주소: 위에서 배포 시 나온 주소.
3. 토큰 ID: `1` (배포 시 자동 민팅된 첫 NFT).
4. 추가하면 NFT 목록에 표시됩니다.

---

## 5. 추가 민팅 (옵션)
배포자는 `mint`를 호출해 새 NFT를 발행할 수 있습니다.

```bash
npx hardhat console --network localhost   # 또는 sepolia
```
콘솔 내부:
```js
const MyNft = await ethers.getContractFactory("MyNft");
const myNft = MyNft.attach("배포_주소");    // 배포된 컨트랙트 주소 입력
const tx = await myNft.mint("받을_주소");   // 새 NFT 받을 지갑 주소
await tx.wait();
```
- 새 토큰 ID(2, 3 …)는 메타마스크 NFT 추가 시 `토큰 ID` 값만 변경해서 입력하면 됩니다.

---

## 6. 확인 팁
- 로컬: `npx hardhat console --network localhost` 후 `await myNft.ownerOf(1)` 등으로 소유자 확인.
- Sepolia: Etherscan/Blockscout에서 컨트랙트 주소 조회 → `ownerOf(1)` 읽기.

---

## 7. Node 버전 주의
- Hardhat은 Node 20 사용을 권장합니다. Node 25에서는 경고가 나오지만 로컬 테스트는 동작합니다.
