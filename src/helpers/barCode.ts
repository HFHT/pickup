// Returns a string of length "bl" which includes the passed barcode "bc"
export const barCode = (bc: string | number, bl: number = 9) => {
    console.log(bc, bl);
    return ('0000000000' + bc.toString()).slice(-bl);
};

//Unique bar code with check digit, won't repeat for over 20 years.
//Bar code: 1st number is 4 (for local use), next 10 are based on tenths of a second, last is a check digit
export const uniqueBarCode = () => {
    let u = ('4' + Math.floor(Date.now() / 100).toString().slice(-10)).split('').map(Number);
    // Sum of evens multiplied by 3 plus sum of odds
    const b = (u[0] + u[2] + u[4] + u[6] + u[8] + u[10]) * 3 + (u[1] + u[3] + u[5] + u[7] + u[9]);
    // Calculate the value required to round up to the nearest multiple of 10
    u[11] = (Math.ceil(b / 10) * 10) - b;
    return u.join('');
}