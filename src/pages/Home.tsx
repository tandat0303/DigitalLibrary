// import { buttons } from "../components/ui/HomeButtons";
// import Loading from "../components/ui/Loading";
// import { ShineText } from "../components/ui/ShineText";
// import { useLoadingNavigate } from "../hooks/useLoadingNavigate";

// export default function Home() {
//   const { handleNavigate, loading } = useLoadingNavigate();

//   return (
//     <>
//       {loading && <Loading fullScreen overlay />}

//       <div className="min-h-screen flex items-center justify-center">
//         <div className="w-[70%] lg:-mt-24">
//           <div className="mb-6">
//             <h1 className="text-5xl font-extrabold bg-black border w-fit rounded-lg flex items-center justify-center">
//               <ShineText>LYG</ShineText>
//             </h1>
//           </div>

//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 h-full">
//             {/* {buttons.map((btn, idx) => {
//               const Icon = btn.icon;
//               return (
//                 <button
//                   key={idx}
//                   className="bg-white shadow-[0_10px_20px_rgba(128,128,128,0.3)] hover:shadow-xl hover:bg-gray-50 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer active:bg-gray-100 group
//                               box-border px-2 py-5"
//                   onClick={() => handleNavigate(btn.path)}
//                 >
//                   <Icon
//                     size={90}
//                     className="mb-4 text-gray-800 group-hover:scale-110 transition-transform duration-300"
//                   />
//                   <span className="tracking-wider text-sm font-semibold text-gray-800 text-center px-3">
//                     {btn.label}
//                   </span>
//                 </button>
//               );
//             })} */}
//             {buttons.map((btn, idx) => (
//               <button
//                 key={idx}
//                 className="bg-white shadow-[0_10px_20px_rgba(128,128,128,0.3)]
//                hover:shadow-xl hover:bg-gray-50 transition-all duration-300
//                flex flex-col items-center justify-center cursor-pointer
//                active:bg-gray-100 group box-border px-2 py-5"
//                 onClick={() => handleNavigate(btn.path)}
//               >
//                 <img
//                   src={btn.image}
//                   alt={btn.label}
//                   className="w-[90px] h-[90px] object-contain mb-4
//                  group-hover:scale-110 transition-transform duration-300"
//                   loading="lazy"
//                   draggable={false}
//                 />

//                 <span className="tracking-wider text-sm font-semibold text-gray-800 text-center px-3">
//                   {btn.label}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import { buttons } from "../components/ui/HomeButtons";
import Loading from "../components/ui/Loading";
import { ShineText } from "../components/ui/ShineText";
import { useLoadingNavigate } from "../hooks/useLoadingNavigate";

export default function Home() {
  const { handleNavigate, loading } = useLoadingNavigate();

  return (
    <>
      {loading && <Loading fullScreen overlay />}

      <div className="min-h-screen flex items-center justify-center bg-[#f5f4f0]">
        <div className="w-[75%] lg:-mt-24">
          <div className="mb-8">
            <h1 className="home-logo-pill w-fit text-xl">
              <ShineText>LYG - Smart Library</ShineText>
            </h1>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {buttons.map((btn, idx) => (
              <button
                key={idx}
                className="home-card-btn"
                onClick={() => handleNavigate(btn.path)}
              >
                <span className="home-card-dot" />

                <div className="home-card-icon">
                  <img
                    src={btn.image}
                    alt={btn.label}
                    className="w-[60px] h-[60px] object-contain home-card-img"
                    loading="lazy"
                    draggable={false}
                  />
                </div>
                <span className="home-card-label">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// import { buttons } from "../components/ui/HomeButtons";
// import Loading from "../components/ui/Loading";
// import { ShineText } from "../components/ui/ShineText";
// import { useLoadingNavigate } from "../hooks/useLoadingNavigate";
// import bg from "../assets/homebg-1.jpg";

// export default function Home() {
//   const { handleNavigate, loading } = useLoadingNavigate();

//   return (
//     <>
//       {loading && <Loading fullScreen overlay />}

//       <div
//         className="relative min-h-screen flex flex-col items-center justify-center-safe gap-10 bg-cover bg-center"
//         style={{ backgroundImage: `url(${bg})` }}
//       >
//         <div className="absolute inset-0 bg-black/35" />
//         <div className="z-10">
//           <div className="absolute top-2 left-0 right-0 flex justify-center">
//             <h1 className="home-logo-pill text-xl">
//               <ShineText>LYG - Smart Library</ShineText>
//             </h1>
//           </div>

//           <div className="flex justify-center w-full ">
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 px-6 w-fit">
//               {buttons.map((btn, idx) => (
//                 <button
//                   key={idx}
//                   className="home-circle-btn"
//                   onClick={() => handleNavigate(btn.path)}
//                 >
//                   <img
//                     src={btn.image}
//                     alt={btn.label}
//                     className="w-14 h-14 object-contain home-circle-img"
//                     loading="lazy"
//                     draggable={false}
//                   />
//                   <span className="home-circle-label">{btn.label}</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
