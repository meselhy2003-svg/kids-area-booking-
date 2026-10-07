import { useState, useEffect, useCallback } from 'react';
import { ticketService } from '../api/ticketService';
import { challengeGameTickets, adventureGameTickets } from '../data/mock/tickets.mock';
import { useAuth } from '../context/AuthContext';

export function useTickets(zone = 'challenge') {
  const initialGames = zone === 'adventure' ? adventureGameTickets : challengeGameTickets;
  const [gameTickets, setGameTickets] = useState(initialGames);
  const [loading, setLoading] = useState(false);
  const { user, addPassToWallet } = useAuth();

  useEffect(() => {
    let isMounted = true;
    async function loadGames() {
      setLoading(true);
      try {
        const games = await ticketService.getGameTickets(zone);
        if (isMounted && games) {
          setGameTickets(games);
          console.log(`[useTickets] Loaded game tickets data for zone "${zone}":`, games);
        }
      } catch (e) {
        console.warn('Failed to load game tickets:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadGames();
    return () => { isMounted = false; };
  }, [zone]);

  const reservePass = useCallback(async (ticketData) => {
    const res = await ticketService.createBooking({
      ...ticketData,
      phone: ticketData.phone || user?.phone || '',
      name: ticketData.name || user?.name || 'Valued Visitor'
    });
    return res;
  }, [user]);

  return {
    gameTickets,
    loading,
    userActivePasses: user?.activePasses || [],
    reservePass
  };
}
