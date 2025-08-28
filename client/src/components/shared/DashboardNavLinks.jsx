import {
  CommonLinks,
  AdminLinks,
  UserLinks,
  RecruiterLinks,
} from "../../utils/DashboardNavLinkData";
import { NavLink } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import { useDashboardContext } from "../../Layout/DashboardLayout";

const DashboardNavLinks = () => {
  const { user } = useUserContext();
  const { handleLogout } = useDashboardContext();

  const handleClick = (link) => {
    if (link.key === "logout") {
      handleLogout();
    }
  };

  const renderLinks = (links) => {
    return links.map((link) => {
      const { text, path, icon, key } = link;

      // Special case: logout (no path, just action)
      if (key === "logout") {
        return (
          <div key={key} className="nav-link logout-link" onClick={() => handleClick(link)}>
            <span className="icon">{icon}</span>
            {text}
          </div>
        );
      }

      // Skip 'admin' path for non-admins just in case
      if (path === "admin" && user?.role !== 1) return null;

      return (
        <NavLink to={path} key={text} className="nav-link" end>
          <span className="icon">{icon}</span>
          {text}
        </NavLink>
      );
    });
  };

  if (user?.role === 1) return <div className="nav-links">{renderLinks(AdminLinks)}</div>;
  if (user?.role === 2) return <div className="nav-links">{renderLinks(RecruiterLinks)}</div>;

  return <div className="nav-links">{renderLinks(UserLinks)}</div>;
};

export default DashboardNavLinks;
