import Image from 'next/image';

export default function PlantillaDetalle() {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold">Casa Rural La Marquesa - Cuenca</h1>
      <p className="text-gray-600 flex items-center gap-2">
        <span className="text-blue-500">📍</span>
        Calle San Isidro número 32 Casa rural, 16120 Valera de Abajo, España
        <span className="text-blue-600 cursor-pointer"> - Ubicación excelente - Ver mapa</span>
      </p>
      
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <div className="md:col-span-2">
          <Image 
            src="/mnt/data/image.png" 
            alt="Casa Rural La Marquesa" 
            width={800} 
            height={400} 
            className="rounded-lg w-full h-auto"
          />
        </div>
        <div className="bg-blue-100 p-4 rounded-lg flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold">Booking.com</h2>
            <p className="text-blue-500">Traveller Review Awards 2021</p>
            <p className="text-3xl font-bold text-blue-600">9,6</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-bold text-gray-800">Fantástico</h2>
            <p className="text-3xl font-bold text-blue-600">9,4</p>
            <p className="text-gray-600 italic mt-2">"Tiene unos exteriores maravillosos y que la barbacoa esté en una cabaña aparte está genial. La mesa del salón es amplia, cupimos todos sin problema."</p>
            <p className="mt-2 font-semibold">- Irene, España</p>
          </div>
        </div>
        <div className="bg-white p-4 shadow-md rounded-lg text-center">
          <h3 className="text-lg font-semibold">Personal</h3>
          <p className="text-2xl font-bold text-blue-600">9,8</p>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700">
          Ver fechas disponibles
        </button>
      </div>
    </div>
  );
}
