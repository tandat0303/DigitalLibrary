import { FaUserCircle, FaUsers, FaUserSecret } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import logo from "../assets/logo-LY-sm.png";
import Loading from "./ui/Loading";
import { useLoadingNavigate } from "../hooks/useLoadingNavigate";
import { useAppDispatch, useAppSelector } from "../hooks/auth";
import { logout } from "../features/authSlice";
import storage from "../lib/storage";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getInitials } from "../lib/helpers";

interface MenuProps {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  danger?: boolean;
}

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [isShow, setIsShow] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { handleNavigate, loading } = useLoadingNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsShow((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsShow(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleNavHome = () => {
    if (isHome) return;
    handleNavigate("/");
  };

  const handleLogout = () => {
    storage.remove("auth");
    dispatch(logout());
    window.location.href = "/login";
  };

  const menuOptions: MenuProps[] = [
    {
      onClick: () => handleNavigate("/user-limit"),
      icon: <FaUserSecret size={14} />,
      title: "User Limit",
    },
    {
      onClick: () => handleNavigate("/users"),
      icon: <FaUsers size={14} />,
      title: "Users",
    },
    {
      onClick: () => handleNavigate("/user-info"),
      icon: <FaUserCircle size={14} />,
      title: "User Info",
    },
    {
      onClick: handleLogout,
      icon: <IoLogOutOutline size={15} />,
      title: "Logout",
      danger: true,
    },
  ];

  return (
    <>
      {loading && <Loading fullScreen overlay />}

      <header className="header-root">
        <div className="header-logo" onClick={handleNavHome}>
          <img
            src={logo || "/placeholder.svg"}
            alt="Logo"
            className="h-8 object-contain"
          />
        </div>

        <div className="relative" ref={menuRef}>
          <button
            className={`header-user-btn ${isShow ? "header-user-btn--open" : ""}`}
            onClick={toggleMenu}
            aria-haspopup="true"
            aria-expanded={isShow}
          >
            <span className="header-avatar-wrap">
              <span className="header-avatar">
                {getInitials(user?.fullname)}
              </span>
              <span className="header-online-dot" />
            </span>

            <span className="header-username">{user?.fullname}</span>

            <svg
              className={`header-chevron ${isShow ? "header-chevron--up" : ""}`}
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="4 6 8 10 12 6" />
            </svg>
          </button>

          <div
            className={`header-dropdown ${
              isShow ? "header-dropdown--visible" : ""
            }`}
            role="menu"
          >
            <div className="header-dd-info flex items-center justify-between">
              <p className="header-dd-name">{user?.fullname}</p>
              {/* {user?.role && ( */}
              <span className="header-dd-role">
                {user?.username.toLowerCase() === "admin" ? "ADMIN" : "USER"}
              </span>
              {/* )} */}
            </div>

            <ul className="header-dd-list">
              {menuOptions.map((item, idx) => (
                <li key={idx}>
                  {item.danger && <div className="header-dd-sep" />}
                  <button
                    className={`header-dd-item ${
                      item.danger ? "header-dd-item--danger" : ""
                    }`}
                    onClick={() => {
                      item.onClick();
                      setIsShow(false);
                    }}
                    role="menuitem"
                  >
                    <span className="header-dd-icon">{item.icon}</span>
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>
    </>
  );
}

// import { FaUser, FaUserCircle, FaUsers, FaUserSecret } from "react-icons/fa";
// import { IoLogOutOutline, IoClose } from "react-icons/io5";
// import { HiMenuAlt3 } from "react-icons/hi";
// import logo from "../assets/logo-LY-sm.png";
// import Loading from "./ui/Loading";
// import { useLoadingNavigate } from "../hooks/useLoadingNavigate";
// import { useAppDispatch, useAppSelector } from "../hooks/auth";
// import { logout } from "../features/authSlice";
// import storage from "../lib/storage";
// import { useEffect, useRef, useState } from "react";
// import { DownOutlined } from "@ant-design/icons";

// interface MenuProps {
//   onClick: () => void;
//   icon: React.ReactNode;
//   title: string;
// }

// export default function Header() {
//   // const [open, setOpen] = useState(false);

//   const [isShow, setIsShow] = useState<boolean>(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

//   const dispatch = useAppDispatch();

//   const user = useAppSelector((state) => state.auth.user);

//   const { handleNavigate, loading } = useLoadingNavigate();

//   const menuRef = useRef<HTMLDivElement>(null);

//   const toggleMenu = () => setIsShow((prev) => !prev);

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
//         setIsShow(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     const handleEsc = (e: KeyboardEvent) => {
//       if (e.key === "Escape") setIsShow(false);
//     };

//     window.addEventListener("keydown", handleEsc);
//     return () => window.removeEventListener("keydown", handleEsc);
//   }, []);

//   const handleLogout = () => {
//     storage.remove("auth");

//     dispatch(logout());

//     window.location.href = "/login";

//     setIsMobileMenuOpen(false);
//   };

//   // const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
//   //   setOpen(false);

//   //   switch (key) {
//   //     case "user-limit":
//   //       handleNavigate("/user-limit");
//   //       break;

//   //     case "users":
//   //       handleNavigate("/users");
//   //       break;

//   //     case "user-info":
//   //       handleNavigate("/user-info");
//   //       break;

//   //     case "logout":
//   //       handleLogout();
//   //       break;
//   //   }
//   // };

//   // const items: MenuProps["items"] = [
//   //   {
//   //     key: "user-limit",
//   //     label: "User Limit",
//   //   },
//   //   {
//   //     key: "users",
//   //     label: "Users",
//   //   },
//   //   {
//   //     key: "user-info",
//   //     label: "User Info",
//   //   },
//   //   {
//   //     type: "divider",
//   //   },
//   //   {
//   //     key: "logout",
//   //     label: "Logout",
//   //     // danger: true,
//   //   },
//   // ];

//   const menuOption: MenuProps[] = [
//     {
//       onClick: () => handleNavigate("/user-limit"),
//       icon: <FaUserSecret size={20} className="text-primary flex-shrink-0" />,
//       title: "User Limit",
//     },
//     {
//       onClick: () => handleNavigate("/users"),
//       icon: <FaUsers size={20} className="text-primary flex-shrink-0" />,
//       title: "Users",
//     },
//     {
//       onClick: () => handleNavigate("/user-info"),
//       icon: <FaUserCircle size={20} className="text-primary flex-shrink-0" />,
//       title: "User Info",
//     },
//     {
//       onClick: handleLogout,
//       icon: (
//         <IoLogOutOutline size={20} className="text-primary flex-shrink-0" />
//       ),
//       title: "Logout",
//     },
//   ];

//   return (
//     <>
//       {loading && <Loading fullScreen overlay />}

//       <header className="w-full bg-black text-white px-1.5 py-1.5">
//         <div className="flex justify-between items-center h-full">
//           <div
//             className="h-10 flex items-center cursor-pointer"
//             onClick={() => {
//               handleNavigate("/");
//               setIsMobileMenuOpen(false);
//             }}
//           >
//             <img
//               src={logo || "/placeholder.svg"}
//               alt="Logo"
//               className="h-full object-contain"
//             />
//           </div>

//           {/* <Dropdown
//           menu={{ items, onClick: handleMenuClick }}
//           trigger={["click"]}
//           placement="bottomRight"
//           arrow={true}
//           open={open}
//           onOpenChange={(flag) => setOpen(flag)}
//         >
//           <div className="cursor-pointer text-[18px] flex items-center gap-1 hover:text-gray-300">
//             {user?.fullname}{" "}
//             <DownOutlined
//               className={`text-xs transition-transform duration-200 ${
//                 open ? "rotate-180" : ""
//               }`}
//             />
//           </div>
//         </Dropdown> */}

//           <div className="hidden md:flex flex-row gap-4 lg:gap-5 text-white items-center">
//             <div className="relative" ref={menuRef}>
//               <button
//                 className="flex items-center gap-2 lg:gap-3 cursor-pointer
//              px-3 py-2 rounded-lg
//              hover:bg-white/10 transition-all"
//                 onClick={toggleMenu}
//               >
//                 <FaUser size={18} className="flex-shrink-0" />

//                 <span className="text-sm lg:text-base max-w-[120px] truncate leading-none">
//                   {user?.fullname}
//                 </span>

//                 <DownOutlined
//                   className={`text-xs transition-transform duration-200 ${
//                     isShow ? "rotate-180" : ""
//                   }`}
//                 />
//               </button>

//               {/* DROPDOWN */}
//               <div
//                 className={`absolute top-12 right-0 w-30 bg-white text-primary shadow-lg rounded-lg overflow-hidden transition-all duration-300 ease-out ${
//                   isShow
//                     ? "opacity-100 translate-y-0 visible"
//                     : "opacity-0 -translate-y-2 invisible"
//                 }`}
//               >
//                 <ul className="font-semibold text-gray-600 py-1 adidas-font">
//                   {menuOption.map((item, index) => (
//                     <li key={index}>
//                       {item.title === "Logout" && (
//                         <div className="my-1 border-t border-gray-200" />
//                       )}

//                       <div
//                         className="px-3 py-2 hover:bg-gray-100 flex items-center gap-3 cursor-pointer transition-colors"
//                         onClick={() => {
//                           item.onClick();
//                           setIsShow(false);
//                         }}
//                       >
//                         {item.icon}
//                         <span>{item.title}</span>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </div>

//           <button
//             className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
//             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//           >
//             {isMobileMenuOpen ? (
//               <IoClose size={28} />
//             ) : (
//               <HiMenuAlt3 size={28} />
//             )}
//           </button>
//         </div>
//       </header>

//       <div
//         className={`md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
//           isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
//         }`}
//         onClick={() => setIsMobileMenuOpen(false)}
//       />

//       <div
//         className={`md:hidden fixed top-[60px] right-0 bottom-0 w-[280px] bg-gradient-to-b from-[#081c1b] via-[#3f4a42] to-[#636e61] z-40 shadow-2xl transform transition-transform duration-300 ease-out ${
//           isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         <div className="flex flex-col h-full p-4 space-y-4">
//           <div className="flex items-center gap-3 p-4 bg-white/10 rounded-lg">
//             <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
//               <FaUser size={20} className="text-white" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-white font-semibold text-sm truncate">
//                 {user?.fullname}
//               </p>
//               <p className="text-white/60 text-xs truncate">{user?.email}</p>
//             </div>
//           </div>

//           <div className="mt-auto">
//             <button
//               className="w-full flex items-center gap-3 p-4 bg-red-500/20 hover:bg-red-500/30 text-white rounded-lg transition-colors"
//               onClick={handleLogout}
//             >
//               <IoLogOutOutline size={24} />
//               <span className="font-semibold">Logout</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
