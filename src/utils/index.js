import { entryKey } from '../constant'
/**
 * @description 生成UUID
 * @returns 
 */
export function generateUUID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16))
}
/**
 * @description 二进制转十进制
 * @param {*} binary 
 * @returns 
 */
export function binaryToDecimal(binary) {
    let decimal = 0
    let power = 0
    for (let i = binary.length - 1; i >= 0; i--) {
        if (binary[i] === '1') {
            decimal += Math.pow(2, power)
        }
        power++
    }
    return decimal
}
/**
 * @description 根据key获取二进制
 * @param {*} key 
 * @returns 
 */
export function getBinaryByKey(key = 'INIT') {
    const value = entryKey[key]
    if (value === undefined) {
        throw new Error(`Invalid key: ${key}`)
    }
    return value.toString(2).padStart(4, '0')
}
/**
 * @description 根据二进制获取key
 * @param {*} Binary 
 * @returns 
 */
export function getKeyByBinary(Binary) {
    let findIndex = Object.values(entryKey).findIndex((key) => key === binaryToDecimal(Binary))
    return Object.keys(entryKey)[findIndex]
}
/**
 * @description 获取类型
 * @param {*} value 
 * @returns 
 */
export function typeOf(value) {
    return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}
