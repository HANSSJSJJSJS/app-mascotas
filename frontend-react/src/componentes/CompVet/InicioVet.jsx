import { Calendar, FileText, PawPrint, Activity, Pill } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-blue-50">
      {/* Barra lateral */}
      <div className="w-64 bg-indigo-800 text-white flex flex-col">
        <div className="p-4 font-bold text-lg border-b border-indigo-700 flex items-center">
          <PawPrint className="mr-2 h-6 w-6" />
          <span>VETCLINIC</span>
        </div>
        <div className="p-4 border-b border-indigo-700">
          <div className="text-sm text-indigo-200">Veterinario</div>
          <div className="font-medium">Dr. Carlos Rodríguez</div>
        </div>
        <nav className="flex-1 pt-4">
          <Link href="/" className="flex items-center px-4 py-3 bg-indigo-900 text-white hover:bg-indigo-700">
            <Activity className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <Link href="/agenda" className="flex items-center px-4 py-3 text-white hover:bg-indigo-700">
            <Calendar className="mr-3 h-5 w-5" />
            Agenda
          </Link>
          <Link href="/pacientes" className="flex items-center px-4 py-3 text-white hover:bg-indigo-700">
            <PawPrint className="mr-3 h-5 w-5" />
            Pacientes
          </Link>
          <Link href="/consulta" className="flex items-center px-4 py-3 text-white hover:bg-indigo-700">
            <FileText className="mr-3 h-5 w-5" />
            Consultas
          </Link>
          <Link href="/historial" className="flex items-center px-4 py-3 text-white hover:bg-indigo-700">
            <FileText className="mr-3 h-5 w-5" />
            Historiales
          </Link>
          <Link href="/inventario" className="flex items-center px-4 py-3 text-white hover:bg-indigo-700">
            <Pill className="mr-3 h-5 w-5" />
            Inventario
          </Link>
        </nav>
        <div className="p-4 border-t border-indigo-700">
          <Button variant="outline" className="w-full bg-indigo-700 hover:bg-indigo-600 text-white border-indigo-600">
            Cerrar sesión
          </Button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-auto">
        {/* Cabecera */}
        <header className="bg-white shadow-sm p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Lunes, 12 de mayo de 2025</span>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido del Dashboard */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Tarjetas de resumen */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Citas hoy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">8</div>
                  <p className="text-xs text-green-600 mt-1">+2 desde ayer</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Pacientes totales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">247</div>
                  <p className="text-xs text-green-600 mt-1">+12 este mes</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Consultas pendientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">3</div>
                  <p className="text-xs text-blue-600 mt-1">Próxima en 15 min</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Vacunas programadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">5</div>
                  <p className="text-xs text-orange-600 mt-1">Para esta semana</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Citas del día */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle>Citas del día</CardTitle>
                      <Button variant="outline" size="sm" className="h-8">
                        Ver todas
                      </Button>
                    </div>
                    <CardDescription>12 de mayo, 2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500 flex justify-between items-center">
                        <div>
                          <div className="font-medium">09:00 - Max (Labrador)</div>
                          <div className="text-sm text-gray-500">Vacunación anual</div>
                          <div className="text-sm text-gray-500">Propietario: Juan Pérez</div>
                        </div>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Atender
                        </Button>
                      </div>

                      <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500 flex justify-between items-center">
                        <div>
                          <div className="font-medium">10:30 - Luna (Siamés)</div>
                          <div className="text-sm text-gray-500">Control rutinario</div>
                          <div className="text-sm text-gray-500">Propietario: María González</div>
                        </div>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Atender
                        </Button>
                      </div>

                      <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500 flex justify-between items-center">
                        <div>
                          <div className="font-medium">11:45 - Rocky (Bulldog)</div>
                          <div className="text-sm text-gray-500">Problema dermatológico</div>
                          <div className="text-sm text-gray-500">Propietario: Ana Martínez</div>
                        </div>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Atender
                        </Button>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300 flex justify-between items-center">
                        <div>
                          <div className="font-medium">14:15 - Coco (Poodle)</div>
                          <div className="text-sm text-gray-500">Limpieza dental</div>
                          <div className="text-sm text-gray-500">Propietario: Roberto Sánchez</div>
                        </div>
                        <Button size="sm" variant="outline">
                          Pendiente
                        </Button>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300 flex justify-between items-center">
                        <div>
                          <div className="font-medium">16:00 - Simba (Maine Coon)</div>
                          <div className="text-sm text-gray-500">Vacunación</div>
                          <div className="text-sm text-gray-500">Propietario: Carmen López</div>
                        </div>
                        <Button size="sm" variant="outline">
                          Pendiente
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Pacientes recientes */}
              <div>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Pacientes recientes</CardTitle>
                    <CardDescription>Últimos pacientes atendidos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <PawPrint className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Max (Labrador)</div>
                          <div className="text-sm text-gray-500">Vacunación - 10/05/2025</div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          Ver
                        </Button>
                      </div>

                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <PawPrint className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Milo (Beagle)</div>
                          <div className="text-sm text-gray-500">Cirugía - 09/05/2025</div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          Ver
                        </Button>
                      </div>

                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <PawPrint className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Luna (Siamés)</div>
                          <div className="text-sm text-gray-500">Control - 08/05/2025</div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          Ver
                        </Button>
                      </div>

                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <PawPrint className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Toby (Golden)</div>
                          <div className="text-sm text-gray-500">Emergencia - 07/05/2025</div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          Ver
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Accesos rápidos */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              <Link
                href="/consulta/nueva"
                className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-blue-600 font-medium">Nueva consulta</div>
              </Link>

              <Link
                href="/agenda"
                className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-purple-600 font-medium">Agenda</div>
              </Link>

              <Link
                href="/pacientes/nuevo"
                className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <PawPrint className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-green-600 font-medium">Nuevo paciente</div>
              </Link>

              <Link
                href="/inventario"
                className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="bg-amber-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Pill className="h-6 w-6 text-amber-600" />
                </div>
                <div className="text-amber-600 font-medium">Inventario</div>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
