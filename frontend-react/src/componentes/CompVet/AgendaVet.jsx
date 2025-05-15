import { Calendar, FileText, PawPrint, Plus, Activity, Pill, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AgendaPage() {
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
          <Link 
            href="/" 
            className="flex items-center px-4 py-3 text-white hover:bg-indigo-700"
          >
            <Activity className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <Link 
            href="/agenda" 
            className="flex items-center px-4 py-3 bg-indigo-900 text-white hover:bg-indigo-700"
          >
            <Calendar className="mr-3 h-5 w-5" />
            Agenda
          </Link>
          <Link 
            href="/pacientes" 
            className="flex items-center px-4 py-3 text-white hover:bg-indigo-700"
          >
            <PawPrint className="mr-3 h-5 w-5" />
            Pacientes
          </Link>
          <Link 
            href="/consulta" 
            className="flex items-center px-4 py-3 text-white hover:bg-indigo-700"
          >
            <FileText className="mr-3 h-5 w-5" />
            Consultas
          </Link>
          <Link 
            href="/historial" 
            className="flex items-center px-4 py-3 text-white hover:bg-indigo-700"
          >
            <FileText className="mr-3 h-5 w-5" />
            Historiales
          </Link>
          <Link 
            href="/inventario" 
            className="flex items-center px-4 py-3 text-white hover:bg-indigo-700"
          >
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
            <h1 className="text-2xl font-bold text-gray-800">Agenda</h1>
            <div className="flex items-center space-x-4">
              <Link href="/consulta/nueva">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva cita
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Contenido de Agenda */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="dia" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="dia">Día</TabsTrigger>
                  <TabsTrigger value="semana">Semana</TabsTrigger>
                  <TabsTrigger value="mes">Mes</TabsTrigger>
                </TabsList>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="font-medium">12 de mayo, 2025</div>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">Hoy</Button>
                </div>
              </div>
              
              <TabsContent value="dia">
                <Card>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 divide-y">
                      <div className="flex p-4">
                        <div className="w-16 text-center">
                          <div className="font-medium">09:00</div>
                        </div>
                        <div className="flex-1 ml-4">
                          <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                            <div className="font-medium">Max (Labrador)</div>
                            <div className="text-sm text-gray-500">Vacunación anual</div>
                            <div className="text-sm text-gray-500">Propietario: Juan Pérez</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex p-4">
                        <div className="w-16 text-center">
                          <div className="font-medium">10:00</div>
                        </div>
                        <div className="flex-1 ml-4"></div>
                \
