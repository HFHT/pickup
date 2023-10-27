// Returns the array index of the record that contains the _id passed as a parameter
export const find_id = (property: any, _id: number | string, array: any) => {
    return array.findIndex((a: any) => a[property] === _id);
};

// Returns the array element of the record that contains the _id passed as a parameter
export const find_row = (property: any, _id: number | string, array: any) => {
    return array.find((a: any) => a[property] === _id);
};