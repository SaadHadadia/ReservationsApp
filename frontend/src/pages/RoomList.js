import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RoomList = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get('/api/rooms');
                setRooms(response.data);
            } catch (err) {
                setError('Erreur lors du chargement des salles');
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const handleReserve = (roomId) => {
        navigate(`/reservations/create?roomId=${roomId}`);
    };

    if (loading) {
        return <div className="text-center mt-8">Chargement...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-8">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Liste des salles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map(room => (
                    <div key={room.id} className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                        <p className="text-gray-600 mb-4">{room.description}</p>
                        <div className="mb-4">
                            <span className="font-semibold">Capacité :</span> {room.capacity} personnes
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">Équipements :</span>
                            <ul className="list-disc list-inside">
                                {room.equipment.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <button
                            onClick={() => handleReserve(room.id)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        >
                            Réserver
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoomList; 