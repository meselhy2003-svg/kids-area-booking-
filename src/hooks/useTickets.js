import { useState, useEffect, useCallback } from 'react';
import { ticketService, mapZoneToPage } from '../api/ticketService';
import {
  kidsAreaOffers,
  funParkOffers,
  challengeGameTickets,
  adventureGameTickets
} from '../data/mock/tickets.mock';
import { useAuth } from '../context/AuthContext';

const getInitialFallback = (zone) => {
  const mapped = mapZoneToPage(zone);
  if (mapped === 'kidsArea') return kidsAreaOffers;
  if (mapped === 'funZone') return [...funParkOffers.weekend, ...funParkOffers.midweek];
  if (mapped === 'adventureZone') return adventureGameTickets;
  return challengeGameTickets;
};

export function useTickets(zone = 'challenge') {
  const [tickets, setTickets] = useState(() => getInitialFallback(zone));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ticketService.getOffers(zone);
      if (data && data.length > 0) {
        setTickets(data);
        console.log(`[useTickets] Loaded ${data.length} tickets for zone "${zone}":`, data);
      }
    } catch (e) {
      console.warn(`[useTickets] Failed to load tickets for "${zone}":`, e);
      setError(e.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }, [zone]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const reservePass = useCallback(async (ticketData) => {
    const res = await ticketService.createBooking({
      ...ticketData,
      phone: ticketData.phone || user?.phone || '',
      name: ticketData.name || user?.name || 'Valued Visitor'
    });
    return res;
  }, [user]);

  return {
    tickets,
    gameTickets: tickets, // alias for backwards compatibility
    loading,
    error,
    refetch: loadTickets,
    userActivePasses: user?.activePasses || [],
    reservePass
  };
}

