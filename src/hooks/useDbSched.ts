// Returns items array (oldest to newest) from the database or cache
// Adds an item
// Updates an item

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchDB, updateDB } from "../helpers/fetchAPI";
import { find_id } from "../helpers/find_id";
// import { find_id, find_row, updateDB } from "../helpers";

export function useDbSched() {
    const sched: Idb = useQuery<any>({ queryKey: ['schedule', 'Schedule'], queryFn: fetchDB, refetchInterval: 1000 * 60 * 2 }).data
    const queryClient = useQueryClient();

    const updateItems = useMutation<any, any, { item: any, db: string, insert: boolean }>(
        ({ item, db, insert }) => updateDB({ item, db, insert }),
        {
            onSuccess: (i) => {
                console.warn(i, i._id);
                queryClient.setQueryData(['schedule', 'Schedule', i._id], i);
                queryClient.invalidateQueries({ queryKey: ['schedule'] })
            }
        }
    );

    function addNew(newRecord: IScheds | undefined, db: Idb) {
        // See if the date record exists, if no then save as a new record;
        // if yes then see if the appt is already in the arrray, if yes then update it, if not add it, then save as update
        if (!newRecord) return
        let rdx: any = find_id('_id', newRecord._id, db)
        console.log('addNew', rdx, newRecord, db)
        if (rdx < 0) {
            newRecord && updateItems.mutate({ item: { ...newRecord }, db: 'Schedule', insert: true });
        } else {
            console.log(db[rdx].c, newRecord.c[0])
            console.log(db[rdx].c.findIndex((e: any) => e.id === newRecord.c[0].id))
            let edx: any = db[rdx].c.findIndex((e: any) => e.id === newRecord.c[0].id)
            let theRows: any = db[rdx].c
            console.log('addNew', edx, theRows)
            if (!edx || edx < 0) {
                console.log('push')
                theRows.push(newRecord.c[0])
            } else {
                console.log('update')
                theRows[edx] = newRecord.c[0]
            }
            updateItems.mutate({ item: { ...newRecord, c: theRows }, db: 'Schedule', insert: false })
        }
        return
    }

    function update(curRecord: IScheds | undefined) {
        curRecord && updateItems.mutate({ item: { ...curRecord }, db: 'Schedule', insert: false });
        return
    }

    return [sched, addNew, update] as const;
}
