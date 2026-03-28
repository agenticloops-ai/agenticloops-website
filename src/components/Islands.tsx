
import { ThemeProvider } from '../ThemeContext';
import { Header as HeaderComponent } from './Header';
import { Hero as HeroComponent } from './Hero';
import { About as AboutComponent } from './About';
import { Team as TeamComponent } from './Team';
import { RepoSection as RepoSectionComponent } from './RepoSection';
import { Topics as TopicsComponent } from './Topics';
import { Subscribe as SubscribeComponent } from './Subscribe';
import { Footer as FooterComponent } from './Footer';
import { DimensionGrid as DimensionGridComponent } from './learn/DimensionGrid';
import { ArchetypeGallery as ArchetypeGalleryComponent } from './learn/ArchetypeGallery';
import { RadarChart as RadarChartComponent } from './learn/RadarChart';
import { LevelLadder as LevelLadderComponent } from './learn/LevelLadder';
import { ArchetypeCard as ArchetypeCardComponent } from './learn/ArchetypeCard';
import { DimensionBar as DimensionBarComponent } from './learn/DimensionBar';
import { PatternsPage as PatternsPageComponent } from './PatternsPage';
import { PatternsPreview as PatternsPreviewComponent } from './PatternsPreview';
import { TutorialsPage as TutorialsPageComponent } from './TutorialsPage';
import { TutorialsPreview as TutorialsPreviewComponent } from './TutorialsPreview';
import { ThreeWaysIn as ThreeWaysInComponent } from './ThreeWaysIn';
import { LearnLanding as LearnLandingComponent } from './learn/LearnLanding';

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
export const DimensionGrid = withTheme(DimensionGridComponent);
export const ArchetypeGallery = withTheme(ArchetypeGalleryComponent);
export const RadarChart = withTheme(RadarChartComponent);
export const LevelLadder = withTheme(LevelLadderComponent);
export const ArchetypeCard = withTheme(ArchetypeCardComponent);
export const DimensionBar = withTheme(DimensionBarComponent);
export const PatternsPageIsland = withTheme(PatternsPageComponent);
export const PatternsPreview = withTheme(PatternsPreviewComponent);
export const TutorialsPageIsland = withTheme(TutorialsPageComponent);
export const TutorialsPreview = withTheme(TutorialsPreviewComponent);
export const ThreeWaysIn = withTheme(ThreeWaysInComponent);
export const LearnLanding = withTheme(LearnLandingComponent);
