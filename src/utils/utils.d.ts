/* eslint-disable */
export function md5(res: string): string
export function ab2str(res: string): Promise
export function getThemeColor(res: string): string | null
export function setStorage(key:string, val: string | undefined): void
export function getStorage(key:string): string
export function clearStorage(): void
export function getToken(): string
export function getTime(key:string | number, t: {(key: string | number): string}): string
export function formateTime(key:number, t: {(key: string | number): string}): string
export function isCurrentChat(key:string, yUid: string, uid: string): boolean
export function getTag(key:IContacts): string
export function getSize(key:number): string
export function getSuffix(key:string): string
export function getLang(): number
export function getMsgList(): Object
export function setMsgList(val: any): void
export function getDeviceUuidStr(): Promise