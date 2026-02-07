export default function SnacksAndSlayPreview() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-4"
      style={{ backgroundImage: "url('/ghibli-bg.png')" }}
    >
      <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-4">
        Snacks & Slay
      </h1>

      <p className="text-white max-w-sm text-center mb-6 drop-shadow">
        Welcome to Snacks & Slay! Tap below to view our freshly curated menu.
      </p>

      <button className="px-6 py-3 bg-black text-white rounded-xl text-lg font-semibold shadow-md active:scale-95 transition">
        Tap to Open Menu
      </button>
    </div>
  );
}
