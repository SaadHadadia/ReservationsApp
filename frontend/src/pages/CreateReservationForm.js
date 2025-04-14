import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const CreateReservationForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const roomId = new URLSearchParams(location.search).get('roomId');

    const [formData, setFormData] = useState({
        date: '',
        timeSlot: '',
        purpose: ''
    });
    const [room, setRoom] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRoomAndTimeSlots = async () => {
            try {
                const [roomResponse, timeSlotsResponse] = await Promise.all([
                    axios.get(`/api/rooms/${roomId}`),
                    axios.get('/api/time-slots')
                ]);
                setRoom(roomResponse.data);
                setTimeSlots(timeSlotsResponse.data);
            } catch (err) {
                setError('Erreur lors du chargement des données');
            } finally {
                setLoading(false);
            }
        };

        if (roomId) {
            fetchRoomAndTimeSlots();
        }
    }, [roomId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/reservations', {
                ...formData,
                roomId
            });
            navigate('/my-reservations');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la création de la réservation');
        }
    };

    if (loading) {
        return <div className="text-center mt-8">Chargement...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-8">{error}</div>;
    }

    if (!room) {
        return <div className="text-center mt-8">Salle non trouvée</div>;
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Réserver {room.name}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                        Date
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="timeSlot">
                        Créneau horaire
                    </label>
                    <select
                        id="timeSlot"
                        name="timeSlot"
                        value={formData.timeSlot}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    >
                        <option value="">Sélectionnez un créneau</option>
                        {timeSlots.map(slot => (
                            <option key={slot.id} value={slot.id}>
                                {slot.startTime} - {slot.endTime}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="purpose">
                        Motif de la réservation
                    </label>
                    <textarea
                        id="purpose"
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        rows="4"
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Réserver
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/rooms')}
                        className="text-blue-500 hover:text-blue-800"
                    >
                        Retour
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateReservationForm; 