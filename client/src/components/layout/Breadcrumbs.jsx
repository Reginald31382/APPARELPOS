import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const { pathname } = useLocation();

  const paths = pathname.split("/").filter(Boolean);

  return (
    <nav className="mb-6 text-sm text-gray-500">
      <ol className="flex items-center gap-2">
        <li>
          <Link to="/admin" className="hover:text-black">
            Dashboard
          </Link>
        </li>

        {paths.slice(1).map((segment, index) => {
          const url = "/" + paths.slice(0, index + 2).join("/");

          return (
            <li key={segment} className="flex items-center gap-2">
              <span>/</span>

              <Link to={url} className="capitalize hover:text-black">
                {segment}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
