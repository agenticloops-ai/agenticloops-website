
import { ThemeProvider } from '../ThemeContext';
import { Header as HeaderComponent } from './Header';
import { Hero as HeroComponent } from './Hero';
import { About as AboutComponent } from './About';
import { Team as TeamComponent } from './Team';
import { RepoSection as RepoSectionComponent } from './RepoSection';
import { Topics as TopicsComponent } from './Topics';
import { Subscribe as SubscribeComponent } from './Subscribe';
import { Footer as FooterComponent } from './Footer';
import { PatternsPage as PatternsPageComponent } from './PatternsPage';
import { PatternsPreview as PatternsPreviewComponent } from './PatternsPreview';

function withTheme<T extends object>(Component: React.ComponentType<T>) {
    return (props: T) => (
        <ThemeProvider>
            <Component {...props} />
        </ThemeProvider>
    );
}

export const Header = withTheme(HeaderComponent);
export const Hero = withTheme(HeroComponent);
export const About = withTheme(AboutComponent);
export const Team = withTheme(TeamComponent);
export const RepoSection = withTheme(RepoSectionComponent);
export const Topics = withTheme(TopicsComponent);
export const Subscribe = withTheme(SubscribeComponent);
export const Footer = withTheme(FooterComponent);
export const PatternsPageIsland = withTheme(PatternsPageComponent);
export const PatternsPreview = withTheme(PatternsPreviewComponent);
