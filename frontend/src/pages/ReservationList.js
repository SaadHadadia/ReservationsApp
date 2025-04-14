import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ReservationList = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get('/api/reservations/my-reservations');
                setReservations(response.data);
            } catch (err) {
                setError('Erreur lors du chargement des réservations');
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    const handleCancel = async (reservationId) => {
        if (window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
            try {
                await axios.delete(`/api/reservations/${reservationId}`);
                setReservations(reservations.filter(r => r.id !== reservationId));
            } catch (err) {
                setError('Erreur lors de l\'annulation de la réservation');
            }
        }
    };

    if (loading) {
        return <div className="text-center mt-8">Chargement...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-8">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Mes réservations</h2>
            {reservations.length === 0 ? (
                <p className="text-center text-gray-600">Aucune réservation trouvée</p>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {reservations.map(reservation => (
                        <div key={reservation.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">{reservation.room.name}</h3>
                                    <p className="text-gray-600 mb-2">
                                        <span className="font-semibold">Date :</span> {new Date(reservation.date).toLocaleDateString()}
                                    </p>
                                    <p className="text-gray-600 mb-2">
                                        <span className="font-semibold">Créneau :</span> {reservation.timeSlot}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-semibold">Statut :</span> {reservation.status}
                                    </p>
                                </div>
                                {reservation.status === 'PENDING' && (
                                    <button
                                        onClick={() => handleCancel(reservation.id)}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        Annuler
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReservationList; 