
export const update = async (item: any, dbName: string, insert: boolean) => {
  // console.warn('updateDB', item, insert, db);
  try {
    if (item._id === '') {
      throw new Error(`Refused attempt to insert a blank record!`);
    }
    const header: any = { method: "POST", headers: new Headers() };
    let method = 'updateOne';
    let find: any = { _id: item._id }
    if (insert) {
      method = 'insertOne';
      find = {}
      //delete item._id;
    }
    header.body = JSON.stringify({ method: method, db: 'Truck', collection: dbName, data: { ...item }, find: find })
    const res = await fetch(`${import.meta.env.VITE_MONGO_URL}`, header);
    console.log(res)
    if (!res.ok) {
      throw new Error(`${res.status}: ${await res.text()}`);
    }
  } catch (e) {
    throw new Error(`Unknown error trying to save the record.`)
  }
}
