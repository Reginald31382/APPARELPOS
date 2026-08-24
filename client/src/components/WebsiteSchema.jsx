import StructuredData from "./StructuredData";

const WebsiteSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.jrome-studios.com/#website",
    name: "J.Rome Studios",
    url: "https://www.jrome-studios.com/",
    publisher: {
      "@id": "https://www.jrome-studios.com/#organization",
    },
  };

  return <StructuredData data={schema} />;
};

export default WebsiteSchema;
