import React, { useContext } from 'react'
import { Button, TextInput, Label, Checkbox, Spinner } from 'flowbite-react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { customAlert } from '../../config/alerts/alert';
import { useNavigate } from 'react-router-dom';
import AxiosClient from '../../config/http-client/axios-client';
import AuthContext from '../../config/context/auth-context'


const SignInPage = () => {
    //Formik nos ayuda a controlar los formularios 

    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: yup.object().shape({
            username: yup.string().required("Campo obligatorio"),
            password: yup.string().required("Campo obligatorio")
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await AxiosClient({
                    url: "/auth/signin",
                    method: "POST",
                    data: values
                });
                if (!response.error) {
                    /**
                     * Tenemos que validar que rol tiene -> Redireccionarlo a su página principal
                     */
                    const role = response.data.roles[0].name;
                    switch (role) {
                        case "ADMIN_ROLE":
                            dispatch({ type: "SIGNIN", payload: response.data });     //Es el metodo que utiliza nuestro contexto para indicar si un usuario inicio sesión y con que metodo inicio sesión
                            navigate("/admin", { replace: true });
                            break;
                        case "CLIENT_ROLE":
                            dispatch({ type: "SIGNIN", payload: response.data });     //Es el metodo que utiliza nuestro contexto para indicar si un usuario inicio sesión y con que metodo inicio sesión
                            navigate("/client", { replace: true });
                            break;
                        case "USER_ROLE":
                            dispatch({ type: "SIGNIN", payload: response.data });     //Es el metodo que utiliza nuestro contexto para indicar si un usuario inicio sesión y con que metodo inicio sesión
                            navigate("/user", { replace: true });
                            break;
                    }
                } else throw Error("Error");
            } catch (error) {
                customAlert("Iniciar sesión",
                    "Usuario y/o contraseña incorrectos",
                    'info'
                );
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <>
            <div className={" w-screen h-screen flex justify-center"}>
                <section className="bg-gray-50 dark:bg-gray-900 w-full  max-w-lg">
                    <div
                        className="flex flex-col items-center px-4 mx-auto"
                        style={{ marginTop: "5rem" }}
                    >
                        <div
                            className="w-full bg-white rounded-lg shadow shadow-zinc-300 dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                <h1 className="text-xl font-bold text-center leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    Almacen App
                                </h1>
                                <form
                                    className="space-y-4 md:space-y-6"
                                    onSubmit={formik.handleSubmit}
                                    noValidate
                                >
                                    <div>
                                        <label
                                            htmlFor="username"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Usuario
                                        </label>
                                        <TextInput
                                            type="text"
                                            name="username"
                                            value={formik.values.username}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            helperText={
                                                formik.errors.username && formik.touched.username ? (
                                                    <span className="text-red-600">
                                                        {formik.errors.username}
                                                    </span>
                                                ) : null
                                            }
                                            id="username"
                                            placeholder="erielit"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Contraseña
                                        </label>
                                        <TextInput
                                            type="password"
                                            name="password"
                                            value={formik.values.password}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            helperText={
                                                formik.errors.password && formik.touched.password ? (
                                                    <span className="text-red-600">
                                                        {formik.errors.password}
                                                    </span>
                                                ) : null
                                            }
                                            id="password"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <a
                                            href="#"
                                            className="text-sm font-medium text-teal-600 hover:underline dark:text-primary-500"
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </a>
                                    </div>
                                    <Button
                                        type="submit"
                                        color="light"
                                        className="w-full"
                                        disabled={formik.isSubmitting || !formik.isValid}
                                    >
                                        {formik.isSubmitting ? (
                                            <Spinner />
                                        ) : (
                                            <>
                                                Iniciar sesión
                                                <svg
                                                    className="w-6 h-6 text-gray-800 dark:text-white"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"
                                                    />
                                                </svg>
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

//<></> -> Fragments
export default SignInPage