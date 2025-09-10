import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SuccessStories from '../sections/SuccessStories';
import Features from "../sections/features";
import Contact from '../sections/Contact'; // import Contact section
import AboutSection from '../sections/AboutSection'; // import About section
import Home from '../sections/Home';


export default function landingPage(){
    return(
        <>
        <Navbar />
        <Home/>
        <Features />
        {/* About Section */}
        <AboutSection />
        {/* Other components */}
        <SuccessStories />
        {/* Contact Section */}
        <Contact />
        <Footer /> 
        </>

    )
}