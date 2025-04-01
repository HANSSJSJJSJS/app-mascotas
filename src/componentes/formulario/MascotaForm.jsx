import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "../stylos/MascotaForm.css";

function MascotaForm() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [imagePreview, setImagePreview] = useState(null);

    const onSubmit = (data) => {
        console.log(data);
        reset();
        setImagePreview(null);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
    <div className="container">
        <div className="form-container">
            <h2 className="form-title">Registro de Mascota</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="image-upload-container">
                    <label htmlFor="imagen" className="image-upload-label">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Vista previa" className="image-preview" />
                        ) : (
                            <span>Subir Imagen</span>
                        )}
                    </label>
                    <input type="file" id="imagen" accept="image/*" onChange={handleImageChange} className="image-upload-input" />
                </div>

                <div className="form-group">
                    <label htmlFor="id">ID:</label>
                    <input type="text" id="id" {...register("id", { required: "El ID es obligatorio" })} />
                    {errors.id && <p className="error-message">{errors.id.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="nombre">Nombre:</label>
                    <input type="text" id="nombre" {...register("nombre", { required: "El nombre es obligatorio" })} />
                    {errors.nombre && <p className="error-message">{errors.nombre.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="especie">Especie:</label>
                    <input type="text" id="especie" {...register("especie", { required: "La especie es obligatoria" })} />
                    {errors.especie && <p className="error-message">{errors.especie.message}</p>}
                </div>

                <div className="form-group">
                        <label htmlFor="raza">Raza:</label>
                        <input
                            type="text"
                            id="raza"
                            {...register("raza", { required: "La raza es obligatoria" })}
                        />
                        {errors.raza && <p className="error-message">{errors.raza.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="edad">Edad:</label>
                    <input type="text" id="edad" {...register("edad", { required: "La edad es obligatoria", min: 0 })} />
                    {errors.edad && <p className="error-message">{errors.edad.message}</p>}
                </div>

                <div id="checklist">
                    <input value="Hembra" type="radio" id="01" {...register("genero", { required: "El género es obligatorio" })} />
                    <label htmlFor="01">Hembra</label>

                    <input value="Macho" type="radio" id="02" {...register("genero", { required: "El género es obligatorio" })} />
                    <label htmlFor="02">Macho</label>
                    
                    {errors.genero && <p className="error-message">{errors.genero.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="peso">Peso (kg):</label>
                    <input type="text" id="peso" {...register("peso", { required: "El peso es obligatorio", min: 0 })} />
                    {errors.peso && <p className="error-message">{errors.peso.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="documentoPropietario">Documento del Propietario:</label>
                    <input 
                        type="text" 
                        id="numeroId" 
                        {...register("numeroId", {
                            required: "El número de documento es obligatorio",
                            pattern: { value: /^[0-9]+$/, message: "Solo números" },
                            maxLength: { value: 10, message: "Máximo 10 dígitos" },
                            minLength: { value: 6, message: "Mínimo 6 dígitos" }
                        })} 
                    />
                    {errors.numeroId && (
                        <p className="error-message">{errors.numeroId.message}</p>
                    )}
                </div>

                <button type="submit" className="submit-button">Registrar Mascota</button>
            </form>
        </div>
    </div>
    );
}

export default MascotaForm;