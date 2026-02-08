import { Header, Hero, Topics, RepoSection, About, Team, Subscribe, Footer } from './components';
import { ThemeProvider } from './ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div style={{ paddingTop: '4rem', position: 'relative', zIndex: 2 }}>
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

export default App;
