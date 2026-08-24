import SEO from "../../components/SEO";
import OrganizationSchema from "../../components/OrganizationSchema";
import WebsiteSchema from "../../components/WebsiteSchema";
import Hero from "../../modules/home/Hero";
import FeaturedCollections from "../../modules/home/FeaturedCollections";
import NewArrivals from "../../modules/home/NewArrivals";

const Home = () => {
  return (
    <>
      <SEO
        title="J.Rome Studios"
        description="Shop J.Rome Studios for urban apparel, streetwear, graphic tees, hoodies, and fashion designed for men, women, and kids."
        path="/"
      />
      <OrganizationSchema />
      <WebsiteSchema />
      <Hero />
      <FeaturedCollections />
      <NewArrivals />
    </>
  );
};

export default Home;
