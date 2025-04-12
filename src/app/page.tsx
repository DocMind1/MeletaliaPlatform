import SearchBar from "../app/components/SearchBar";
import HotelList from "../app/components/HotelList";
import HotelCardList from "../app/components/HotelCardList"
import FiltroBusqueda from "../app/components/FiltroBusqueda";
import Header from "./components/Header";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto pl-4 pr-4 bg-white text-black">
     

  
      <section className="mt-0 md:mt-0">
      <Header/>
      </section>

      <section className="mt-8 md:mt-10">
      <SearchBar />
      </section>

      {/* Lista de hoteles */}

      <section className="mt-8 md:mt-10">
        <HotelList />
      </section>


      <section className="mt-8 md:mt-10">
        <FiltroBusqueda/>
      </section>

      
      <section className="mt-8 md:mt-10">
        <HotelCardList/>
      </section>
    </div>
  );
}
