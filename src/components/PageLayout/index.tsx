import { Header } from '../Header';
import './pagelayout.css';

interface IPL {
    children?: React.ReactNode;
}

export function PageLayout({ children }: IPL) {

    return (
        <>
            <div className="pagetop">
                <header className="pageheader">
                   <Header />
                </header>
                <main className="pagemain">
                    {children}
                </main>
                <footer className="pagefooter">
                    Copyright<span>&copy;</span> Habitat for Humanity Tucson 2023
                </footer>
            </div>
        </>
    )
}