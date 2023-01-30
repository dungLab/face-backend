const ADJECTIVE = [
  '사나운',
  '귀여운',
  '멋진',
  '엄청난',
  '대단한',
  '화난',
  '깜찍한',
  '활기찬',
  '예민한',
  '부드러운',
  '딱딱한',
  '잘생긴',
  '예쁜',
  '근육질의',
  '유쾌한',
  '시니컬한',
  '부끄러운',
] as const;

const OBJECT = [
  '사자',
  '호랑이',
  '토끼',
  '낙타',
  '기린',
  '코끼리',
  '하마',
  '용',
  '여우',
  '늑대',
  '개구리',
  '참새',
  '비둘기',
  '독수리',
  '상어',
  '고래',
  '참돔',
  '방어',
  '참치',
  '너구리',
  '생쥐',
  '돼지',
] as const;

export function generateRandomNickName(): string {
  const adjLength = ADJECTIVE.length;
  const objLength = OBJECT.length;

  // adj
  const randomAdjIdx = Math.floor(Math.random() * adjLength);
  const randomAdj = ADJECTIVE[randomAdjIdx];

  // obj
  const randomObjIdx = Math.floor(Math.random() * objLength);
  const randomObj = OBJECT[randomObjIdx];

  // number
  const firstNum = Math.floor(Math.random() * 10);
  const secondNum = Math.floor(Math.random() * 10);
  const thirdNum = Math.floor(Math.random() * 10);

  return `${randomAdj}${randomObj}${firstNum}${secondNum}${thirdNum}`;
}
