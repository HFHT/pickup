export function Error({ sas, settings }: any) {
    console.log(sas, settings)
    return (
        <><h2>Something went wrong.</h2>
            {(!sas && settings) && <div>Network error retrieving authorization key</div> }
            {(sas && !settings) && <div>Network error retrieving application data</div> }
            {(!sas && !settings) && <div>Network error, check your network connections.</div> }
            <h4>Corrective Actions</h4>
            <ul>
                <li>Network error, please check your connections. Tray again later.</li>
                <p>or</p>
                <li>You have an older browser and may want to consider updating it.</li>
            </ul>
        </>
    )
}