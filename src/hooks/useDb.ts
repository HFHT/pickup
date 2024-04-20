
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchDB, find_id, updateDB } from "../helpers";
import { useState } from "react";

interface IuseDB {
    key: string
    theDB: string
    _id?: string | null
    interval?: number
}
//useDb({key:'schedule', theDB: 'Schedule', _id: null, interval:4})
export function useDb({ key, theDB, _id = null, interval = 4 }: IuseDB) {
    const [isFetching, setIsFetching] = useState(false)
    const { data: retDB, refetch }: any = useQuery<any>({ queryKey: [key, theDB, _id], queryFn: fetchDB, refetchInterval: 1000 * 60 * interval })
    const queryClient = useQueryClient();

    const updateItems = useMutation<any, any, { item: any, db: string, insert: boolean }>(
        ({ item, db, insert }) => updateDB({ item, db, insert }),
        {
            onSuccess: (i) => {
                console.warn(i, i._id);
                queryClient.setQueryData([key, theDB, i._id], i);
                queryClient.invalidateQueries({ queryKey: [key] })
                setIsFetching(false)
            }
        }
    );

    function doMutation(newRecord: any, db: any, insert: boolean = false) {
        if (!newRecord) return
        setIsFetching(true)
        let rdx = find_id('_id', newRecord._id, db)
        if (rdx < 0) {
            newRecord && updateItems.mutate({ item: { ...newRecord }, db: theDB, insert: true });
        } else {
            newRecord && updateItems.mutate({ item: { ...newRecord }, db: theDB, insert: insert });
        }
    }

    function mutateDB(newRecord: IScheds | undefined, db: Idb) {
        // See if the date record exists, if no then save as a new record;
        // if yes then see if the appt is already in the arrray, if yes then update it, if not add it, then mutate the DB record
        if (!newRecord) return
        setIsFetching(true)
        let rdx: any = find_id('_id', newRecord._id, db)
        console.log('useDb-mutateDB', rdx, newRecord, db)
        if (rdx < 0) {
            newRecord && updateItems.mutate({ item: { ...newRecord }, db: theDB, insert: true });
        } else {
            // console.log(db[rdx].c, newRecord.c[0])
            // console.log(db[rdx].c.findIndex((e: any) => e.id === newRecord.c[0].id))
            let edx: any = db[rdx].c.findIndex((e: any) => e.id === newRecord.c[0].id)
            let theRows: any = db[rdx].c
            console.log('useDb-mutateDB-addNew', edx, theRows)
            if (edx < 0) {
                // console.log('push')
                theRows.push(newRecord.c[0])
            } else {
                // console.log('update')
                theRows[edx] = newRecord.c[0]
            }
            updateItems.mutate({ item: { ...newRecord, c: theRows }, db: theDB, insert: false })
        }
        return
    }

    function update(curRecord: IScheds | undefined, insert = false) {
        setIsFetching(true)
        curRecord && updateItems.mutate({ item: { ...curRecord }, db: theDB, insert: insert });
        return
    }

    return [retDB, doMutation, update, isFetching, refetch] as const;
}
