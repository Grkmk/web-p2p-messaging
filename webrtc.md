# WebRTC (web real-time communication)
For detailed info, see [docs](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)


### Basic flow
1. establish and open connection with RTCPeerConnection
2. add MediaStream(s) and/or RTCDataChannel(s) to connection
	- MediaStream
		consists of any number of tracks of media
		tracks have MediaStreamTrack interface
		can transfer audio, video and text
	- RTCDataChannel
		for transfering binary data
3. mostly supported by browsers (adapter.js as shim)


### Signaling
- setting up a connection requires initial information exchange
- can be achieved with anything from intermediary servers to pigeons
- Offer & Answer session descriptions (SDP) need to be exchanged
	- local description for self, remote for receiving end
	- if format changes, offer/answer process needs to be performed again
- brief flow (initiator as Peer A):
	- A 
		- creates offer
		- adds handlers for `icecandidate` & `track`
		- sends offer to B using a signaling method
	- B
		- (assuming successful) receives offer
		- creates answer
		- adds handlers for `icecandidate` & `track`
		- responds via the same channel
- detailed flow
	1. Peer A:
		1. captures local Media via `MediaDevices.getUserMedia`
		2. creates `RTCPeerConnection`
		3. calls `RTCPeerConnection.addTrack()`
		4. calls `RTCPeerConnection.createOffer()`
		5. calls `RTCPeerConnection.setLocalDescription()`
		6. asks STUN servers to generate ice candidates
		7. uses the signaling method to transmit the offer to Peer B.
	2. Peer B:
		1. receives the offer
		2. calls `RTCPeerConnection.setRemoteDescription()` to record it as the remote description
		3. does any setup it needs to do for its end of the call: capture its local media, and attach each media tracks into the peer connection via `RTCPeerConnection.addTrack()`
		4. creates an answer by `RTCPeerConnection.createAnswer()`
		5. calls `RTCPeerConnection.setLocalDescription()`, passing in the created answer, to set the answer as its local description. (Peer B now knows the configuration of both ends of the connection)
		6. uses the signaling server to send the answer to Peer A.
	3. Peer A:
		1. receives the answer
		2. calls `RTCPeerConnection.setRemoteDescription()` to set the answer as the remote description for its end of the call
	
	Both peers now know the configuration of each other. Media begins to flow as configured.


### Protocols
- ICE (interactive connectivity establishment)
	- framework for web browsers to connect to peers
	- bypasses firewalls
	- gives unique address to peers (STUN)
	- if peer's router doesn't allow peer connection, relay data through server (TURN)

- STUN (session traversal utilities for NAT)
	- protocol to discover one's public IP
	- checks if there are router restrictions preventing direct p2p
	- flow:
		1. client req to STUN
		2. STUN res to client with public IP
		3. STUN req to client IP to check for restrictions
	
- NAT (network address translation)
	- router public IP + device (private) IP provided by router
	- some routers employ Symmetric NAT, only allowing connections to previously connected peers

- TURN (traversal using relays around NAT)
	- only used if there are no alternatives (introduces overhead)
	- instruct peers to establish and relay comms through TURN server

- SDP (session description protocol)
	- more like data format describing media connection
	- one or more lines of:
		`<char designated for type>=<formatted type value>`
	

