import { Bell, Calendar, Clipboard, PawPrint, User } from "lucide-react"
import Link from "next/link"

export default function InicioPropietario() {
  return (
    <div className="flex min-h-screen bg-[#c2d8ff]/30">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a2540] text-white">
        <div className="p-4 bg-[#000000]">
          <h1 className="text-xl font-bold">MOYBE</h1>
          <p className="text-sm text-[#8196eb]">Veterinaria</p>
        </div>

        <nav className="mt-6 px-2">
          <Link href="#" className="flex items-center gap-3 p-3 rounded-lg bg-[#495a90] mb-2">
            <Home size={20} />
            <span>InicioPropietario</span>
          </Link>

          <Link
            href="#"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#495a90]/70 mb-2 transition-colors"
          >
            <Calendar size={20} />
            <span>Agendar Cita</span>
          </Link>

          <Link
            href="#"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#495a90]/70 mb-2 transition-colors"
          >
            <User size={20} />
            <span>Actualizar Datos</span>
          </Link>

          <Link
            href="#"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#495a90]/70 mb-2 transition-colors"
          >
            <PawPrint size={20} />
            <span>Mascota</span>
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-[#1a2540]">Bienvenido a Moybe</h2>
          <div className="flex items-center gap-2 text-[#1a2540]">
            <span>Juan Pérez</span>
            <div className="w-10 h-10 rounded-full bg-[#8196eb] flex items-center justify-center text-white">JP</div>
          </div>
        </header>

        {/* Dashboard content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resumen */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-[#1a2540] mb-4">Resumen</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-3 bg-[#c2d8ff] rounded-lg">
                <div className="w-10 h-10 rounded-full bg-[#8196eb] flex items-center justify-center mb-2">
                  <PawPrint size={18} className="text-white" />
                </div>
                <span className="text-xl font-bold text-[#1a2540]">2</span>
                <span className="text-xs text-[#495a90]">Mascotas</span>
              </div>

              <div className="flex flex-col items-center p-3 bg-[#c2d8ff] rounded-lg">
                <div className="w-10 h-10 rounded-full bg-[#8196eb] flex items-center justify-center mb-2">
                  <Calendar size={18} className="text-white" />
                </div>
                <span className="text-xl font-bold text-[#1a2540]">2</span>
                <span className="text-xs text-[#495a90]">Próximas citas</span>
              </div>

              <div className="flex flex-col items-center p-3 bg-[#c2d8ff] rounded-lg">
                <div className="w-10 h-10 rounded-full bg-[#8196eb] flex items-center justify-center mb-2">
                  <Bell size={18} className="text-white" />
                </div>
                <span className="text-xl font-bold text-[#1a2540]">2</span>
                <span className="text-xs text-[#495a90]">Recordatorios</span>
              </div>
            </div>
          </div>

          {/* Mis mascotas */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-[#1a2540] mb-4">Mis mascotas</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-[#c2d8ff]/50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-[#8196eb] flex items-center justify-center">
                  <PawPrint size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-[#1a2540]">Max</h4>
                  <p className="text-sm text-[#495a90]">Perro - Labrador, 3 años</p>
                </div>
                <Link href="#" className="ml-auto text-sm text-[#495a90] hover:text-[#1a2540]">
                  Ver ficha
                </Link>
              </div>

              <div className="flex items-center gap-4 p-3 bg-[#c2d8ff]/50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-[#8196eb] flex items-center justify-center">
                  <PawPrint size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-[#1a2540]">Luna</h4>
                  <p className="text-sm text-[#495a90]">Gato - Siamés, 2 años</p>
                </div>
                <Link href="#" className="ml-auto text-sm text-[#495a90] hover:text-[#1a2540]">
                  Ver ficha
                </Link>
              </div>

              <button className="w-full p-3 border-2 border-dashed border-[#8196eb] rounded-lg text-[#495a90] hover:bg-[#c2d8ff]/30 transition-colors flex items-center justify-center gap-2">
                <span className="text-xl">+</span>
                <span>Agregar mascota</span>
              </button>
            </div>
          </div>

          {/* Próximas citas */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#1a2540]">Próximas citas</h3>
              <Link href="#" className="text-sm text-[#495a90] hover:text-[#1a2540]">
                Ver todas
              </Link>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-[#c2d8ff]/30 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-[#8196eb] flex items-center justify-center shrink-0">
                  <Calendar size={18} className="text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-[#1a2540]">Vacunación - Max</h4>
                  <p className="text-sm text-[#495a90]">miércoles, 14 de junio de 2023</p>
                  <p className="text-sm text-[#495a90]">10:30 - Dr. García</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#c2d8ff]/30 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-[#8196eb] flex items-center justify-center shrink-0">
                  <Calendar size={18} className="text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-[#1a2540]">Control - Luna</h4>
                  <p className="text-sm text-[#495a90]">miércoles, 21 de junio de 2023</p>
                  <p className="text-sm text-[#495a90]">15:00 - Dra. Rodríguez</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recordatorios */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#1a2540]">Recordatorios</h3>
              <Link href="#" className="text-sm text-[#495a90] hover:text-[#1a2540]">
                Ver todos
              </Link>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-[#c2d8ff]/30 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-[#8196eb] flex items-center justify-center shrink-0">
                  <Bell size={18} className="text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-[#1a2540]">Desparasitación de Max</h4>
                  <p className="text-sm text-[#495a90]">viernes, 9 de junio de 2023</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#c2d8ff]/30 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-[#8196eb] flex items-center justify-center shrink-0">
                  <Bell size={18} className="text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-[#1a2540]">Comprar alimento para Luna</h4>
                  <p className="text-sm text-[#495a90]">miércoles, 7 de junio de 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-[#1a2540] mb-4">Accesos rápidos</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="#"
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:bg-[#c2d8ff]/30 transition-colors"
            >
              <Calendar size={24} className="text-[#495a90] mb-2" />
              <span className="text-sm text-[#1a2540]">Agendar cita</span>
            </Link>

            <Link
              href="#"
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:bg-[#c2d8ff]/30 transition-colors"
            >
              <Clipboard size={24} className="text-[#495a90] mb-2" />
              <span className="text-sm text-[#1a2540]">Historial clínico</span>
            </Link>

            <Link
              href="#"
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:bg-[#c2d8ff]/30 transition-colors"
            >
              <User size={24} className="text-[#495a90] mb-2" />
              <span className="text-sm text-[#1a2540]">Mi perfil</span>
            </Link>

            <Link
              href="#"
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:bg-[#c2d8ff]/30 transition-colors"
            >
              <Home size={24} className="text-[#495a90] mb-2" />
              <span className="text-sm text-[#1a2540]">Ubicación</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
