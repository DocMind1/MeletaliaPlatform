import SearchBar from "../app/components/SearchBar";
import HotelList from "../app/components/HotelList";
import HotelCardList from "../app/components/HotelCardList"
import FiltroBusqueda from "../app/components/FiltroBusqueda";

export default function Home() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* Barra de búsqueda */}
      <SearchBar />

      {/* Lista de hoteles */}
      <section className="mt-8 md:mt-10">
        <HotelList />
        <FiltroBusqueda/>
      </section>
      <section className="mt-8 md:mt-10">
        <HotelCardList/>
      </section>
    </div>
  );
}
