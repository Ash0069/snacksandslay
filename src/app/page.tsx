export default function HomePage() {
  return (
    <div
        className="
          min-h-screen 
          bg-center 
          bg-black
          flex flex-col items-center justify-center p-4
          bg-cover lg:bg-contain bg-no-repeat
        "
        style={{
          backgroundImage: "url('/landing-page.png')",
        }}
      >
      <div className="bg-black/40 p-6 rounded-2xl text-center ">
        <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-4">
          Snack & Slay
        </h1>

        <p className="text-white max-w-sm text-center mb-6 drop-shadow">
          Welcome to Snack & Slay! Tap below to view our freshly curated menu.
        </p>

        <a
          href="/menu"
          className="px-6 py-3 bg-white text-black rounded-xl text-lg font-semibold shadow-md active:scale-95 transition"
        >
          Tap to Open Menu
        </a>
      </div>
    </div>
  );
}
