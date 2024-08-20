import { WebRTC, WebSockets, WebSocketsSecure, WebTransport, Circuit } from '@multiformats/multiaddr-matcher'
import { Libp2p } from 'libp2p'

export function getPeerTypes(libp2p:Libp2p) {
  const types = {
    'Circuit Relay': 0,
    WebRTC: 0,
    WebSockets: 0,
    'WebSockets (secure)': 0,
    WebTransport: 0,
    Other: 0,
  }

  libp2p
    .getConnections()
    .map((conn) => conn.remoteAddr)
    .forEach((ma) => {
      if (WebRTC.exactMatch(ma) || ma.toString().includes('/webrtc/')) {
        types['WebRTC']++
      } else if (WebSockets.exactMatch(ma)) {
        types['WebSockets']++
      } else if (WebSocketsSecure.exactMatch(ma)) {
        types['WebSockets (secure)']++
      } else if (WebTransport.exactMatch(ma)) {
        types['WebTransport']++
      } else if (Circuit.exactMatch(ma)) {
        types['Circuit Relay']++
      } else {
        types['Other']++
        console.info('wat', ma.toString())
      }
    })

  return types
}

const supportedProtocols = new Set([
  'ip4', 'ip6', 'dns4', 'dns6', 'dnsaddr', 'tcp', 'udp', 'quic-v1', 'ws', 'wss', 'webtransport', 
  'webrtc', 'certhash', 'p2p-circuit', 'p2p-webrtc-star', 'p2p-webrtc-direct', 
  'p2p-websocket-star', 'memory', 'unix', 'p2p'
]);

export const extractProtocols = (multiaddr: string): string[] => {
  const parts = multiaddr.split("/").filter(Boolean);
  const protocols: string[] = [];

  for (const part of parts) {
    if (supportedProtocols.has(part)) {
      protocols.push(part);
    }
  }

  return protocols;
};