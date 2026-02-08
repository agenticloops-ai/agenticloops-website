import { Header, Hero, Topics, RepoSection, About, Team, Subscribe, Footer } from './index';
import { ThemeProvider } from '../ThemeContext';

export default function AppIsland() {
    return (
        <ThemeProvider>
            <div style={{ position: 'relative', zIndex: 2 }}>
                <Header />
                <main>
                    <Hero />
                    <About />
                    <Team />
                    <RepoSection />
                    <Topics />
                    <Subscribe />
                </main>
                <Footer />
            </div>
        </ThemeProvider>
    );
}
