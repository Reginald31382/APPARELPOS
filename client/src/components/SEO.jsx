import { Helmet } from "react-helmet-async";

const SITE_URL = "https://www.jrome-studios.com";
const SITE_NAME = "J.Rome Studios";

const SEO = ({
  title,
  description,
  path = "/",
  image = "/og-image.jpg",
  noIndex = false,
}) => {
  const canonicalUrl = `${SITE_URL}${path}`;

  const fullTitle = title === SITE_NAME ? SITE_NAME : `${title} | ${SITE_NAME}`;

  const robots = noIndex ? "noindex, nofollow" : "index, follow";

  return (
    <Helmet>
      <title>{fullTitle}</title>

      <meta name="description" content={description} />

      <meta name="robots" content={robots} />

      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />

      <meta property="og:title" content={fullTitle} />

      <meta property="og:description" content={description} />

      <meta property="og:url" content={canonicalUrl} />

      <meta property="og:site_name" content={SITE_NAME} />

      <meta property="og:image" content={`${SITE_URL}${image}`} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />

      <meta name="twitter:title" content={fullTitle} />

      <meta name="twitter:description" content={description} />

      <meta name="twitter:image" content={`${SITE_URL}${image}`} />
    </Helmet>
  );
};

export default SEO;
