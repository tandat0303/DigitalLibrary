import { buttons } from "../components/ui/HomeButtons";
import Loading from "../components/ui/Loading";
import { useLoadingNavigate } from "../hooks/useLoadingNavigate";

export default function Home() {
  const { handleNavigate, loading } = useLoadingNavigate();

  return (
    <>
      {loading && <Loading fullScreen overlay />}

      <div className="min-h-screen flex items-center justify-center">
        <div className="w-[70%] lg:-mt-24">
          <div className="mb-6">
            <h1 className="text-5xl font-extrabold text-black">LYG</h1>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 h-full">
            {buttons.map((btn, idx) => {
              const Icon = btn.icon;
              return (
                <button
                  key={idx}
                  className="bg-white shadow-[0_10px_20px_rgba(128,128,128,0.3)] hover:shadow-xl hover:bg-gray-50 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer active:bg-gray-100 group
                              box-border px-2 py-5"
                  onClick={() => handleNavigate(btn.path)}
                >
                  <Icon
                    size={90}
                    className="mb-4 text-gray-800 group-hover:scale-110 transition-transform duration-300"
                  />
                  <span className="tracking-wider text-sm font-semibold text-gray-800 text-center px-3">
                    {btn.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
