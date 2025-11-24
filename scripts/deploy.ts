import { ethers } from "hardhat";

async function main() {
  // 배포에 사용할 첫 번째 signer (네트워크에 따라 자동으로 선택)
  const [deployer] = await ethers.getSigners();
  console.log("배포자 주소:", deployer.address);

  // 컨트랙트 팩토리 획득 후 배포 진행
  const MyNft = await ethers.getContractFactory("MyNft");
  const myNft = await MyNft.deploy();

  // 배포 완료 대기 (ethers v6 패턴)
  await myNft.waitForDeployment();

  const contractAddress = await myNft.getAddress();
  console.log("MyNft 배포 완료! 주소:", contractAddress);

  // 생성자에서 자동 민팅된 tokenId 1의 소유자 확인
  const ownerOfFirst = await myNft.ownerOf(1);
  console.log("tokenId 1 소유자:", ownerOfFirst);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
