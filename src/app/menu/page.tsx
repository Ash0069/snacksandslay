'use client'
export default function MenuPage() {
  const items = [
    { name: "Cold Coffee", price: "₹80", category: "Beverages", description: "Chilled espresso with milk" },
    { name: "Iced Americano", price: "₹110", category: "Beverages", description: "Bold espresso over ice" },
    { name: "Veg Sandwich", price: "₹90", category: "Food", description: "Fresh veggies & herbs" },
    { name: "Loaded Fries", price: "₹120", category: "Food", description: "Crispy fries with toppings" },
    { name: "Masala Tea", price: "₹20", category: "Beverages", description: "Traditional spiced chai" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 pt-8">
          <div className="inline-block mb-4 overflow-hidden">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent animate-slide-down">
              Our Menu
            </h1>
          </div>
          <p className="text-gray-600 text-lg animate-fade-in-delayed">
            Crafted with love, served with care
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mt-4 rounded-full animate-scale-in"></div>
        </div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {items.map((item, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden opacity-0 animate-float-in border border-gray-100"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Category Tag */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold rounded-full shadow-md transform group-hover:scale-110 transition-transform duration-300">
                {item.category}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors duration-300">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    {item.price}
                  </span>
                  {/* <button className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-medium shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-amber-600 hover:to-orange-600">
                    Order
                  </button> */}
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 mb-8 animate-fade-in-late">
          <p className="text-gray-500 text-sm">
            All prices inclusive of taxes
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-delayed {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scaleX(0);
          }
          to {
            opacity: 1;
            transform: scaleX(1);
          }
        }

        @keyframes float-in {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fade-in-late {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slide-down {
          animation: slide-down 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-fade-in-delayed {
          animation: fade-in-delayed 0.8s ease-out 0.3s forwards;
          opacity: 0;
        }

        .animate-scale-in {
          animation: scale-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
          opacity: 0;
        }

        .animate-float-in {
          animation: float-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-fade-in-late {
          animation: fade-in-late 1s ease-out 1s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}