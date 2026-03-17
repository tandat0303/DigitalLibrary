import { Layout, Breadcrumb } from "antd";
import { Outlet, useLocation, matchPath } from "react-router-dom";
import Header from "../components/Header";
import Loading from "../components/ui/Loading";
import { useLoadingNavigate } from "../hooks/useLoadingNavigate";
import SpecialHeader from "../components/SpecialHeader";

const { Content } = Layout;

export default function MainLayout() {
  const location = useLocation();

  // const matches = useMatches();

  // const currentMatch = [...matches].reverse().find((m) => m.handle);

  // const handle = currentMatch?.handle as
  //   | { title?: string; hideTitle?: boolean }
  //   | undefined;

  // const pageTitle = handle?.title;
  // const hideTitle = handle?.hideTitle;

  const routeTitleMap: Record<string, string> = {
    "/user-limit": "User Limit Mgmt",
    "/users": "User Mgmt",
    "/colors": "Colors",
    "/materials": "Materials",
    "/high-abrasion": "High Abrasion",
    "/new-library": "New Library",
    "/last-library": "Last Library",
  };

  const getPageTitle = () => {
    const path = location.pathname;

    if (routeTitleMap[path]) return routeTitleMap[path];

    const matched = Object.keys(routeTitleMap).find((route) =>
      matchPath(route, path),
    );

    return matched ? routeTitleMap[matched] : "";
  };

  const pageTitle = getPageTitle();

  const { handleNavigate, loading } = useLoadingNavigate();

  const isHome = location.pathname === "/";

  const isMaterialShowInfo = !!matchPath(
    "/materials/show-info/:id",
    location.pathname,
  );

  const isHighAbrasionShowInfo = !!matchPath(
    "/high-abrasion/show-info/:id",
    location.pathname,
  );

  const isNewLibraryShowInfo = !!matchPath(
    "/new-library/show-info/:id",
    location.pathname,
  );

  const isLastLibraryShowInfo = !!matchPath(
    "/last-library/show-info/:id",
    location.pathname,
  );

  const isShowInfo =
    isMaterialShowInfo ||
    isHighAbrasionShowInfo ||
    isNewLibraryShowInfo ||
    isLastLibraryShowInfo;

  const isSpecialLayout = isHome || isShowInfo;

  const pathSnippets = location.pathname.split("/").filter(Boolean);

  const breadcrumbItems = [
    {
      title: (
        <span style={{ cursor: "pointer" }} onClick={() => handleNavigate("/")}>
          LYG
        </span>
      ),
    },
    ...pathSnippets.map((value, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      return {
        key: url,
        title: (
          <span
            style={{ cursor: "pointer", textTransform: "capitalize" }}
            onClick={() => handleNavigate(url)}
          >
            {value.replace("-", " ")}
          </span>
        ),
      };
    }),
  ];

  return (
    <>
      {loading && <Loading fullScreen overlay />}

      <Layout
        style={{ height: "100vh", overflow: "hidden" }}
        className="adidas-font"
      >
        <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
          {isShowInfo ? <SpecialHeader /> : <Header />}
        </div>

        <div className="mt-10">
          {!isHome && !isShowInfo && (
            <Breadcrumb
              separator=">"
              items={breadcrumbItems}
              style={{
                padding: "12px 6px 6px 4px",
                fontSize: 16,
                fontWeight: "bold",
              }}
              className="bg-[#ededed]"
            />
          )}
        </div>

        <Content
          style={{
            // marginTop: 48,
            // height: "calc(100vh - 48px)",
            overflow: isSpecialLayout ? "hidden" : "auto",
            padding: isSpecialLayout ? 0 : "0px 24px",
            // backgroundColor: "#f5f4f0",
          }}
        >
          {pageTitle && (
            <div className="pt-3 pb-3">
              <h1 className="text-3xl font-bold tracking-wide uppercase">
                {pageTitle}
              </h1>
            </div>
          )}
          <Outlet />
        </Content>
      </Layout>
    </>
  );
}
