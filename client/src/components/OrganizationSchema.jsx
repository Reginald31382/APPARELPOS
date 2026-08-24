import StructuredData from "./StructuredData";

const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "@id": "https://www.jrome-studios.com/#organization",
    name: "J.Rome Studios",
    url: "https://www.jrome-studios.com/",
    description:
      "J.Rome Studios is an urban apparel and streetwear brand offering expressive fashion for men, women, and kids.",
    logo: "https://www.jrome-studios.com/jrome_leo_szn.png",
    sameAs: [],
  };

  return <StructuredData data={schema} />;
};

export default OrganizationSchema;
