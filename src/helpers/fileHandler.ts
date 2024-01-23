export function fileType(filename: string | undefined | null): string {
    console.log('fileType', filename)
    if (!filename) return ""
    var a = filename.split(".");
    if (a.length === 1 || (a[0] === "" && a.length === 2)) {
        return ""
    }
    return a[1].toUpperCase()
}
export function fileName(filename: string | undefined | null): string {
    if (!filename) return ""
    var a = filename.split(".");
    if (a.length === 1 || (a[0] === "" && a.length === 2)) {
        return filename;
    }
    return a[0]
}