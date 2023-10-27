export const dateDB = () => {
    // Return current date in DB format
    const theDate = new Date;
    return theDate.toISOString().substring(0, 10);
};

export const dateFormat = (date: any) => {
    // Return the provided date in a yyyy-mm-dd format
    var d = date ? new Date(date) : new Date()
    return dateElements(d);
}

export const dateDayName = (date: any) => {
    const dow: any = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const d = newDate(date)
    return dow[d.getDay()];
}

export const dateAdjust = (date: any, adjust: number) => {
    // Return the date adjusted by the amount in adjust. Date gymnastics due to Date(date) returning yesterday
    let d = newDate(date)
    d.setDate(d.getDate() + adjust);
    return dateElements(d)
}


export function dateDiffInDays(d1: any, d2: any) {
    const a = newDate(d1)
    const b = newDate(d2)
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
console.log(Math.floor((utc2 - utc1) / _MS_PER_DAY))
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

function dateElements(d: any) {
    // Return a date in the format of yyyy-mm-dd
    var month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function newDate(date: any) {
    const parts = date.split('-')
    let d = new Date(parts[0], parts[1] - 1, parts[2])
    return d
}