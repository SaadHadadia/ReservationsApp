import React, { useState, useEffect } from 'react';
import api from '../../api/config';

const ReservationManagement = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        status: 'ALL',
        room: 'ALL',
        user: 'ALL'
    });

    useEffect(() => {
        fetchReservations();
    }, [filters]);

    const fetchReservations = async () => {
        try {
            const response = await api.get('/admin/reservations', {
                params: filters
            });
            setReservations(response.data);
            setLoading(false);
        } catch (err) {
            setError('Erreur lors de la récupération des réservations');
            setLoading(false);
        }
    };

    const handleStatusChange = async (reservationId, newStatus) => {
        try {
            await api.put(`/admin/reservations/${reservationId}/status`, { status: newStatus });
            fetchReservations();
        } catch (err) {
            setError('Erreur lors de la modification du statut');
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Gestion des Réservations</h2>

            {/* Filtres */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Filtres</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Statut</label>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="ALL">Tous</option>
                            <option value="PENDING">En attente</option>
                            <option value="APPROVED">Approuvé</option>
                            <option value="REJECTED">Rejeté</option>
                            <option value="CANCELLED">Annulé</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Salle</label>
                        <select
                            name="room"
                            value={filters.room}
                            onChange={handleFilterChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="ALL">Toutes</option>
                            {/* Ajouter les salles ici */}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Utilisateur</label>
                        <select
                            name="user"
                            value={filters.user}
                            onChange={handleFilterChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="ALL">Tous</option>
                            {/* Ajouter les utilisateurs ici */}
                        </select>
                    </div>
                </div>
            </div>

            {/* Liste des réservations */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Utilisateur
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Salle
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Heure de début
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Heure de fin
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Statut
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {reservations.map((reservation) => (
                            <tr key={reservation.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{reservation.user.fullName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{reservation.room.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {new Date(reservation.startTime).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {new Date(reservation.startTime).toLocaleTimeString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {new Date(reservation.endTime).toLocaleTimeString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={reservation.status}
                                        onChange={(e) => handleStatusChange(reservation.id, e.target.value)}
                                        className="border rounded px-2 py-1"
                                    >
                                        <option value="PENDING">En attente</option>
                                        <option value="APPROVED">Approuvé</option>
                                        <option value="REJECTED">Rejeté</option>
                                        <option value="CANCELLED">Annulé</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button
                                        onClick={() => handleStatusChange(reservation.id, 'CANCELLED')}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Annuler
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

export default ReservationManagement; 