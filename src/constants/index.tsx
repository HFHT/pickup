
export const CONST_ROUTES = ['Unassigned', 'Blue', 'Red', '3rd', 'Corporate']
export const CONST_TIMES = ['9AM', '10AM', '11AM', 'Noon', '1PM', '2PM', '3PM', '4PM', '5PM']


export const routeLoadSize: any =
// Number of slots per day Sun-Sat
{
  'Blue': [0, 0, 10, 10, 10, 10, 12],
  'Red': [0, 0, 10, 10, 10, 10, 12],
  '3rd': [0, 0, 6, 6, 6, 0, 0],
  'Corp': [0, 0, 0, 0, 0, 0, 0]
}


export const routeZips: any =
// Sun 0, Mon 1, Tue 2, Wed 3, Thu 4, Fri 5, Sat 6
{
  85614: [{ dow: 4, rt: ['Blue', 'Red'] }],
  85622: [{ dow: 4, rt: ['Blue', 'Red'] }],
  85629: [{ dow: 4, rt: ['Blue', 'Red'] }],
  85641: [{ dow: 4, rt: ['Blue', 'Red'] }],
  85653: [{ dow: 2, rt: ['Blue', 'Red'] }],
  85658: [{ dow: 2, rt: ['Blue', 'Red'] }],
  85701: [{ dow: 2, rt: ['Blue', 'Red'] }],
  85702: [{ dow: 2, rt: ['Blue', 'Red'] }],
  85704: [{ dow: 3, rt: ['Blue', 'Red'] }],
  85705: [{ dow: 2, rt: ['Blue', 'Red', '3rd'] }, { dow: 3, rt: ['3rd'] }, { dow: 4, rt: ['Blue', 'Red'] }, { dow: 5, rt: ['Blue', 'Red'] }],
  85706: [{ dow: 4, rt: ['Blue', 'Red'] }],
  85707: [{ dow: 4, rt: ['Red'] }],
  85708: [{ dow: 4, rt: ['Red'] }],
  85710: [{ dow: 1, rt: ['Red'] }],
  85711: [{ dow: 1, rt: ['Blue', 'Red'] }],
  85712: [{ dow: 1, rt: ['Blue', 'Red'] }],
  85713: [{ dow: 4, rt: ['Blue', 'Red'] }],
  85714: [{ dow: 4, rt: ['Blue', 'Red'] }],
  85715: [{ dow: 1, rt: ['Red'] }],
  85716: [{ dow: 1, rt: ['Blue', 'Red'] }],
  85718: [{ dow: 1, rt: ['Blue', 'Red'] }, { dow: 5, rt: ['Blue', 'Red'] }],
  85719: [{ dow: 1, rt: ['Blue', 'Red'] }, { dow: 5, rt: ['Blue', 'Red'] }],
  85726: [{ dow: 4, rt: ['Blue', 'Red'] }],
  85730: [{ dow: 1, rt: ['Blue', 'Red'] }],
  85735: [{ dow: 4, rt: ['Blue', 'Red'] }],
  85736: [{ dow: 4, rt: ['Blue', 'Red'] }],
  85737: [{ dow: 3, rt: ['Blue', 'Red'] }],
  85739: [{ dow: 4, rt: ['Blue', 'Red'] }],
  85741: [{ dow: 2, rt: ['Blue', 'Red'] }, { dow: 3, rt: ['Blue', 'Red'] }],
  85742: [{ dow: 2, rt: ['Blue', 'Red'] }],
  85743: [{ dow: 2, rt: ['Blue', 'Red'] }],
  85744: [{ dow: 4, rt: ['Blue', 'Red'] }],
  85745: [{ dow: 2, rt: ['Blue', 'Red', '3rd'] }, { dow: 3, rt: ['3rd'] }, { dow: 4, rt: ['Blue', 'Red', '3rd'] }],
  85746: [{ dow: 4, rt: ['Blue', 'Red'] }],
  85747: [{ dow: 4, rt: ['Blue', 'Red'] }],
  85748: [{ dow: 1, rt: ['Blue', 'Red'] }],
  85749: [{ dow: 5, rt: ['Blue', 'Red'] }],
  85750: [{ dow: 5, rt: ['Blue', 'Red'] }],
  85755: [{ dow: 3, rt: ['Blue', 'Red'] }],
  85756: [{ dow: 4, rt: ['Blue', 'Red'] }],
  85757: [{ dow: 4, rt: ['Blue', 'Red'] }],
  // Sun 0, Mon 1, Tue 2, Wed 3, Thu 4, Fri 5, Sat 6

}