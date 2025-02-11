type ConsoleMethod = 'log' | 'info' | 'warn' | 'error'
export function log(type: ConsoleMethod, ...args: any[]) {
    console[type]('%c%s%c%s', 'color:red;font-weight:bold;', type, 'color:black;font-weight:bold;', ...args)
}
export default log
