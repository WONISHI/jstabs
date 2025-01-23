import { enumKey } from './enum'
export function generateUUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16))
}

// 通过code获取对应的枚举值然后转成32位的二进制数
export function getenumKey(code) {
  const enumValue = enumKey[code] // 获取枚举值
  if (enumValue !== undefined) {
    return enumValue.toString(2).padStart(32, '0')
  }
  return '00000000000000000000000000000000' // 如果枚举值不存在，返回32个零
}
