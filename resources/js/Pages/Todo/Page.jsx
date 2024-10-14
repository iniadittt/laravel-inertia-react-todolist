import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import InputError from "@/Components/InputError";
import { router } from "@inertiajs/react";

export default function TodoPage({ todos }) {
    const [showModal, setShowModal] = useState(false);
    const [currentTodo, setCurrentTodo] = useState({
        id: "",
        title: "",
    });
    const [isUpdate, setIsUpdate] = useState(false);
    const [flashMessage, setFlashMessage] = useState({
        success: null,
        error: null,
    });

    const { flash } = usePage().props;

    const { data, setData, reset, errors, processing, post, patch } = useForm({
        id: "",
        title: "",
        description: "",
    });

    useEffect(() => {
        setFlashMessage(flash);
    }, [flash]);

    const searchTodo = (e, id) => {
        e.preventDefault();
        const search = todos.find((todo) => todo.id === id);
        setData((prev) => ({
            ...prev,
            id: search.id,
            title: search.title,
            description: search.description,
        }));
        setIsUpdate(true);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("todo.store"), {
            onSuccess: () => reset("title", "description"),
        });
    };

    const update = (e) => {
        e.preventDefault();
        patch(route("todo.update", { id: data.id }), {
            onSuccess: () => reset("title", "description"),
        });
    };

    const resetForm = (e) => {
        e.preventDefault();
        setData({
            id: "",
            title: "",
            description: "",
        });
        setIsUpdate(false);
    };

    const openModal = (e, id, title) => {
        setShowModal(true);
        setCurrentTodo((prev) => ({
            ...prev,
            id,
            title,
        }));
    };

    const closeModal = () => {
        setCurrentTodo((prev) => ({
            ...prev,
            id: "",
            title: "",
        }));
        setShowModal(false);
    };

    const deleteTodo = (e) => {
        e.preventDefault();
        console.log('DELETE TODO')
        router.delete(route("todo.destroy", currentTodo.id), {
            onFinish: () => closeModal(),
            onSuccess: () => reset("title", "description"),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Todolist
                </h2>
            }
        >
            <Head title="Todolist" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 border-gray-900/10 pb-12">
                <div className="mt-8">
                    {flashMessage.success && (
                        <p className="text-green-800 bg-green-300 w-full rounded-md text-sm py-3 px-4 my-4">
                            {flash.success}
                        </p>
                    )}
                    {flashMessage.error && (
                        <p className="text-red-800 bg-red-300 w-full rounded-md text-sm py-3 px-4 my-4">
                            {flash.error}
                        </p>
                    )}
                    <form
                        onSubmit={isUpdate ? update : submit}
                        className="grid grid-cols-1 gap-x-6 gap-y-4"
                    >
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Title
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={data.title}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.title}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Deskripsi
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="description"
                                    id="description"
                                    value={data.description}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.description}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-start gap-x-2">
                            <button
                                type="submit"
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {isUpdate ? "Update" : "Simpan"}
                            </button>
                            <button
                                type="reset"
                                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                onClick={resetForm}
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>

                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-black opacity-50 fixed inset-0"></div>
                        <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg z-10">
                            <h3 className="text-lg font-semibold mb-4">
                                Konfirmasi Hapus
                            </h3>
                            <p>
                                Apakah Anda yakin ingin menghapus todo dengan
                                judul :{" "}
                                <span className="font-bold">
                                    {currentTodo?.title}
                                </span>
                                ?
                            </p>
                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={closeModal}
                                    className="mr-3 px-4 py-2 bg-gray-300 rounded-md"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={(e) => deleteTodo(e)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <h1 className="mt-12 mb-8 font-extrabold text-3xl text-center">
                    TODOLIST
                </h1>
                <table className="mt-4 bg-white w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300">
                    <thead>
                        <tr className="h-12">
                            <th>Title</th>
                            <th>Deskripsi</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {todos.map((todo, index) => (
                            <tr key={index}>
                                <td className="w-2/6 py-2 px-8 align-text-top">
                                    {todo.title || "-"}
                                </td>
                                <td className="w-3/6 py-2 px-8 align-text-top">
                                    {todo.description || "-"}
                                </td>
                                <td className="w-1/6 py-2 px-8 flex gap-1 align-text-top">
                                    <button
                                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                        onClick={(e) => searchTodo(e, todo.id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                                        onClick={(e) =>
                                            openModal(e, todo.id, todo.title)
                                        }
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
}
