import React, { useState, useEffect } from 'react';
import api from '../../api/config';

const RoomManagement = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newRoom, setNewRoom] = useState({
        name: '',
        capacity: '',
        description: '',
        equipment: ''
    });

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await api.get('/admin/rooms');
            setRooms(response.data);
            setLoading(false);
        } catch (err) {
            setError('Erreur lors de la récupération des salles');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRoom(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/rooms', newRoom);
            setNewRoom({
                name: '',
                capacity: '',
                description: '',
                equipment: ''
            });
            fetchRooms();
        } catch (err) {
            setError('Erreur lors de la création de la salle');
        }
    };

    const handleDelete = async (roomId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette salle ?')) {
            try {
                await api.delete(`/admin/rooms/${roomId}`);
                fetchRooms();
            } catch (err) {
                setError('Erreur lors de la suppression de la salle');
            }
        }
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Gestion des Salles</h2>
            
            {/* Formulaire d'ajout de salle */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Ajouter une nouvelle salle</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nom</label>
                        <input
                            type="text"
                            name="name"
                            value={newRoom.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Capacité</label>
                        <input
                            type="number"
                            name="capacity"
                            value={newRoom.capacity}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={newRoom.description}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            rows="3"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Équipement</label>
                        <input
                            type="text"
                            name="equipment"
                            value={newRoom.equipment}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Ajouter la salle
                    </button>
                </form>
            </div>

            {/* Liste des salles */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nom
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Capacité
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Équipement
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {rooms.map((room) => (
                            <tr key={room.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{room.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{room.capacity}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">{room.description}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{room.equipment}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button
                                        onClick={() => handleDelete(room.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RoomManagement; 