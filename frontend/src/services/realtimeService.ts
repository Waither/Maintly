/**
 * Realtime Service (WebSocket)
 *
 * Central client for realtime events with auto-reconnect.
 * UI should always keep polling fallback to remain resilient.
 */

import apiClient from '../lib/axios';

export interface RealtimeEvent {
    type: string;
    payload?: unknown;
    ts?: string;
}

type RealtimeListener = (event: RealtimeEvent) => void;

class RealtimeService {
    private ws: WebSocket | null = null;
    private reconnectTimer: number | null = null;
    private pulseTimer: number | null = null;
    private lastPulseSince: string | null = null;
    private reconnectAttempts = 0;
    private wsFailures = 0;
    private wsDisabledUntil = 0;
    private readonly listeners = new Set<RealtimeListener>();
    private readonly wsUrl: string | undefined = import.meta.env.VITE_WS_URL;

    subscribe(listener: RealtimeListener): () => void {
        this.listeners.add(listener);
        this.ensureConnected();
        this.ensurePulsePolling();

        return () => {
            this.listeners.delete(listener);

            // Close socket when nobody listens anymore.
            if (this.listeners.size === 0) {
                this.cleanupSocket();
                this.clearReconnectTimer();
                this.clearPulseTimer();
                this.reconnectAttempts = 0;
                this.wsFailures = 0;
                this.wsDisabledUntil = 0;
                this.lastPulseSince = null;
            }
        };
    }

    private ensureConnected() {
        if (!this.wsUrl) {
            return;
        }

        if (!navigator.onLine) {
            return;
        }

        if (!this.wsUrl.startsWith('ws://') && !this.wsUrl.startsWith('wss://')) {
            return;
        }

        if (Date.now() < this.wsDisabledUntil) {
            return;
        }

        if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
            return;
        }

        this.connect();
    }

    private ensurePulsePolling() {
        if (this.pulseTimer !== null) {
            return;
        }

        this.pulseTimer = window.setInterval(() => {
            this.pollPulse().catch(() => {
                // Silent by design, UI already has polling fallback at feature level.
            });
        }, 10000);

        this.pollPulse().catch(() => {
            // Best-effort initial poll.
        });
    }

    private async pollPulse() {
        if (!navigator.onLine) {
            return;
        }

        const response = await apiClient.get('/realtime/pulse', {
            params: this.lastPulseSince ? { since: this.lastPulseSince } : {},
        });

        const data = response.data as { serverTime?: string; events?: RealtimeEvent[] };

        if (Array.isArray(data.events)) {
            data.events.forEach((event) => {
                if (event && typeof event.type === 'string') {
                    this.emit(event);
                }
            });
        }

        if (typeof data.serverTime === 'string' && data.serverTime.length > 0) {
            this.lastPulseSince = data.serverTime;
        }
    }

    private connect() {
        if (!this.wsUrl) {
            return;
        }

        try {
            this.ws = new WebSocket(this.wsUrl);
        } catch (error) {
            console.error('Realtime: WebSocket init failed', error);
            this.scheduleReconnect();
            return;
        }

        this.ws.onopen = () => {
            this.reconnectAttempts = 0;
            this.wsFailures = 0;
            this.wsDisabledUntil = 0;
            this.emit({ type: '__connected', ts: new Date().toISOString() });
        };

        this.ws.onmessage = (message) => {
            try {
                const parsed = JSON.parse(message.data) as RealtimeEvent;
                if (parsed && typeof parsed.type === 'string') {
                    this.emit(parsed);
                    return;
                }
            } catch {
                // Non-JSON messages are ignored intentionally.
            }
        };

        this.ws.onerror = () => {
            this.wsFailures += 1;
            this.emit({ type: '__error', ts: new Date().toISOString() });
        };

        this.ws.onclose = () => {
            this.emit({ type: '__disconnected', ts: new Date().toISOString() });

            // If endpoint is consistently unavailable, pause WS retries and rely on pulse.
            if (this.wsFailures >= 3) {
                this.wsDisabledUntil = Date.now() + 5 * 60 * 1000;
                this.clearReconnectTimer();
                return;
            }

            if (this.listeners.size > 0) {
                this.scheduleReconnect();
            }
        };
    }

    private scheduleReconnect() {
        this.clearReconnectTimer();

        const backoffMs = Math.min(30000, 1000 * Math.pow(2, this.reconnectAttempts));
        this.reconnectAttempts += 1;

        this.reconnectTimer = window.setTimeout(() => {
            this.connect();
        }, backoffMs);
    }

    private clearReconnectTimer() {
        if (this.reconnectTimer) {
            window.clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
    }

    private clearPulseTimer() {
        if (this.pulseTimer) {
            window.clearInterval(this.pulseTimer);
            this.pulseTimer = null;
        }
    }

    private cleanupSocket() {
        if (!this.ws) {
            return;
        }

        this.ws.onopen = null;
        this.ws.onmessage = null;
        this.ws.onclose = null;
        this.ws.onerror = null;

        if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
            this.ws.close();
        }

        this.ws = null;
    }

    private emit(event: RealtimeEvent) {
        this.listeners.forEach((listener) => listener(event));
    }
}

export const realtimeService = new RealtimeService();
