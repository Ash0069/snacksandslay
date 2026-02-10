export default function MenuHero() {
  return (
    <div className="mb-12 pt-8 text-center">
      <div className="mb-4 inline-block overflow-hidden">
        <h1 className="animate-slide-down bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
          Our Menu
        </h1>
      </div>
      <p className="animate-fade-in-delayed text-lg text-gray-600">Crafted with love, served with care</p>
      <div className="animate-scale-in mx-auto mt-4 h-1 w-24 rounded-full bg-linear-to-r from-amber-500 to-orange-500"></div>
    </div>
  );
}
