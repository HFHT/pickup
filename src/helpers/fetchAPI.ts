
interface State {
  req?: object
  error?: Error
  isObj?: Boolean
}
type Group = { id: number }
const baseURL = `${import.meta.env.VITE_MONGO_URL}`;

export async function fetchSAS() {
  try {
    const { url, sasKey } = await (await fetch(`${import.meta.env.VITE_AZURE_FUNC_URL}/api/HFHTSasToken?cont=habistorepickup`)).json();
    return { url, sasKey };
  } catch (error: any) { console.log(error); return null }
}

// Used before React is loaded
export async function fetchAPI({ req, error, isObj = false }: State): Promise<State> {
  console.log(req);
  const headers = new Headers();
  const options = {
    method: "GET",
    headers: headers
  };
  return fetch(`${baseURL}?req=${encodeURIComponent(JSON.stringify(req))}`, options)
    .then(response => response.json())
    .then(data => { return isObj ? data : data[0] })
    .catch(error => { console.log(error); return null });
}

// Used by React UseQuery Hook to fetch data, the collection is passed.
interface FetchDB {
  db: string;
  _id?: number | string | null;
}

export const fetchDB = ({ queryKey }: any): Promise<Group[]> => {
  const [_key, db, _id] = queryKey;
  console.log(queryKey);
  let find = _id ? { _id: _id } : null;
  return (
    fetch(`${baseURL}?req=${encodeURIComponent(JSON.stringify({ method: 'find', db: 'Truck', collection: db, find: find }))}`, { method: "GET", headers: new Headers() })
      .then(response => response.json())
      .then(data => { return data })
      .catch(error => { console.log(error); /*alert('Could not get the Schedule from the Database.');*/ return [] })
  )
}

export const fetchDBrev = ({ queryKey }: any): Promise<Group[]> => {
  const [_key, db, _id] = queryKey;
  console.log(queryKey);
  let find = _id ? { _id: _id } : null;
  return (
    fetch(`${baseURL}?req=${encodeURIComponent(JSON.stringify({ method: 'find', db: 'Truck', collection: db, find: find, sort: { _id: -1 } }))}`, { method: "GET", headers: new Headers() })
      .then(response => response.json())
      .then(data => { return data })
      .catch(error => console.log(error))
  )
}

export const updateDB = ({ item, insert, db }: any): Promise<Group> => {
  console.warn('updateDB', item, insert, db);
  const header: any = { method: "POST", headers: new Headers() };
  let method = 'updateOne';
  let find: any = { _id: item._id }
  if (insert) {
    method = 'insertOne';
    find = {}
    //delete item._id;
  }

  header.body = JSON.stringify({ method: method, db: 'Truck', collection: db, data: { ...item }, find: find })

  return (
    fetch(`${import.meta.env.VITE_MONGO_URL}`, header)
      .then(response => response.json())
      .then(data => { return data })
      .catch(error => {
        console.log(error)
        // alert('There is a problem with the network, please try again later.')
      })
    //  if (!(dbData.hasOwnProperty('acknowledged') && dbData.acknowledged)) {    
  )
}
