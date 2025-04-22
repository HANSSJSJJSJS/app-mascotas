import React from "react";
import { useForm } from "react-hook-form";
import "../../stylos/cssFormularios/FormularioCita.css";

function FormularioCita() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = handleSubmit(data => {
        console.log(data);
        reset();
    });

    return (
        <div className="container">
            <form onSubmit={onSubmit}>
                <h1>Registro de Cita</h1>

                <label>
                    Nombre del Propietario:
                    <input
                        type="text"
                        {...register("nombrePropietario", {
                            required: "El nombre del propietario es obligatorio",
                            minLength: { value: 3, message: "Debe tener al menos 3 caracteres" },
                            maxLength: { value: 50, message: "No puede tener más de 50 caracteres" },
                            pattern: { value: /^[A-Za-z\s]+$/, message: "Solo se permiten letras y espacios" }
                        })}
                    />
                    {errors.nombrePropietario && <p>{errors.nombrePropietario.message}</p>}
                </label>

                <label>
                    Nombre de la Mascota:
                    <input
                        type="text"
                        {...register("nombreMascota", {
                            required: "El nombre de la mascota es obligatorio",
                            minLength: { value: 3, message: "Debe tener al menos 3 caracteres" },
                            maxLength: { value: 30, message: "No puede tener más de 30 caracteres" },
                            pattern: { value: /^[A-Za-z\s]+$/, message: "Solo se permiten letras y espacios" }
                        })}
                    />
                    {errors.nombreMascota && <p>{errors.nombreMascota.message}</p>}
                </label>

                <label>
                    Fecha:
                    <input
                        type="date"
                        {...register("fecha", {
                            required: "La fecha es obligatoria",
                            validate: {
                                noPastDates: value => new Date(value) >= new Date().setHours(0, 0, 0, 0) || "No se permiten fechas pasadas",
                                noFutureDates: value => new Date(value) <= new Date(new Date().setFullYear(new Date().getFullYear() + 1)) || "La fecha no puede ser mayor a un año desde hoy",
                                noSundays: value => new Date(value).getDay() !== 0 || "No se permiten citas los domingos"
                            }
                        })}
                    />
                    {errors.fecha && <p>{errors.fecha.message}</p>}
                </label>

                <label>
                    Hora:
                    <input
                        type="time"
                        {...register("hora", {
                            required: "La hora es obligatoria",
                            validate: value => {
                                const [hours, minutes] = value.split(":").map(Number);
                                const totalMinutes = hours * 60 + minutes;
                                if (totalMinutes < 480 || totalMinutes > 1080) return "La hora debe estar entre las 8:00 AM y las 6:00 PM";
                                if (totalMinutes >= 720 && totalMinutes < 840) return "No se permiten citas entre 12:00 PM y 2:00 PM";
                                return true;
                            }
                        })}
                    />
                    {errors.hora && <p>{errors.hora.message}</p>}
                </label>

                <label>
                    Servicio:
                    <select {...register("idServicio", { required: "El servicio es obligatorio" })}>
                        <option value="">Seleccionar servicio</option>
                        <option value="1">Checkup</option>
                        <option value="2">Vacunación</option>
                        <option value="3">Desparasitación</option>
                        <option value="4">Cirugía</option>
                    </select>
                    {errors.idServicio && <p>{errors.idServicio.message}</p>}
                </label>

                <label>
                    Veterinario:
                    <select {...register("idVeterinario", { required: "El veterinario es obligatorio" })}>
                        <option value="">Seleccionar veterinario</option>
                        <option value="1">Dra. María López</option>
                        <option value="2">Dr. Juan Pérez</option>
                        <option value="3">Dra. Ana García</option>
                        <option value="4">Dr. Carlos Rodríguez</option>
                        <option value="5">Dra. Laura Martínez</option>
                    </select>
                    {errors.idVeterinario && <p>{errors.idVeterinario.message}</p>}
                </label>

                <button type="submit">Registrar</button>
            </form>
        </div>
    );
}

export default FormularioCita;



