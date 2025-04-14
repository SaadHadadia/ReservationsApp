import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import RoomList from './RoomList';

const Dashboard = () => {
    const { user } = useAuth();

    useEffect(() => {
        console.log('Dashboard mounted');
        console.log('Current user:', user);
    }, [user]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <RoomList />
        </div>
    );
};

export default Dashboard;