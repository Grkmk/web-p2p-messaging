import React from 'react'

/**
 A functional component that renders instructions on how to use the web app.
 @returns {JSX.Element} A React element representing the instructions component.
 */
export function Instructions() {
    return (
        <div>
            <h3>How to use</h3>
            <hr />
            <br />
            There are two ways to connect to a peer, invite or be invited. In either approach, both peers need to have &
            keep the website open.
            <br />
            <br />
            Inviting a peer
            <ol>
                <li>Generate an invite offer (see the left panel)</li>
                <li>Send the generated offer to the party you would like to invite by any means</li>
                <li>Ask your peer to generate an answer with the invite you sent and send it to you</li>
                <li>Find the peer under the inactive peers list on the left panel</li>
                <li>Place and submit the received answer to establish connection</li>
                <li>Find & click on the user in the active list to open the message panel</li>
            </ol>
            Receiving an invite
            <ol>
                <li>Place & submit the received invite offer (see the left panel)</li>
                <li>Send the generated answer to the peer by any means</li>
                <li>
                    Wait for your peer place & submit your generated answer. If a connection was successfully
                    established, the peer should appear in the active peers list
                </li>
                <li>Click on the user in the active list to open the message panel</li>
            </ol>
        </div>
    )
}
