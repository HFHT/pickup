export function nullOrUndefined(e:any) {
    if (e=== null) return ''
    if (e=== undefined) return ''
    return e
}