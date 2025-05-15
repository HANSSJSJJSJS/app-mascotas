import { ArrowLeft, Calendar, FileText, Home, PawPrint, Plus, User, Users } from "lucide-react"
import Link from "next/link"

export default function NuevaConsulta() {
  return (
    <div className="flex h-screen bg-blue-100">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-800 text-white flex flex-col">
        <div className="p-4 font-bold text-lg border-b border-indigo-700">MENU VETERINARIO</div>
        <nav className="flex-1 pt-4">
          <Link href="/" className="flex items-center px-4 py-3 text-white hover:bg-indigo-700">
            <Home className="mr-3 h-5 w-5" />
            Inicio
          </Link>
          <Link href="/citas" className="flex items-center px-4 py-3 text-white hover:bg-indigo-700">
            <Calendar className="mr-3 h-5 w-5" />
            Agenda
          </Link>
          <Link href="/pacientes" className="flex items-center px-4 py-3 text-white hover:bg-indigo-700">
            <PawPrint className="mr-3 h-5 w-5" />
            Pacientes
          </Link>
          <Link href="/historial" className="flex items-center px-4 py-3 text-white hover:bg-indigo-700">
            <FileText className="mr-3 h-5 w-5" />
            Historiales
          </Link>
          <Link href="/propietarios" className="flex items-center px-4 py-3 text-white hover:bg-indigo-700">
            <Users className="mr-3 h-5 w-5" />
            Propietarios
          </Link>
        </nav>
        <div className="p-4 border-t border-indigo-700">
          <Link href="/perfil" className="flex items-center text-white hover:bg-indigo-700 p-2 rounded-md">
            <User className="mr-3 h-5 w-5" />
            Mi Perfil
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-end">
          <div className="text-right">
            <div className="font-medium">Dra. María Rodríguez</div>
            <div className="text-sm text-gray-500">Veterinaria</div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center mb-6">
              <Link href="/" className="mr-4">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Nueva Consulta</h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Patient Information */}
                <div className="md:col-span-1">
                  <h2 className="font-bold text-lg mb-4">Información del Paciente</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
                      <select className="border border-gray-300 rounded-md px-3 py-2 w-full">
                        <option>Seleccionar paciente</option>
                        <option>Max - Labrador (Juan Pérez)</option>
                        <option>Luna - Siamés (Ana Gómez)</option>
                        <option>Rocky - Bulldog (Carlos Martínez)</option>
                        <option>Coco - Poodle (Laura Sánchez)</option>
                      </select>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <h3 className="font-medium mb-2">Datos del paciente</h3>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Especie:</span>
                          <span>Perro</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Raza:</span>
                          <span>Labrador</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Edad:</span>
                          <span>3 años</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sexo:</span>
                          <span>Macho</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Peso anterior:</span>
                          <span>32 kg</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <h3 className="font-medium mb-2">Propietario</h3>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nombre:</span>
                          <span>Juan Pérez</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Teléfono:</span>
                          <span>555-123-4567</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Link href="/historial/1" className="text-blue-600 hover:underline text-sm flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        Ver historial completo
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Consultation Form */}
                <div className="md:col-span-2">
                  <h2 className="font-bold text-lg mb-4">Datos de la Consulta</h2>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span>12 de mayo de 2025</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de consulta</label>
                        <select className="border border-gray-300 rounded-md px-3 py-2 w-full">
                          <option>Control de rutina</option>
                          <option>Vacunación</option>
                          <option>Emergencia</option>
                          <option>Seguimiento</option>
                          <option>Cirugía</option>
                          <option>Otro</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Peso actual (kg)</label>
                        <input
                          type="number"
                          className="border border-gray-300 rounded-md px-3 py-2 w-full"
                          placeholder="Peso en kg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Temperatura (°C)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="border border-gray-300 rounded-md px-3 py-2 w-full"
                          placeholder="Temperatura"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de consulta</label>
                      <textarea
                        className="border border-gray-300 rounded-md px-3 py-2 w-full h-20"
                        placeholder="Describa el motivo de la consulta"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Anamnesis</label>
                      <textarea
                        className="border border-gray-300 rounded-md px-3 py-2 w-full h-20"
                        placeholder="Historial y síntomas reportados por el propietario"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Examen físico</label>
                      <textarea
                        className="border border-gray-300 rounded-md px-3 py-2 w-full h-20"
                        placeholder="Hallazgos del examen físico"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico</label>
                      <textarea
                        className="border border-gray-300 rounded-md px-3 py-2 w-full"
                        placeholder="Diagnóstico presuntivo o definitivo"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tratamiento</label>
                      <textarea
                        className="border border-gray-300 rounded-md px-3 py-2 w-full h-20"
                        placeholder="Tratamiento prescrito"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Observaciones y recomendaciones
                      </label>
                      <textarea
                        className="border border-gray-300 rounded-md px-3 py-2 w-full"
                        placeholder="Observaciones adicionales y recomendaciones para el propietario"
                      ></textarea>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-2">Próxima visita</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Programar próxima cita</label>
                          <select className="border border-gray-300 rounded-md px-3 py-2 w-full">
                            <option>No es necesario</option>
                            <option>En 7 días</option>
                            <option>En 15 días</option>
                            <option>En 1 mes</option>
                            <option>En 3 meses</option>
                            <option>En 6 meses</option>
                            <option>En 1 año</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
                          <select className="border border-gray-300 rounded-md px-3 py-2 w-full">
                            <option>Control</option>
                            <option>Seguimiento de tratamiento</option>
                            <option>Vacunación</option>
                            <option>Retirar puntos</option>
                            <option>Otro</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        className="border border-gray-300 bg-white text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Guardar consulta
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
